/**
 * Fintech24h — Lead Capture Backend (Google Apps Script)
 * ======================================================
 * Receives form submissions from fintech24h.com and fans them out to:
 *   1. Google Sheet  (one row per lead)
 *   2. Telegram      (instant notification to your team chat)
 *   3. Email         (to fintech24hvn@gmail.com)
 *
 * SETUP — do this once:
 *   1. Open the Google Sheet you want leads stored in → Extensions → Apps Script.
 *   2. Delete any existing code, paste THIS entire file.
 *   3. In Project Settings → Script properties, set: TELEGRAM_TOKEN,
 *      TELEGRAM_CHAT_ID, EMAIL_TO and (optionally) SHEET_ID / SHEET_NAME.
 *   4. Click Deploy → New deployment → type "Web app".
 *        - Execute as:      Me
 *        - Who has access:  Anyone
 *   5. Copy the /exec URL → paste into the website .env as
 *        PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=...
 *   6. Whenever you change this code, Deploy → Manage deployments → Edit → New version.
 *
 * GET TELEGRAM CREDENTIALS:
 *   - Bot token: message @BotFather → /newbot → copy the token.
 *   - Chat ID:   add the bot to your group, send any message, then open
 *       https://api.telegram.org/bot<TOKEN>/getUpdates and read "chat":{"id":...}.
 *     For a personal chat, message @userinfobot to get your numeric ID.
 */

// ── CONFIG ───────────────────────────────────────────────────────────────
// Secrets must only live in Script Properties. Do not commit credentials here.
var SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
var SHEET_NAME = SCRIPT_PROPERTIES.getProperty('SHEET_NAME') || 'Leads';
// ─────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); }
      catch (_) { data = e.parameter || {}; } // fallback for form-encoded
    }

    validateLead(data);
    appendToSheet(data);
    sendTelegram(data);
    sendEmail(data);

    return jsonOutput({ result: 'success' });
  } catch (err) {
    console.error('Lead submission failed', err);
    // Do not disclose implementation details to unauthenticated callers.
    return jsonOutput({ result: 'error', message: 'Unable to process the submission.' });
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
    if (data[keys[i]]) return String(data[keys[i]]).trim().slice(0, 2000);
  }
  return '';
}

function getRequiredProperty(name) {
  var value = SCRIPT_PROPERTIES.getProperty(name);
  if (!value) throw new Error('Missing required Script Property: ' + name);
  return value;
}

function safeCell(value) {
  // Google Sheets treats =, +, - and @ as formulas. Store external input as text.
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function validateLead(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Invalid payload');
  }
  // Honeypot: real visitors never populate this visually-hidden field.
  if (String(data.companyWebsite || '').trim()) throw new Error('Rejected submission');

  var email = val(data, ['email']);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email');
  }

  Object.keys(data).forEach(function(key) {
    if (typeof data[key] === 'string' && data[key].length > 2000) {
      throw new Error('Field exceeds maximum length');
    }
  });
}

function appendToSheet(data) {
  var sheetId = SCRIPT_PROPERTIES.getProperty('SHEET_ID');
  var ss = sheetId ? SpreadsheetApp.openById(sheetId) : SpreadsheetApp.getActiveSpreadsheet();
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
    safeCell(val(data, ['formType'])),
    safeCell(val(data, ['name', 'contactName'])),
    safeCell(val(data, ['email'])),
    safeCell(val(data, ['telegram'])),
    safeCell(val(data, ['projectType'])),
    safeCell(val(data, ['projectName'])),
    safeCell(val(data, ['website', 'projectUrl'])),
    safeCell(val(data, ['serviceInterest'])),
    safeCell(val(data, ['budget'])),
    safeCell(val(data, ['timeline'])),
    safeCell(val(data, ['linkedin'])),
    safeCell(val(data, ['message'])),
  ]);
}

var NA = 'Chưa cập nhật';

function sendTelegram(data) {
  var telegramToken = getRequiredProperty('TELEGRAM_TOKEN');
  var telegramChatId = getRequiredProperty('TELEGRAM_CHAT_ID');

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

  UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: telegramChatId,
      text: lines.join('\n'),
      disable_web_page_preview: true,
    }),
    muteHttpExceptions: true,
  });
}

function sendEmail(data) {
  var emailTo = getRequiredProperty('EMAIL_TO');
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
    to: emailTo,
    subject: subject,
    body: body,
    replyTo: email || emailTo,
  });
}
