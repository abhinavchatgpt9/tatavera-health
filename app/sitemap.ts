import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// Public, indexable pages only. Add dynamic pages (treatments, blog posts) here once they exist in the database.
const PAGES = ['', 'about', 'services', 'how-it-works', 'why-choose-us', 'faq', 'free-consultation', 'treatments', 'destinations', 'hospitals', 'doctors', 'patient-stories', 'blog'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({
    url: `${SITE_URL}${path ? `/${path}` : ''}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}
