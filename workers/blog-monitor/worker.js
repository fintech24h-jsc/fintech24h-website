/**
 * fintech24h-blog-monitor
 * ========================
 * Cron-triggered health check for https://fintech24h.com/blog.
 *
 * WHY THIS EXISTS: on 2026-07-05 the blog silently regressed twice —
 * once serving the dev-only MOCK_POSTS fallback in production, once
 * rendering an empty/broken blog section — and nobody noticed until a
 * human happened to check manually. See DEPLOYMENT.md and
 * workers/wp-proxy/INCIDENT-README.md at the repo root for the full
 * incident writeup. This Worker exists purely to make that regression
 * page someone automatically instead of waiting on a manual check.
 *
 * CHECKS (both must pass):
 *   1. The page must NOT contain any known MOCK_POSTS title from
 *      src/lib/wordpress.ts — their presence in prod means the
 *      `import.meta.env.DEV` dev-only fallback leaked into production.
 *   2. The page MUST contain a minimum number of real article title
 *      elements (`<h2 class="font-display ...`), proving WordPress
 *      posts are actually rendering, not that the section silently
 *      collapsed to zero posts.
 *
 * On failure, sends a Telegram alert reusing the SAME bot already used
 * for lead notifications (see workers/apps-script/Code.gs) — no new
 * notification channel was created. Token/chat ID are Worker secrets,
 * NOT hardcoded here (they're already in plaintext in Code.gs since
 * Apps Script has no secret store, but a public Worker script is a
 * different exposure — keep them as secrets in this repo).
 *
 * Rule for future AI/Claude Code: if you change the MOCK_POSTS titles
 * in src/lib/wordpress.ts, update MOCK_TITLES below to match, or this
 * check silently stops detecting the regression it was built for.
 */

// Keep in sync with MOCK_POSTS titles in src/lib/wordpress.ts.
const MOCK_TITLES = [
  'How to Launch a Successful Web3 Community in 2026',
  'The Ultimate Guide to Programmatic SEO for Crypto Projects',
  '5 Mistakes to Avoid in Your Next Influencer Campaign',
  'Mastering Liquid Liquidity: Defi Token Launch playbooks',
  'AI Marketing Bots: The Future of Crypto Project Seeding',
  'Navigating Global Web3 Regulatory Marketing Policies',
  'Avalanche Ecosystem Regional Growth Campaign',
  'Aptos Community Acceleration Campaign',
];

const BLOG_URL = 'https://fintech24h.com/blog';
const MIN_ARTICLE_TITLES = 1;
// Matches: <h2 class="font-display ...>  (attribute order/spacing may vary,
// so we only anchor on `<h2` + `class="font-display` appearing together)
const ARTICLE_TITLE_RE = /<h2\s+class="font-display\b/gi;

export default {
  async fetch() {
    return new Response('fintech24h-blog-monitor: use the cron trigger, not fetch', { status: 200 });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(runCheck(env));
  },
};

async function runCheck(env) {
  let html;
  let fetchError = null;

  try {
    const res = await fetch(BLOG_URL, {
      headers: { 'User-Agent': 'fintech24h-blog-monitor/1.0 (+cron health check)' },
      cf: { cacheTtl: 0, cacheEverything: false },
    });
    if (!res.ok) {
      fetchError = `HTTP ${res.status} fetching ${BLOG_URL}`;
    } else {
      html = await res.text();
    }
  } catch (err) {
    fetchError = `Fetch threw: ${String(err)}`;
  }

  if (fetchError) {
    await alert(env, [
      '🚨 BLOG MONITOR: fetch failed',
      `URL: ${BLOG_URL}`,
      fetchError,
    ]);
    return;
  }

  const foundMockTitles = MOCK_TITLES.filter((title) => html.includes(title));
  const articleTitleCount = (html.match(ARTICLE_TITLE_RE) || []).length;

  const problems = [];
  if (foundMockTitles.length > 0) {
    problems.push(
      `MOCK_POSTS leaked into production — found ${foundMockTitles.length} mock title(s): ` +
      foundMockTitles.map((t) => `"${t}"`).join(', ')
    );
  }
  if (articleTitleCount < MIN_ARTICLE_TITLES) {
    problems.push(
      `Blog appears empty/broken — found ${articleTitleCount} article title element(s) ` +
      `matching <h2 class="font-display...>, expected >= ${MIN_ARTICLE_TITLES}`
    );
  }

  if (problems.length > 0) {
    await alert(env, ['🚨 BLOG MONITOR: regression detected', `URL: ${BLOG_URL}`, '', ...problems]);
  }
}

async function alert(env, lines) {
  const token = env.TELEGRAM_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('TELEGRAM_TOKEN/TELEGRAM_CHAT_ID not configured; cannot send alert:', lines.join('\n'));
    return;
  }

  const now = new Date().toISOString();
  const text = [...lines, '', `⏰ Checked at: ${now}`].join('\n');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    console.error('Telegram sendMessage failed:', res.status, await res.text());
  }
}
