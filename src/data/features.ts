// src/data/features.ts
// Site-wide feature switches.
//
// CASE_STUDIES_ENABLED — the /case-studies section is hidden until there are verified records
// in WordPress (custom post type `case-study`). While false: no menu/footer link, no homepage
// widget, /case-studies and /case-studies/* answer 404, and the WP `case-study` endpoint is
// never called (it used to be hit ~111,000 times in 17 days, always 404).
// To bring it back: add the records in WordPress, set this to true, deploy. Nothing else to edit
// (also re-add `/case-studies` to `TRAILING_SLASH_PATHS` in middleware.ts only if you make the
// index page static again).
export const CASE_STUDIES_ENABLED = false;
