import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/dashboard', '/admin-portal', '/doctor-portal', '/hospital-portal', '/case-manager-portal'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
