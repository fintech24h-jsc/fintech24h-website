/**
 * Fintech24h — Lead Capture Backend (Google Apps Script)
 * ======================================================
 * Receives form submissions from fintech24h.com and fans them out to:
 *   1. Google Sheet  (one row per lead)
 *   2. Telegram      (instant notification to your team chat)
 *   3. Email         (to fintech24hvn@gmail.com)
 *
 * DealMakers' Club has TWO fully separate pipelines, each with its own
 * sheet tab, Telegram message, and email, so staff never have to dig
 * through regular website leads to find them:
 *
 *   - formType 'dealmakers-ss3'                → sheet "DealMakers Apply to Join"
 *   - formType 'dealmakers-ss3-telegram-join'   → sheet "DealMakers Telegram Join"
 *
 * JOB APPLICATIONS (careers form) have their own pipeline too:
 *
 *   - formType starting with 'Job Application'  → sheet "Job Applications",
 *     CV saved to Google Drive, HR Telegram alert, email WITH the CV attached.
 *
 * Every OTHER form type (Service Inquiry, Contact, etc.) goes through the
 * ORIGINAL general-leads path — sheet "Leads" — completely unchanged from
 * before either DealMakers feature existed.
 *
 * SETUP — do this once:
 *   1. Open the Google Sheet you want leads stored in → Extensions → Apps Script.
 *   2. Delete any existing code, paste THIS entire file.
 *   3. Fill in TELEGRAM_TOKEN, TELEGRAM_CHAT_ID and JOB_DRIVE_FOLDER_ID below
 *      (the repo copy has PASTE_… placeholders on purpose: secrets never go in git).
 *   4. Click Deploy → New deployment → type "Web app".
 *        - Execute as:      Me
 *        - Who has access:  Anyone
 *   5. Copy the /exec URL → paste into the website .env as
 *        PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=...
 *   6. Whenever you change this code, Deploy → Manage deployments → Edit → New version.
 *      (Reuse the SAME deployment — creating a new one changes the /exec URL
 *      and breaks the site until you update the env var.)
 *   7. The job-application branch uses Google Drive and mail attachments, so the
 *      first deploy after adding it asks you to re-authorize the script
 *      (Drive + Gmail permissions). Approve it once.
 *
 * GET TELEGRAM CREDENTIALS:
 *   - Bot token: message @BotFather → /newbot → copy the token.
 *   - Chat ID:   add the bot to your group, send any message, then open
 *       https://api.telegram.org/bot<TOKEN>/getUpdates and read "chat":{"id":...}.
 *     For a personal chat, message @userinfobot to get your numeric ID.
 */

// ── CONFIG ───────────────────────────────────────────────────────────────
var TELEGRAM_TOKEN   = 'PASTE_TELEGRAM_BOT_TOKEN_HERE';
var TELEGRAM_CHAT_ID = 'PASTE_TELEGRAM_CHAT_ID_HERE';
var EMAIL_TO         = 'fintech24hvn@gmail.com, info@fintech24h.com';
var SHEET_ID         = '';                        // leave '' to use the bound spreadsheet
var SHEET_NAME       = 'Leads';
var JOB_DRIVE_FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID_HERE'; // Drive folder that receives candidate CVs
// ─────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); }
      catch (_) { data = e.parameter || {}; } // fallback for form-encoded
    }

    var formType = val(data, ['formType']);

    // ── DealMakers' Club — Apply to Join: own sheet, own notifications. ──
    if (formType === 'dealmakers-ss3') {
      appendDealMakersApplyToSheet(data);
      sendDealMakersApplyNotification(data);
      sendDealMakersApplyEmail(data);
      return jsonOutput({ result: 'success' });
    }

    // ── DealMakers' Club — Telegram group join request: own sheet, own
    //    notifications. ──
    if (formType === 'dealmakers-ss3-telegram-join') {
      appendTelegramJoinToSheet(data);
      sendTelegramJoinNotification(data);
      sendTelegramJoinEmail(data);
      return jsonOutput({ result: 'success' });
    }

    // ── Careers — job application: CV to Drive, own sheet, HR alert. ──
    if (String(formType).indexOf('Job Application') === 0) {
      return handleJobApplication_(data, String(formType));
    }

    // ── Everything else: original, unchanged path. ──
    appendToSheet(data);
    sendTelegram(data);
    sendEmail(data);

    return jsonOutput({ result: 'success' });
  } catch (err) {
    return jsonOutput({ result: 'error', message: String(err) });
  }
}

function doGet() {
  return jsonOutput({ result: 'ok', service: 'Fintech24h lead webhook' });
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function val(data, keys) {
  for (var i = 0; i < keys.length; i++) {
    if (data[keys[i]]) return data[keys[i]];
  }
  return '';
}

function escapeHtml(text) {
  if (!text) return '';
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

var NA = 'Chưa cập nhật';

// Interest values that are NOT a paid package — everything else picked in
// "I'm interested in *" (DealMakers Apply form) is a revenue lead, so it
// gets the priority banner in sendDealMakersApplyNotification instead of
// blending into the rest of the message. Includes both English and Arabic
// wording since the site now has an Arabic version too.
var DM_FREE_INTERESTS = [
  'Join DealMakers’ Club',
  'Media Partner',
  'الانضمام إلى DealMakers’ Club',
  'الشريك الإعلامي',
];

// A small shared helper so every new sheet gets the same clean look
// (bold header, frozen row, sensible column widths, Status dropdown)
// without repeating the same block three times. Wrapped in try/catch by
// each caller so a formatting hiccup can never block a real submission
// from saving.
function applySheetPolish_(sheet, headers, statusColumnIndex, statusOptions, columnWidths) {
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold').setBackground('#1a1714').setFontColor('#f5efe2');
  sheet.setFrozenRows(1);
  for (var i = 0; i < columnWidths.length; i++) {
    sheet.setColumnWidth(i + 1, columnWidths[i]);
  }
  if (statusColumnIndex && statusOptions) {
    var statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(statusOptions, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange(2, statusColumnIndex, 500, 1).setDataValidation(statusRule);
  }
}

// =============================================================================
// ORIGINAL PATH — general leads (Service Inquiry, Contact, etc.). Exactly
// as it was before DealMakers' Club existed: same sheet, same columns,
// same message format, no branching.
// =============================================================================

function appendToSheet(data) {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Form Type', 'Name', 'Email', 'Telegram', 'Project Type',
      'Project Name', 'Website', 'Service', 'Budget', 'Timeline', 'LinkedIn', 'Message',
    ]);
  }
  sheet.appendRow([
    new Date(),
    val(data, ['formType']),
    val(data, ['name', 'contactName']),
    val(data, ['email']),
    val(data, ['telegram']),
    val(data, ['projectType']),
    val(data, ['projectName']),
    val(data, ['website', 'projectUrl']),
    val(data, ['serviceInterest']),
    val(data, ['budget']),
    val(data, ['timeline']),
    val(data, ['linkedin']),
    val(data, ['message']),
  ]);
}

function sendTelegram(data) {
  if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN.indexOf('PASTE') === 0) return;

  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var lines = [
    '🚀 YÊU CẦU TƯ VẤN MỚI | FINTECH24H',
    '===============================',
    '📋 Biểu mẫu: ' + (val(data, ['formType']) || NA),
    '👤 Họ tên: ' + (val(data, ['name', 'contactName']) || NA),
    '📧 Email: ' + (val(data, ['email']) || NA),
    '✈️ Telegram: ' + (val(data, ['telegram']) || NA),
    '🏢 Dự án: ' + (val(data, ['projectName']) || NA),
    '🌐 Website: ' + (val(data, ['website', 'projectUrl']) || NA),
    '💼 Dịch vụ: ' + (val(data, ['serviceInterest']) || NA),
    '💰 Ngân sách: ' + (val(data, ['budget']) || NA),
    '🔗 LinkedIn: ' + (val(data, ['linkedin']) || NA),
    '===============================',
    '📝 Lời nhắn / Chi tiết:',
    '> ' + (val(data, ['message']) || 'Không có lời nhắn'),
    '',
    '⏰ Thời gian nhận: ' + now,
  ];

  UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: lines.join('\n'),
      disable_web_page_preview: true,
    }),
    muteHttpExceptions: true,
  });
}

function sendEmail(data) {
  var name = val(data, ['name', 'contactName']) || 'Unknown';
  var subject = '🚀 New Lead: ' + name + ' — ' + (val(data, ['formType']) || 'Inquiry');

  var body =
    'New lead captured from fintech24h.com\n' +
    '----------------------------------------\n' +
    'Form Type:   ' + (val(data, ['formType']) || '—') + '\n' +
    'Name:        ' + name + '\n' +
    'Email:       ' + (val(data, ['email']) || '—') + '\n' +
    'Telegram:    ' + (val(data, ['telegram']) || '—') + '\n' +
    'Project:     ' + (val(data, ['projectName']) || '—') + '\n' +
    'Project Type:' + (val(data, ['projectType']) || '—') + '\n' +
    'Website:     ' + (val(data, ['website', 'projectUrl']) || '—') + '\n' +
    'Service:     ' + (val(data, ['serviceInterest']) || '—') + '\n' +
    'Budget:      ' + (val(data, ['budget']) || '—') + '\n' +
    'Timeline:    ' + (val(data, ['timeline']) || '—') + '\n' +
    'LinkedIn:    ' + (val(data, ['linkedin']) || '—') + '\n' +
    'Message:     ' + (val(data, ['message']) || '—') + '\n' +
    '----------------------------------------\n' +
    'Submitted:   ' + (val(data, ['submittedAt']) || new Date().toISOString());

  var email = val(data, ['email']);
  MailApp.sendEmail({
    to: EMAIL_TO,
    subject: subject,
    body: body,
    replyTo: email || EMAIL_TO,
  });
}

// =============================================================================
// DealMakers' Club — Apply to Join. Own sheet, own Telegram message, own
// email. A staff member should be able to open the sheet and immediately
// see WHEN a request came in, its approval STATUS, and every detail
// needed to confirm the person before approving — no blended paragraphs.
// =============================================================================

var DM_APPLY_SHEET_NAME = 'DealMakers Apply to Join';
var DM_APPLY_HEADERS = [
  'Submitted At', 'Status', 'Full Name', 'Company', 'Role', 'Email',
  'LinkedIn', 'Telegram', 'Package Interest', 'We Offer', 'We Are Looking For', 'Note',
];
var DM_APPLY_STATUS_OPTIONS = ['🟡 Pending Review', '✅ Approved', '❌ Rejected'];

function getOrCreateDealMakersApplySheet_() {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(DM_APPLY_SHEET_NAME);
  if (sheet) return sheet;

  sheet = ss.insertSheet(DM_APPLY_SHEET_NAME);
  sheet.appendRow(DM_APPLY_HEADERS);
  try {
    applySheetPolish_(sheet, DM_APPLY_HEADERS, 2, DM_APPLY_STATUS_OPTIONS,
      [150, 130, 150, 160, 130, 200, 200, 140, 220, 220, 220, 260]);
  } catch (fmtErr) {
    console.warn('Sheet formatting skipped: ' + fmtErr.toString());
  }
  return sheet;
}

function appendDealMakersApplyToSheet(data) {
  var sheet = getOrCreateDealMakersApplySheet_();
  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  sheet.appendRow([
    now,
    DM_APPLY_STATUS_OPTIONS[0], // 🟡 Pending Review — staff flips this after checking
    val(data, ['name']),
    val(data, ['company']),
    val(data, ['role']),
    val(data, ['email']),
    val(data, ['linkedin']),
    val(data, ['telegram']),
    val(data, ['interest']),
    val(data, ['weOffer']),
    val(data, ['weAreLookingFor']),
    val(data, ['note']),
  ]);
}

function sendDealMakersApplyNotification(data) {
  if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN.indexOf('PASTE') === 0) return;

  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var note = val(data, ['note']);

  // The "I'm interested in *" pick is the single most important field for
  // staff to notice — especially when it's a paid package, since missing it
  // means missing revenue. It gets its own banner at the very top instead
  // of sitting as one line among many further down.
  var interestValue = val(data, ['interest']);
  var isPaidInterest = interestValue && DM_FREE_INTERESTS.indexOf(interestValue) === -1;
  var interestBanner = interestValue
    ? (isPaidInterest
        ? '🔴🔴🔴 <b>PAID PACKAGE — PRIORITIZE THIS LEAD</b> 🔴🔴🔴\n💰 <b>' + escapeHtml(interestValue) + '</b>\n\n'
        : '📦 <b>Interest:</b> ' + escapeHtml(interestValue) + '\n\n')
    : '';

  var html =
    '⭐ <b>NEW DEALMAKERS\' CLUB APPLICATION</b>\n' +
    '<i>F-Matching Season 3 — awaiting review</i>\n' +
    '\n' +
    interestBanner +
    '👤 <b>Name:</b> ' + escapeHtml(val(data, ['name']) || NA) + '\n' +
    '🏢 <b>Company:</b> ' + escapeHtml(val(data, ['company']) || NA) + '\n' +
    '🎓 <b>Role:</b> ' + escapeHtml(val(data, ['role']) || NA) + '\n' +
    '📧 <b>Email:</b> ' + escapeHtml(val(data, ['email']) || NA) + '\n' +
    '🔗 <b>LinkedIn:</b> ' + escapeHtml(val(data, ['linkedin']) || NA) + '\n' +
    '✈️ <b>Telegram:</b> ' + escapeHtml(val(data, ['telegram']) || NA) + '\n' +
    '\n' +
    '🤝 <b>We Offer:</b> ' + escapeHtml(val(data, ['weOffer']) || '<i>Not specified</i>') + '\n' +
    '🎯 <b>We Are Looking For:</b> ' + escapeHtml(val(data, ['weAreLookingFor']) || '<i>Not specified</i>') + '\n' +
    '\n' +
    '📝 <b>Note</b>\n' +
    (note ? escapeHtml(note) : '<i>No note provided.</i>') + '\n' +
    '\n' +
    '🕒 <b>Submitted:</b> ' + now + '\n' +
    '👉 Verify the details above, then mark Approved/Rejected in the ' +
    '<b>' + escapeHtml(DM_APPLY_SHEET_NAME) + '</b> sheet.';

  UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: html,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
    muteHttpExceptions: true,
  });
}

function sendDealMakersApplyEmail(data) {
  var name = val(data, ['name']) || 'Unknown';
  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var subject = '⭐ New DealMakers\' Club Application: ' + name;

  var body =
    'New DealMakers\' Club application — F-Matching Season 3\n' +
    '========================================\n' +
    'STATUS:            Pending Review\n' +
    '----------------------------------------\n' +
    'Full Name:         ' + name + '\n' +
    'Company:           ' + (val(data, ['company']) || '—') + '\n' +
    'Role:              ' + (val(data, ['role']) || '—') + '\n' +
    'Email:             ' + (val(data, ['email']) || '—') + '\n' +
    'LinkedIn:          ' + (val(data, ['linkedin']) || '—') + '\n' +
    'Telegram:          ' + (val(data, ['telegram']) || '—') + '\n' +
    'Package Interest:  ' + (val(data, ['interest']) || '—') + '\n' +
    'We Offer:          ' + (val(data, ['weOffer']) || '—') + '\n' +
    'We Are Looking For:' + (val(data, ['weAreLookingFor']) || '—') + '\n' +
    'Note:              ' + (val(data, ['note']) || '—') + '\n' +
    '----------------------------------------\n' +
    'Submitted:         ' + now + '\n' +
    'Tracked in:        "' + DM_APPLY_SHEET_NAME + '" sheet (separate from general leads)\n' +
    '========================================\n' +
    'Verify the details above, then update the Status column in the sheet\n' +
    'to Approved or Rejected.';

  var email = val(data, ['email']);
  MailApp.sendEmail({
    to: EMAIL_TO,
    subject: subject,
    body: body,
    replyTo: email || EMAIL_TO,
  });
}

// =============================================================================
// DealMakers' Club — Telegram group join requests. Own sheet, own Telegram
// message, own email.
// =============================================================================

var TG_JOIN_SHEET_NAME = 'DealMakers Telegram Join';
var TG_JOIN_HEADERS = [
  'Submitted At', 'Status', 'Full Name', 'Company', 'Email',
  'LinkedIn', 'Telegram', 'Funding Status', 'Note',
];
var TG_JOIN_STATUS_OPTIONS = ['🟡 Pending Review', '✅ Approved', '❌ Rejected'];

function getOrCreateTelegramJoinSheet_() {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(TG_JOIN_SHEET_NAME);
  if (sheet) return sheet;

  sheet = ss.insertSheet(TG_JOIN_SHEET_NAME);
  sheet.appendRow(TG_JOIN_HEADERS);
  try {
    applySheetPolish_(sheet, TG_JOIN_HEADERS, 2, TG_JOIN_STATUS_OPTIONS,
      [150, 130, 150, 160, 200, 200, 150, 180, 280]);
  } catch (fmtErr) {
    console.warn('Sheet formatting skipped: ' + fmtErr.toString());
  }
  return sheet;
}

function appendTelegramJoinToSheet(data) {
  var sheet = getOrCreateTelegramJoinSheet_();
  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  sheet.appendRow([
    now,
    TG_JOIN_STATUS_OPTIONS[0], // 🟡 Pending Review — staff flips this after checking
    val(data, ['name']),
    val(data, ['company']),
    val(data, ['email']),
    val(data, ['linkedin']),
    val(data, ['telegram']),
    val(data, ['fundingStatus']),
    val(data, ['note']),
  ]);
}

function sendTelegramJoinNotification(data) {
  if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN.indexOf('PASTE') === 0) return;

  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var note = val(data, ['note']);

  var html =
    '🔐 <b>NEW TELEGRAM CLUB REQUEST</b>\n' +
    '<i>Fi24h DealMakers\' Club — awaiting review</i>\n' +
    '\n' +
    '👤 <b>Name:</b> ' + escapeHtml(val(data, ['name']) || NA) + '\n' +
    '🏢 <b>Company:</b> ' + escapeHtml(val(data, ['company']) || NA) + '\n' +
    '📧 <b>Email:</b> ' + escapeHtml(val(data, ['email']) || NA) + '\n' +
    '🔗 <b>LinkedIn:</b> ' + escapeHtml(val(data, ['linkedin']) || NA) + '\n' +
    '✈️ <b>Telegram:</b> ' + escapeHtml(val(data, ['telegram']) || NA) + '\n' +
    '💰 <b>Funding status:</b> ' + escapeHtml(val(data, ['fundingStatus']) || NA) + '\n' +
    '\n' +
    '📝 <b>Note</b>\n' +
    (note ? escapeHtml(note) : '<i>No note provided.</i>') + '\n' +
    '\n' +
    '🕒 <b>Submitted:</b> ' + now + '\n' +
    '👉 Verify the details above, then mark Approved/Rejected in the ' +
    '<b>' + escapeHtml(TG_JOIN_SHEET_NAME) + '</b> sheet.';

  UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: html,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
    muteHttpExceptions: true,
  });
}

function sendTelegramJoinEmail(data) {
  var name = val(data, ['name']) || 'Unknown';
  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var subject = '🔐 New DealMakers\' Club Telegram Join Request: ' + name;

  var body =
    'New Telegram group join request — Fi24h DealMakers\' Club\n' +
    '========================================\n' +
    'STATUS:          Pending Review\n' +
    '----------------------------------------\n' +
    'Full Name:       ' + name + '\n' +
    'Company:         ' + (val(data, ['company']) || '—') + '\n' +
    'Email:           ' + (val(data, ['email']) || '—') + '\n' +
    'LinkedIn:        ' + (val(data, ['linkedin']) || '—') + '\n' +
    'Telegram:        ' + (val(data, ['telegram']) || '—') + '\n' +
    'Funding status:  ' + (val(data, ['fundingStatus']) || '—') + '\n' +
    'Note:            ' + (val(data, ['note']) || '—') + '\n' +
    '----------------------------------------\n' +
    'Submitted:       ' + now + '\n' +
    'Tracked in:      "' + TG_JOIN_SHEET_NAME + '" sheet (separate from general leads)\n' +
    '========================================\n' +
    'Verify the Telegram handle above belongs to this person before approving,\n' +
    'then update the Status column in the sheet to Approved or Rejected.';

  var email = val(data, ['email']);
  MailApp.sendEmail({
    to: EMAIL_TO,
    subject: subject,
    body: body,
    replyTo: email || EMAIL_TO,
  });
}

// =============================================================================
// Careers — job applications (formType "Job Application: <position>").
// Own sheet, CV saved to Google Drive, HR Telegram alert, and an email that
// carries the CV as an attachment. The sheet row is written first, so a Drive,
// Telegram or mail hiccup can never lose an application.
//
// The website sends: name, email, telegram, linkedin, portfolio, message (cover
// letter), keepOnFile ("true"/"false"), companyWebsite (bot honeypot) and
// attachment { name, content } where content is a data URL
// ("data:<mime>;base64,<payload>") of the résumé.
// =============================================================================

var JOB_SHEET_NAME = 'Job Applications';
var JOB_HEADERS = [
  'Submitted At', 'Status', 'Position', 'Full Name', 'Email', 'Telegram',
  'LinkedIn', 'Portfolio', 'Cover Letter', 'CV Link', 'Keep On File',
];
var JOB_STATUS_OPTIONS = ['🟡 New', '✅ Shortlisted', '❌ Rejected'];

var JOB_CV_MAX_BYTES = 5 * 1024 * 1024;
var JOB_CV_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

// A cell starting with = + - @ (or tab / CR) can be run as a formula by Sheets / Excel.
// A plain Telegram handle such as @johndoe is safe and stays untouched; anything else that
// starts with "@" (e.g. @SUM(1)) is neutralised like the other trigger characters.
function safeCell_(value) {
  var s = String(value === null || value === undefined ? '' : value);
  if (/^@[A-Za-z0-9_]{1,64}$/.test(s)) return s;
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function handleJobApplication_(data, formType) {
  // Bot trap: real visitors never fill this visually-hidden field.
  if (String(data.companyWebsite || '').trim()) {
    return jsonOutput({ result: 'error', message: 'Rejected submission' });
  }
  var email = String(val(data, ['email'])).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonOutput({ result: 'error', message: 'Invalid email' });
  }

  var position = formType.replace(/^Job Application:\s*/i, '').trim() || 'General Application';
  var cv = saveJobCv_(data);

  appendJobApplicationToSheet_(data, position, cv);      // source of truth — written first

  try { sendJobApplicationNotification_(data, position, cv); }
  catch (teleErr) { console.warn('Job Telegram skipped: ' + teleErr.toString()); }
  try { sendJobApplicationEmail_(data, position, cv); }
  catch (mailErr) { console.warn('Job email skipped: ' + mailErr.toString()); }

  return jsonOutput({ result: 'success' });
}

// Validates the résumé and stores it in Drive. Never throws: on any problem the
// application is still recorded and the reason is written next to the CV link.
// If only Drive fails, the validated file is still attached to the HR email.
function saveJobCv_(data) {
  var att = data.attachment;
  if (!att || typeof att !== 'object' || !att.content) {
    return { url: '', blob: null, note: 'Không có tệp đính kèm' };
  }
  var blob = null;
  try {
    var name = String(att.name || 'resume').replace(/[^A-Za-z0-9._ -]/g, '_').slice(0, 100);
    var ext = (name.split('.').pop() || '').toLowerCase();
    if (!JOB_CV_TYPES[ext]) throw new Error('chỉ nhận CV PDF / DOC / DOCX (' + name + ')');

    var content = String(att.content);
    var comma = content.indexOf(',');
    if (content.indexOf('data:') === 0 && comma >= 0) content = content.substring(comma + 1); // data URL → base64
    var bytes = Utilities.base64Decode(content);
    if (bytes.length > JOB_CV_MAX_BYTES) throw new Error('CV vượt quá 5MB');

    blob = Utilities.newBlob(bytes, JOB_CV_TYPES[ext], name);
    var file = DriveApp.getFolderById(JOB_DRIVE_FOLDER_ID).createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return { url: file.getUrl(), blob: blob, note: name };
  } catch (err) {
    console.error('CV not stored: ' + err.toString());
    return { url: '', blob: blob, note: 'LỖI LƯU CV: ' + err.toString() };
  }
}

function getOrCreateJobSheet_() {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(JOB_SHEET_NAME);
  if (sheet) return sheet;

  sheet = ss.insertSheet(JOB_SHEET_NAME);
  sheet.appendRow(JOB_HEADERS);
  try {
    applySheetPolish_(sheet, JOB_HEADERS, 2, JOB_STATUS_OPTIONS,
      [150, 130, 200, 170, 210, 140, 220, 220, 320, 260, 100]);
  } catch (fmtErr) {
    console.warn('Sheet formatting skipped: ' + fmtErr.toString());
  }
  return sheet;
}

function appendJobApplicationToSheet_(data, position, cv) {
  var sheet = getOrCreateJobSheet_();
  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  sheet.appendRow([
    now,
    JOB_STATUS_OPTIONS[0], // 🟡 New — HR flips this after reviewing
    safeCell_(position),
    safeCell_(val(data, ['name'])),
    safeCell_(val(data, ['email'])),
    safeCell_(val(data, ['telegram'])),
    safeCell_(val(data, ['linkedin'])),
    safeCell_(val(data, ['portfolio'])),
    safeCell_(val(data, ['message'])),
    safeCell_(cv.url || cv.note),
    String(data.keepOnFile) === 'true' ? 'Yes' : 'No',
  ]);
}

function sendJobApplicationNotification_(data, position, cv) {
  if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN.indexOf('PASTE') === 0) return;

  var html =
    '🚀 <b>ỨNG VIÊN MỚI NỘP HỒ SƠ THÀNH CÔNG!</b>\n\n' +
    '💼 <b>Vị trí:</b> ' + escapeHtml(position) + '\n' +
    '👤 <b>Họ và tên:</b> ' + escapeHtml(val(data, ['name']) || NA) + '\n' +
    '📧 <b>Email:</b> ' + escapeHtml(val(data, ['email']) || NA) + '\n' +
    '💬 <b>Telegram:</b> ' + escapeHtml(val(data, ['telegram']) || NA) + '\n' +
    '🔗 <b>LinkedIn:</b> ' + escapeHtml(val(data, ['linkedin']) || NA) + '\n' +
    '🌐 <b>Portfolio:</b> ' + escapeHtml(val(data, ['portfolio']) || NA) + '\n\n' +
    '📁 <b>Đường link xem & tải CV:</b>\n' + escapeHtml(cv.url || cv.note) + '\n\n' +
    '👉 Chi tiết ở tab <b>' + escapeHtml(JOB_SHEET_NAME) + '</b>.';

  UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: html,
      parse_mode: 'HTML',
    }),
    muteHttpExceptions: true,
  });
}

function sendJobApplicationEmail_(data, position, cv) {
  var name = val(data, ['name']) || 'Unknown';
  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var subject = '💼 New Job Application: ' + name + ' — ' + position;

  var body =
    'New job application from fintech24h.com\n' +
    '========================================\n' +
    'Position:    ' + position + '\n' +
    'Full Name:   ' + name + '\n' +
    'Email:       ' + (val(data, ['email']) || '—') + '\n' +
    'Telegram:    ' + (val(data, ['telegram']) || '—') + '\n' +
    'LinkedIn:    ' + (val(data, ['linkedin']) || '—') + '\n' +
    'Portfolio:   ' + (val(data, ['portfolio']) || '—') + '\n' +
    'Keep on file:' + (String(data.keepOnFile) === 'true' ? ' Yes' : ' No') + '\n' +
    'CV:          ' + (cv.url || cv.note) + (cv.blob ? '  (also attached)' : '') + '\n' +
    '----------------------------------------\n' +
    'Cover letter:\n' + (val(data, ['message']) || '—') + '\n' +
    '----------------------------------------\n' +
    'Submitted:   ' + now + '\n' +
    'Tracked in:  "' + JOB_SHEET_NAME + '" sheet (separate from general leads)';

  var email = val(data, ['email']);
  var options = {
    to: EMAIL_TO,
    subject: subject,
    body: body,
    replyTo: email || EMAIL_TO,
  };
  if (cv.blob) options.attachments = [cv.blob];
  MailApp.sendEmail(options);
}
