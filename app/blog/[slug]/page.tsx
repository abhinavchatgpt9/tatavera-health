import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BLOG_POSTS } from '@/lib/constants';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return { title: `${post.title} | Tatavera Health`, description: post.excerpt };
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

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            <span>📅 {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>⏱ {post.readTime} min read</span>
          </div>

          {/* Content placeholder */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <p className="text-xl text-gray-600">{post.excerpt}</p>
            <p>Medical tourism has grown exponentially over the last decade, with millions of patients choosing to travel abroad for treatments that are either unavailable, unaffordable, or subject to long waiting times in their home countries. This guide covers everything you need to know to plan a safe and successful medical journey.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8">Key Considerations</h2>
            <p>Before choosing a hospital or doctor abroad, it&apos;s essential to verify accreditation status, surgeon credentials, and outcomes data. Our team at Tatavera Health vets every partner hospital and doctor on your behalf.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8">Cost Savings</h2>
            <p>Patients typically save 60-85% compared to Western pricing, without compromising on quality. All our partner hospitals hold JCI or NABH accreditation — the same international standards as leading Western hospitals.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8">Planning Your Journey</h2>
            <p>Tatavera Health handles everything — from initial case review and hospital matching to visa assistance, airport transfers, accommodation, and post-treatment follow-up. Our service is completely free for patients.</p>
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Plan Your Treatment?</h3>
            <p className="text-gray-600 mb-4">Talk to our medical team — free consultation, no obligation.</p>
            <Link href="/contact" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
              Get Free Consultation
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
