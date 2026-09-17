// src/data/dealmakers/content.ts
// Single resolver every dealmakers component/page uses instead of importing
// ss3.ts directly, so the same component tree renders either the English or
// Arabic (RTL) content set. Add a new locale by adding a ss3.<locale>.ts
// file with the identical exported shape and one branch here.
import * as en from './ss3';
import * as ar from './ss3.ar';

export type DealmakersLocale = 'en' | 'ar';

export const isRtl = (locale: DealmakersLocale) => locale === 'ar';

export function getSS3Content(locale: DealmakersLocale) {
  return locale === 'ar' ? ar : en;
}
