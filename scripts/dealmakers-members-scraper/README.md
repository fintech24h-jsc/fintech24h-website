# DealMakers Members Directory — how to add/update members

The `/dealmakers/members/` page is built from a static snapshot, not a live
database. There are two ways to add members to it.

## Option A — the source site gets a new card (preferred)

If whoever manages https://fi24h-dealmakersclub.super.site/ adds a new
member row there (with their branded invite-card photo, role, company,
website, LinkedIn), just re-run the scraper — it rebuilds everything from
scratch and will pick up the new person automatically:

```bash
node scripts/dealmakers-members-scraper/run.mjs
```

This overwrites `src/data/dealmakers/members.ts` and downloads any new
photos into `public/dealmakers/members/`. Review the diff (`git diff`),
then commit and push as usual to deploy.

Note: this is a full rebuild, not incremental — if you've hand-edited
`members.ts` directly (Option B) without also updating the source site,
re-running the scraper will discard those hand edits.

## Option B — add someone by hand (no source-site update)

If a member should appear here but isn't on that source site, add them
directly:

1. Get their invite-card image (or any square-ish photo) and save it to
   `public/dealmakers/members/<slug>.jpg`.
2. Open `src/data/dealmakers/members.ts` and add an entry to the
   `dealMakersMembers` array:

   ```ts
   {
     slug: 'jane-doe',
     name: 'Jane Doe',
     company: 'Acme Capital',
     role: 'Managing Partner',
     website: 'https://acme.capital',
     linkedin: 'https://www.linkedin.com/in/janedoe/',
     telegramLink: 'https://t.me/Fi24h_DealMakers_Club/1/123', // their welcome message, or null
     photo: '/dealmakers/members/jane-doe.jpg',
   },
   ```

3. Keep the array sorted by `name` (not required, just tidy).
4. Commit and push.

`telegramLink` can be `null` if there's no welcome-message link yet — the
card just won't show a Telegram button.
