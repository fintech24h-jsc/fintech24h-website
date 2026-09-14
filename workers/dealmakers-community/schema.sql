-- Stores only Telegram profile metadata and activity timestamps.
-- Message text, media, links, and message IDs are deliberately never persisted.

CREATE TABLE IF NOT EXISTS telegram_members (
  telegram_user_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  username TEXT,
  first_seen_at TEXT NOT NULL,
  last_active_at TEXT NOT NULL,
  total_messages INTEGER NOT NULL DEFAULT 0,
  -- 'message': last_active_at is a real message timestamp from the webhook.
  -- 'admin_seed': backfilled once from Telegram's admin list so the section
  -- isn't empty on day one; last_active_at here is only the seed time, never
  -- a real activity signal, so the frontend must not render it as "Active
  -- ... ago" for this source.
  source TEXT NOT NULL DEFAULT 'message',
  -- Telegram file_id for the member's current profile photo (small size),
  -- resolved lazily via getUserProfilePhotos. NULL until first resolved, or
  -- if the member has no profile photo — the frontend falls back to
  -- initials in either case. Never the raw Telegram file URL (that embeds
  -- the bot token) — always fetched through this Worker's own /v1/avatar
  -- proxy so the token never reaches the browser.
  avatar_file_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_telegram_members_last_active
  ON telegram_members(last_active_at DESC);

CREATE TABLE IF NOT EXISTS telegram_member_activity_daily (
  activity_day TEXT NOT NULL,
  telegram_user_id TEXT NOT NULL,
  message_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (activity_day, telegram_user_id),
  FOREIGN KEY (telegram_user_id) REFERENCES telegram_members(telegram_user_id)
);

CREATE INDEX IF NOT EXISTS idx_telegram_activity_daily_day
  ON telegram_member_activity_daily(activity_day DESC);
