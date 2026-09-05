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

6. In the main website deployment environment, set:

   ```sh
   PUBLIC_DEALMAKERS_PULSE_API_URL=https://YOUR-WORKER.workers.dev/v1/pulse
   ```

The React island refreshes this endpoint every 60 seconds. Until this variable
and the Worker are configured, the page honestly shows a setup state rather
than fabricated activity.

## Data policy

- Public fields: Telegram display name, username when available, and last
  activity time.
- Aggregates: unique members active in the prior 24 hours and 7 days.
- Never stored: message content, media, URLs, message identifiers, or files.
- Collection starts when the bot is added; the Bot API cannot backfill group
  history into this dataset.
