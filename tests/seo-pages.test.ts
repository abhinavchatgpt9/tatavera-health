import { describe, it, expect } from 'vitest';
import { getSitemapPages } from '@/lib/seo-pages';
import { BLOG_POSTS, DESTINATIONS, PROCEDURES, PROCEDURE_SEO, HOME_TITLE, HOME_H1, HOME_DESCRIPTION } from '@/lib/constants';

describe('sitemap pages', () => {
  const pages = getSitemapPages();
  const paths = pages.map((p) => p.path);

  it('lists each URL once', () => {
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('includes the homepage and key public pages', () => {
    for (const p of ['', '/contact', '/free-consultation', '/blog', '/best-hospitals', '/destinations']) expect(paths).toContain(p);
  });

  it('includes every treatment, destination, hospital-guide and blog detail page', () => {
    for (const p of PROCEDURES) {
      expect(paths).toContain(`/treatments/${p.slug}`);
      expect(paths).toContain(`/best-hospitals/${p.slug}`);
    }
    for (const d of DESTINATIONS) expect(paths).toContain(`/destinations/${d.slug}`);
    for (const b of BLOG_POSTS) expect(paths).toContain(`/blog/${b.slug}`);
    expect(paths).toContain('/treatments/total-knee-replacement');
    expect(paths).toContain('/destinations/india');
  });

  it('leaves out private routes, redirects and filtered URLs', () => {
    for (const path of paths) {
      expect(path).not.toMatch(/portal|dashboard|auth|api|\?/);
      expect(path).not.toMatch(/\/treatments\/[^/]+\/hospitals$/);
    }
  });

  it('has a real calendar date for every page', () => {
    for (const p of pages) {
      expect(p.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(`${p.lastModified}T00:00:00Z`).getTime())).toBe(false);
    }
  });
});

describe('search-focused copy', () => {
  it('uses the exact homepage fields from the SEO brief', () => {
    expect(HOME_TITLE).toBe('Medical Treatment in India | Tatvavera Health');
    expect(HOME_H1).toBe('Plan your medical treatment in India');
    expect(HOME_DESCRIPTION).toBe(
      'Explore medical treatment in India with Tatvavera Health. Hospital coordination, travel planning and follow-up support for international patients.',
    );
  });

  it('has an India title and heading for every treatment page', () => {
    for (const p of PROCEDURES) {
      expect(PROCEDURE_SEO[p.slug]).toBeDefined();
      expect(PROCEDURE_SEO[p.slug].h1).toMatch(/ in India$/);
    }
    expect(PROCEDURE_SEO['total-knee-replacement'].h1).toBe('Knee replacement in India');
  });

  it('keeps guide links pointing at pages that exist', () => {
    const known = new Set(getSitemapPages().map((p) => p.path));
    for (const post of BLOG_POSTS) {
      const text = JSON.stringify(post.sections);
      for (const m of Array.from(text.matchAll(/\]\((\/[^)\s]*)\)/g))) expect(known.has(m[1])).toBe(true);
    }
  });
});
