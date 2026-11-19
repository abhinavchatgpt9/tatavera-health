import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getSitemapPages } from '@/lib/seo-pages';

// Lists every public, indexable page once, including treatment, destination, hospital-guide and blog pages.
// Page dates come from lib/seo-pages.ts so they change only when content changes, not on every build.
export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapPages().map(({ path, lastModified }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(`${lastModified}T00:00:00Z`),
    priority: path === '' ? 1 : 0.7,
  }));
}
