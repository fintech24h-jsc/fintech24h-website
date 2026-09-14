# DealMakers Telegram Community Activity

This Worker powers the public “Active in DealMakers’ Club” section. It retains
only sender profile metadata and the timestamp of activity. It never persists
or exposes message text, media, links, message IDs, or chat history.

## One-time setup

1. Create a dedicated Telegram bot with BotFather.
2. Add it to `Fi24h DealMakers’ Club` as an admin so it can receive group
   activity. Telegram privacy mode otherwise limits updates to messages that
   directly concern the bot.
3. Create and initialize the D1 database:

   ```sh
   cd workers/dealmakers-community
   npx wrangler d1 create fintech24h-dealmakers-community
   # Copy the returned database_id into wrangler.toml.
   npx wrangler d1 execute fintech24h-dealmakers-community --remote --file=./schema.sql
   ```

4. Set Worker secrets and deploy:

   ```sh
   npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
   npx wrangler secret put TELEGRAM_CHAT_ID
   npx wrangler deploy
   ```

5. Configure Telegram’s webhook. Replace the URL with the deployed Worker
   address and use the exact same secret set in step 4:

   ```sh
   curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
     --data-urlencode "url=https://YOUR-WORKER.workers.dev/telegram/webhook" \
     --data-urlencode "secret_token=$TELEGRAM_WEBHOOK_SECRET" \
     --data-urlencode 'allowed_updates=["message"]'
   ```

5b. (Optional, recommended) Seed the section with real admin/team profiles so
    it isn't empty before the first tracked message. This calls Telegram's
    `getChatAdministrators` — real people, no fabricated activity — and marks
    them `source = 'admin_seed'` so they're never counted as "active" and the
    frontend shows a "Team" badge instead of a fake activity time for them:

   ```sh
   # The bot needs its own token as an outbound secret to call Telegram's API:
   npx wrangler secret put TELEGRAM_BOT_TOKEN

   # A separate secret just to authorize this one-off admin action:
   ADMIN_SEED_SECRET=$(openssl rand -hex 32)
   echo "$ADMIN_SEED_SECRET" | npx wrangler secret put ADMIN_SEED_SECRET

   curl -sS -X POST "https://YOUR-WORKER.workers.dev/telegram/seed-admins" \
     -H "X-Admin-Secret: $ADMIN_SEED_SECRET"
   # => {"ok":true,"seeded":N}
   ```

   Re-run this any time the admin list changes — it's idempotent (upserts by
   Telegram user ID) and never downgrades a member who has since sent a real
   tracked message back to "admin_seed".

6. In the main website deployment environment, set:

   ```sh
   PUBLIC_DEALMAKERS_PULSE_API_URL=https://YOUR-WORKER.workers.dev/v1/pulse
   ```

The React island refreshes this endpoint every 60 seconds. Until this variable
and the Worker are configured, the page honestly shows a setup state rather
than fabricated activity.

## Data policy

- Public fields: Telegram display name, username when available, and last
  activity time (message-sourced members only — see below).
- Aggregates: unique members active in the prior 24 hours and 7 days, counted
  from real messages only.
- Never stored: message content, media, URLs, message identifiers, or files.
- Collection of real activity starts when the bot is added; the Bot API
  cannot backfill message history into this dataset.
- The one exception: `getChatAdministrators` (step 5b) is a live snapshot of
  the group's actual current admins/team, fetched on demand — not history.
  These rows are tagged `source = 'admin_seed'`, are never counted in the
  activity aggregates, and render with a "Team" badge instead of a claimed
  activity time, so the section can show real people on day one without
  implying an activity signal that doesn't exist.
