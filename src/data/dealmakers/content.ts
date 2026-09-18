// src/data/dealmakers/content.ts
// Single resolver every dealmakers component/page uses instead of importing
// ss3.ts directly, so the same component tree renders the English, Arabic
// (RTL), or Simplified Chinese content set. Add a new locale by adding a
// ss3.<locale>.ts file with the identical exported shape and one branch here.
import * as en from './ss3';
import * as ar from './ss3.ar';
import * as zh from './ss3.zh';

export type DealmakersLocale = 'en' | 'ar' | 'zh';

export const isRtl = (locale: DealmakersLocale) => locale === 'ar';

export function getSS3Content(locale: DealmakersLocale) {
  if (locale === 'ar') return ar;
  if (locale === 'zh') return zh;
  return en;
}
