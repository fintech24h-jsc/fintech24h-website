// src/lib/verify-team.ts
// Pure, dependency-free matching logic for the /verify-members tool. Runs
// entirely client-side (bundled into the page's own script) against the
// public roster in src/data/team.ts + the WP plugin — no network call,
// nothing to submit or leak.
//
// Both the pasted input AND each stored team-member URL are put through the
// SAME extractHandle() normalizer before comparison, so formatting drift
// (http vs https, www, trailing slash, query params, casing) can never
// itself cause a false "not verified" result.

export type Platform = 'linkedin' | 'telegram' | 'instagram' | 'email';

/** The domain that makes a pasted email "look official" even when it isn't
 *  a real, registered address — see the email_not_activated result below. */
export const COMPANY_EMAIL_DOMAIN = 'fintech24h.com';

export interface VerifiableMember {
  name: string;
  role: string;
  image?: string;
  telegram?: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
  profileHref?: string;
  /** True once someone is marked "has left Fintech24h" in the plugin — they
   *  were real, but no longer represent the company. Kept distinct from
   *  simply removing/drafting them so the tool can actively warn instead of
   *  just saying "not found" (which reads as "never was affiliated"). */
  leftCompany?: boolean;
  /** Optional `YYYY-MM-DD`. Present only when leftCompany is true AND a date
   *  was recorded — omitted entirely just means "left, no date on file". */
  departureDate?: string;
}

/** A free-form "this belongs to the Fintech24h ecosystem" entry — a company
 *  Facebook page, a shared inbox, a sister project's site — anything that
 *  isn't one specific person's structured LinkedIn/Telegram/Instagram/email. */
export interface EcosystemLink {
  label: string;
  value: string;
}

export interface ExtractedHandle {
  platform: Exclude<Platform, 'email'>;
  handle: string;
}

export type VerifyResult =
  | { status: 'empty' }
  | { status: 'invalid' }
  // platform is omitted when the input was a bare handle (e.g. "phatvt" or
  // "@phatvt") checked across every platform at once rather than one
  // specific link — see findMemberByBareHandleAnyPlatform() below.
  | { status: 'not_found'; platform?: Platform }
  | { status: 'verified'; platform: Platform; member: VerifiableMember }
  | { status: 'former'; platform: Platform; member: VerifiableMember; departureDate?: string }
  | { status: 'verified_ecosystem'; label: string }
  | { status: 'email_not_activated' }
  | { status: 'email_outside_ecosystem' };

/**
 * Pulls a lowercase, platform-qualified handle out of a LinkedIn, Telegram,
 * or Instagram URL. Returns null for anything else — including a bare
 * @handle, which has no domain to say which platform it's from; that case
 * is handled separately in verifyMember() by searching every platform at
 * once instead of guessing one here.
 */
export function extractHandle(raw: string): ExtractedHandle | null {
  let s = raw.trim();
  if (!s) return null;

  if (!/^https?:\/\//i.test(s)) {
    if (
      /^(t\.me|telegram\.me)\//i.test(s) ||
      /^(www\.)?linkedin\.com\//i.test(s) ||
      /^(www\.)?instagram\.com\//i.test(s)
    ) {
      s = 'https://' + s;
    } else {
      return null;
    }
  }

  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const segments = url.pathname.split('/').filter(Boolean);

  if (host === 't.me' || host === 'telegram.me') {
    const handle = segments[0];
    if (!handle) return null;
    return { platform: 'telegram', handle: handle.toLowerCase() };
  }

  if (host === 'linkedin.com') {
    if (segments[0] === 'in' && segments[1]) {
      return { platform: 'linkedin', handle: segments[1].toLowerCase() };
    }
    return null;
  }

  if (host === 'instagram.com') {
    const handle = segments[0];
    if (!handle) return null;
    return { platform: 'instagram', handle: handle.toLowerCase() };
  }

  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/**
 * Loose, platform-agnostic normalizer used ONLY for matching against the
 * free-form Ecosystem Links table — where the whole point is "any URL, any
 * platform" rather than something extractHandle's LinkedIn/Telegram/
 * Instagram-specific parsing understands. Emails compare as lowercase text;
 * everything else compares as host+path with protocol/www/trailing-slash/
 * query/hash stripped, so `t.me/x`, `https://T.ME/x/`, and `www.t.me/x?utm=1`
 * all normalize identically.
 */
export function normalizeForEcosystemMatch(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return '';
  if (isValidEmail(trimmed)) return trimmed;

  const withScheme = /^https?:\/\//.test(trimmed) ? trimmed : 'https://' + trimmed;
  try {
    const url = new URL(withScheme);
    const host = url.hostname.replace(/^www\./, '');
    const path = url.pathname.replace(/\/+$/, '');
    return `${host}${path}`;
  } catch {
    return trimmed;
  }
}

function findEcosystemMatch(raw: string, ecosystemLinks: EcosystemLink[]): EcosystemLink | null {
  const target = normalizeForEcosystemMatch(raw);
  if (!target) return null;
  return ecosystemLinks.find((link) => normalizeForEcosystemMatch(link.value) === target) ?? null;
}

function findMemberByHandle(directory: VerifiableMember[], input: ExtractedHandle): VerifiableMember | null {
  for (const member of directory) {
    const candidateUrl =
      input.platform === 'linkedin' ? member.linkedin :
      input.platform === 'telegram' ? member.telegram :
      member.instagram;
    if (!candidateUrl) continue;
    const candidate = extractHandle(candidateUrl);
    if (candidate && candidate.platform === input.platform && candidate.handle === input.handle) {
      return member;
    }
  }
  return null;
}

const BARE_HANDLE_RE = /^[A-Za-z0-9_.\-]{2,100}$/;

/** Strips an optional leading "@" and lowercases; returns null if what's left
 *  doesn't even look like a plausible username (spaces, punctuation, etc.) —
 *  that's the only remaining case that's genuinely "invalid" input. */
function normalizeBareHandle(raw: string): string | null {
  const stripped = raw.trim().replace(/^@/, '');
  return BARE_HANDLE_RE.test(stripped) ? stripped.toLowerCase() : null;
}

/**
 * A visitor who only has a handle — not a full link — has no way to say
 * which platform it's from (someone's LinkedIn vanity slug, Telegram
 * @username, and Instagram handle are all the same shape). Rather than
 * force them to guess the right URL format, check the handle against every
 * platform for every member at once; a same-company handle collision across
 * two different platforms/people is vanishingly unlikely in practice, and
 * either way the visitor still gets a real, correct answer for who it is.
 */
function findMemberByBareHandleAnyPlatform(
  directory: VerifiableMember[],
  bareHandle: string
): { member: VerifiableMember; platform: Platform } | null {
  const platforms: Exclude<Platform, 'email'>[] = ['linkedin', 'telegram', 'instagram'];
  for (const member of directory) {
    for (const platform of platforms) {
      const url = platform === 'linkedin' ? member.linkedin : platform === 'telegram' ? member.telegram : member.instagram;
      if (!url) continue;
      const extracted = extractHandle(url);
      if (extracted && extracted.platform === platform && extracted.handle === bareHandle) {
        return { member, platform };
      }
    }
  }
  return null;
}

/** Same idea as above, but against the free-form Ecosystem Links table —
 *  only entries whose value is itself a LinkedIn/Telegram/Instagram URL can
 *  match a bare handle this way (an email or a plain website has no
 *  "handle" to compare against). */
function findEcosystemByBareHandle(ecosystemLinks: EcosystemLink[], bareHandle: string): EcosystemLink | null {
  for (const link of ecosystemLinks) {
    const extracted = extractHandle(link.value);
    if (extracted && extracted.handle === bareHandle) return link;
  }
  return null;
}

function memberResult(member: VerifiableMember, platform: Platform): VerifyResult {
  if (member.leftCompany) {
    return { status: 'former', platform, member, departureDate: member.departureDate };
  }
  return { status: 'verified', platform, member };
}

export function verifyMember(
  raw: string,
  directory: VerifiableMember[],
  ecosystemLinks: EcosystemLink[] = []
): VerifyResult {
  if (!raw.trim()) return { status: 'empty' };

  // 1. A recognized LinkedIn/Telegram/Instagram URL — check the structured
  //    per-member fields first (richer result: name, role, avatar), and only
  //    fall back to the generic ecosystem table (e.g. a company page on the
  //    same platform, not tied to one person) if no member matches.
  const handle = extractHandle(raw);
  if (handle) {
    const member = findMemberByHandle(directory, handle);
    if (member) return memberResult(member, handle.platform);

    const ecosystemMatch = findEcosystemMatch(raw, ecosystemLinks);
    if (ecosystemMatch) return { status: 'verified_ecosystem', label: ecosystemMatch.label };

    return { status: 'not_found', platform: handle.platform };
  }

  // 2. A valid email shape — same priority: a member's own registered
  //    address first, then the ecosystem table (shared inboxes like
  //    support@fintech24h.com aren't any one person's "email" field), and
  //    only then the @fintech24h.com-vs-other-domain distinction.
  const trimmed = raw.trim();
  if (isValidEmail(trimmed)) {
    const email = trimmed.toLowerCase();
    const member = directory.find((m) => m.email?.toLowerCase() === email);
    if (member) return memberResult(member, 'email');

    const ecosystemMatch = findEcosystemMatch(trimmed, ecosystemLinks);
    if (ecosystemMatch) return { status: 'verified_ecosystem', label: ecosystemMatch.label };

    const domain = email.split('@')[1] ?? '';
    if (domain === COMPANY_EMAIL_DOMAIN) return { status: 'email_not_activated' };
    return { status: 'email_outside_ecosystem' };
  }

  // 3. Not a recognized social URL, not an email — try it as a bare handle
  //    (e.g. "phatvt" or "@phatvt") searched across every platform for
  //    every member and every Ecosystem Link at once (see the doc comment
  //    on findMemberByBareHandleAnyPlatform for why platform is skipped).
  const bareHandle = normalizeBareHandle(raw);
  if (bareHandle) {
    const memberMatch = findMemberByBareHandleAnyPlatform(directory, bareHandle);
    if (memberMatch) return memberResult(memberMatch.member, memberMatch.platform);

    const ecosystemHandleMatch = findEcosystemByBareHandle(ecosystemLinks, bareHandle);
    if (ecosystemHandleMatch) return { status: 'verified_ecosystem', label: ecosystemHandleMatch.label };
  }

  // 4. Last resort: the ecosystem table matched by its normal URL/email
  //    comparison (covers a plain website or anything else registered
  //    there that isn't handle-shaped, e.g. "coinstori.com").
  const ecosystemMatch = findEcosystemMatch(raw, ecosystemLinks);
  if (ecosystemMatch) return { status: 'verified_ecosystem', label: ecosystemMatch.label };

  // A plausible-looking handle that matched nobody is still a meaningful
  // "not found" (could be a scammer's handle) rather than "we don't
  // understand your input" — only truly unparseable text is 'invalid'.
  if (bareHandle) return { status: 'not_found' };

  return { status: 'invalid' };
}
