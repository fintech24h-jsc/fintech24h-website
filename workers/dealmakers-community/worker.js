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
      INSERT INTO telegram_members (telegram_user_id, display_name, username, first_seen_at, last_active_at, total_messages, source)
      VALUES (?, ?, ?, ?, ?, 1, 'message')
      ON CONFLICT(telegram_user_id) DO UPDATE SET
        display_name = excluded.display_name,
        username = excluded.username,
        last_active_at = excluded.last_active_at,
        total_messages = telegram_members.total_messages + 1,
        source = 'message'
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

  // Counts only ever reflect real message activity — admin_seed rows have no
  // genuine activity timestamp, so they'd inflate these numbers dishonestly
  // if included.
  const [today, week, activeMembers, teamMembers] = await env.DB.batch([
    env.DB.prepare("SELECT COUNT(*) AS count FROM telegram_members WHERE source = 'message' AND last_active_at >= ?").bind(todaySince),
    env.DB.prepare("SELECT COUNT(*) AS count FROM telegram_members WHERE source = 'message' AND last_active_at >= ?").bind(weekSince),
    env.DB.prepare(`
      SELECT display_name AS displayName, username, last_active_at AS lastActiveAt, source
      FROM telegram_members
      WHERE source = 'message' AND last_active_at >= ?
      ORDER BY last_active_at DESC
      LIMIT ?
    `).bind(weekSince, MAX_PUBLIC_MEMBERS),
    // Fills remaining slots with real admin profiles so the section isn't
    // empty before the first tracked message — never counted as "active".
    env.DB.prepare(`
      SELECT display_name AS displayName, username, last_active_at AS lastActiveAt, source
      FROM telegram_members
      WHERE source = 'admin_seed'
      ORDER BY first_seen_at ASC
      LIMIT ?
    `).bind(MAX_PUBLIC_MEMBERS),
  ]);

  const members = [...(activeMembers.results ?? [])];
  for (const row of teamMembers.results ?? []) {
    if (members.length >= MAX_PUBLIC_MEMBERS) break;
    members.push(row);
  }

  return json({
    activeMembersLast24Hours: Number(today.results?.[0]?.count ?? 0),
    activeMembersLast7Days: Number(week.results?.[0]?.count ?? 0),
    updatedAt: new Date().toISOString(),
    members,
  });
}

async function seedAdmins(request, env) {
  if (request.headers.get('X-Admin-Secret') !== env.ADMIN_SEED_SECRET) {
    return json({ ok: false }, 401);
  }
  if (!env.TELEGRAM_BOT_TOKEN) {
    return json({ ok: false, error: 'TELEGRAM_BOT_TOKEN secret is not set' }, 500);
  }

  const apiUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getChatAdministrators?chat_id=${encodeURIComponent(env.TELEGRAM_CHAT_ID)}`;
  const response = await fetch(apiUrl);
  const payload = await response.json();
  if (!payload.ok) return json({ ok: false, error: payload.description || 'Telegram API error' }, 502);

  const now = new Date().toISOString();
  const writes = [];
  let seeded = 0;

  for (const entry of payload.result ?? []) {
    const user = entry.user;
    if (!user || user.is_bot) continue;
    const memberId = String(user.id);
    const displayName = cleanDisplayName(user);
    const username = user.username ? String(user.username).replace(/^@/, '').slice(0, 64) : null;

    writes.push(
      env.DB.prepare(`
        INSERT INTO telegram_members (telegram_user_id, display_name, username, first_seen_at, last_active_at, total_messages, source)
        VALUES (?, ?, ?, ?, ?, 0, 'admin_seed')
        ON CONFLICT(telegram_user_id) DO UPDATE SET
          display_name = excluded.display_name,
          username = excluded.username
      `).bind(memberId, displayName, username, now, now)
    );
    seeded += 1;
  }

  if (writes.length) await env.DB.batch(writes);
  return json({ ok: true, seeded });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return corsResponse();
    if (request.method === 'POST' && url.pathname === '/telegram/webhook') return handleTelegramUpdate(request, env);
    if (request.method === 'POST' && url.pathname === '/telegram/seed-admins') return seedAdmins(request, env);
    if (request.method === 'GET' && url.pathname === '/v1/pulse') return getPulse(env);

    return json({ error: 'Not found' }, 404);
  },
};
