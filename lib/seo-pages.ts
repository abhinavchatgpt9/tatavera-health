import { BLOG_POSTS, DESTINATIONS, PROCEDURES } from '@/lib/constants';

/**
 * Every public, indexable page that belongs in sitemap.xml, with the date its content last changed.
 *
 * Dates are real content dates, not "today". When you change a page's content, update its date here.
 * Pages that are private (portals, login, dashboard), redirects (/treatments/<slug>/hospitals) and filtered
 * list URLs (?city=, ?page=, ?category=) are deliberately left out.
 */
export type SitemapPage = { path: string; lastModified: string };

/** Fixed pages, as YYYY-MM-DD. */
const STATIC_PAGES: Array<[path: string, lastModified: string]> = [
  ['', '2026-11-20'],
  ['about', '2026-11-18'],
  ['services', '2026-11-18'],
  ['how-it-works', '2026-11-18'],
  ['why-choose-us', '2026-11-18'],
  ['faq', '2026-11-18'],
  ['free-consultation', '2026-11-18'],
  ['contact', '2026-11-18'],
  ['partner-with-us', '2026-09-13'],
  ['treatments', '2026-11-18'],
  ['destinations', '2026-10-23'],
  ['hospitals', '2026-10-23'],
  ['best-hospitals', '2026-11-18'],
  ['doctors', '2026-11-18'],
  ['patient-stories', '2026-10-23'],
  ['blog', '2026-11-20'],
  ['privacy', '2026-11-18'],
  ['terms', '2026-11-18'],
];

/** Detail pages built from site data. Update these dates when the template or data for that group changes. */
const TREATMENT_PAGES_UPDATED = '2026-11-20';
const DESTINATION_PAGES_UPDATED = '2026-11-20';
/** The ranking data was last checked on 18 November 2026 (see lib/hospital-rankings-data.ts). */
const HOSPITAL_GUIDE_PAGES_UPDATED = '2026-11-18';

export function getSitemapPages(): SitemapPage[] {
  const pages: SitemapPage[] = STATIC_PAGES.map(([path, lastModified]) => ({ path: path ? `/${path}` : '', lastModified }));

  for (const p of PROCEDURES) pages.push({ path: `/treatments/${p.slug}`, lastModified: TREATMENT_PAGES_UPDATED });
  for (const d of DESTINATIONS) pages.push({ path: `/destinations/${d.slug}`, lastModified: DESTINATION_PAGES_UPDATED });
  // Hospital guides: the "best hospitals in India" list for each procedure.
  for (const p of PROCEDURES) pages.push({ path: `/best-hospitals/${p.slug}`, lastModified: HOSPITAL_GUIDE_PAGES_UPDATED });
  for (const post of BLOG_POSTS) pages.push({ path: `/blog/${post.slug}`, lastModified: post.updated });

  return pages;
}
