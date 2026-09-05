-- Stores only Telegram profile metadata and activity timestamps.
-- Message text, media, links, and message IDs are deliberately never persisted.

CREATE TABLE IF NOT EXISTS telegram_members (
  telegram_user_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  username TEXT,
  first_seen_at TEXT NOT NULL,
  last_active_at TEXT NOT NULL,
  total_messages INTEGER NOT NULL DEFAULT 0
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
