import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InlineLinks from '@/components/InlineLinks';
import { BLOG_POSTS, SITE_NAME } from '@/lib/constants';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: `${post.title} | Tatvavera Health`,
    description: post.excerpt,
    alternates: { canonical: path },
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      url: path,
      siteName: SITE_NAME,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: post.updated,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images: ['/og-image.png'] },
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export default function BlogArticlePage({ params }: Props) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-800">{post.title}</span>
          </div>

          <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">{post.category}</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-4 leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            <span>By {post.author}</span>
            <span>📅 {post.updated === post.date ? 'Published' : 'Updated'} {new Date(post.updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>⏱ {post.readTime} min read</span>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <p className="text-xl text-gray-600">{post.excerpt}</p>
            {post.sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mt-8">{section.heading}</h2>
                {section.paragraphs?.map((para, i) => (
                  <p key={i}><InlineLinks text={para} /></p>
                ))}
                {section.bullets && (
                  <ul className="list-disc pl-6 space-y-2">
                    {section.bullets.map((b) => (
                      <li key={b}><InlineLinks text={b} /></li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <p className="text-sm text-gray-500 border-t border-gray-100 pt-6">
              This guide is general information, not medical advice. Always follow the instructions of your own doctor and treating team.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Plan Your Treatment?</h3>
            <p className="text-gray-600 mb-4">Send a callback request. Our enquiry review is free and there is no obligation.</p>
            <Link href="/free-consultation" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
              Request a callback
            </Link>
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-5">Related Articles</h3>
            <div className="space-y-3">
              {BLOG_POSTS.filter((p) => p.slug !== params.slug).map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
                  <div className="text-2xl">📰</div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.category} · {p.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
