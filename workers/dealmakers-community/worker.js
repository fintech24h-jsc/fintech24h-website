/**
 * DealMakers community activity worker
 *
 * Receives Telegram webhook updates, stores only member profile metadata plus
 * activity timestamps in D1, and exposes a read-only public pulse endpoint.
 * It deliberately never reads, logs, or stores message text or media.
 */

const MAX_PUBLIC_MEMBERS = 8;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': 'https://fintech24h.com',
      'Vary': 'Origin',
    },
  });
}

function corsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://fintech24h.com',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Telegram-Bot-Api-Secret-Token',
      'Vary': 'Origin',
    },
  });
}

function cleanDisplayName(user) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return (name || user.username || 'DealMakers member').slice(0, 100);
}

function isoFromTelegramDate(date) {
  return new Date((Number(date) || Math.floor(Date.now() / 1000)) * 1000).toISOString();
}

async function handleTelegramUpdate(request, env) {
  if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.TELEGRAM_WEBHOOK_SECRET) {
    return json({ ok: false }, 401);
  }

  const update = await request.json();
  const message = update.message;
  const sender = message?.from;

  // Ignore service events, messages outside the owned DealMakers group, and bots.
  if (!message || !sender || sender.is_bot || String(message.chat?.id) !== String(env.TELEGRAM_CHAT_ID)) {
    return json({ ok: true });
  }

  const activeAt = isoFromTelegramDate(message.date);
  const activityDay = activeAt.slice(0, 10);
  const memberId = String(sender.id);
  const displayName = cleanDisplayName(sender);
  const username = sender.username ? String(sender.username).replace(/^@/, '').slice(0, 64) : null;

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO telegram_members (telegram_user_id, display_name, username, first_seen_at, last_active_at, total_messages)
      VALUES (?, ?, ?, ?, ?, 1)
      ON CONFLICT(telegram_user_id) DO UPDATE SET
        display_name = excluded.display_name,
        username = excluded.username,
        last_active_at = excluded.last_active_at,
        total_messages = telegram_members.total_messages + 1
    `).bind(memberId, displayName, username, activeAt, activeAt),
    env.DB.prepare(`
      INSERT INTO telegram_member_activity_daily (activity_day, telegram_user_id, message_count)
      VALUES (?, ?, 1)
      ON CONFLICT(activity_day, telegram_user_id) DO UPDATE SET
        message_count = telegram_member_activity_daily.message_count + 1
    `).bind(activityDay, memberId),
  ]);

  return json({ ok: true });
}

async function getPulse(env) {
  const now = Date.now();
  const todaySince = new Date(now - ONE_DAY_MS).toISOString();
  const weekSince = new Date(now - SEVEN_DAYS_MS).toISOString();

  const [today, week, members] = await env.DB.batch([
    env.DB.prepare('SELECT COUNT(*) AS count FROM telegram_members WHERE last_active_at >= ?').bind(todaySince),
    env.DB.prepare('SELECT COUNT(*) AS count FROM telegram_members WHERE last_active_at >= ?').bind(weekSince),
    env.DB.prepare(`
      SELECT display_name AS displayName, username, last_active_at AS lastActiveAt
      FROM telegram_members
      WHERE last_active_at >= ?
      ORDER BY last_active_at DESC
      LIMIT ?
    `).bind(weekSince, MAX_PUBLIC_MEMBERS),
  ]);

  return json({
    activeMembersLast24Hours: Number(today.results?.[0]?.count ?? 0),
    activeMembersLast7Days: Number(week.results?.[0]?.count ?? 0),
    updatedAt: new Date().toISOString(),
    members: members.results ?? [],
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return corsResponse();
    if (request.method === 'POST' && url.pathname === '/telegram/webhook') return handleTelegramUpdate(request, env);
    if (request.method === 'GET' && url.pathname === '/v1/pulse') return getPulse(env);

    return json({ error: 'Not found' }, 404);
  },
};
