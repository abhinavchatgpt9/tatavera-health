import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/constants';

export default function BlogPreview() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Resources & Guides</h2>
            <p className="text-gray-500 mt-1">Helpful articles to plan your medical journey</p>
          </div>
          <Link href="/blog" className="hidden md:inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline text-sm">
            View All Articles →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="h-44 bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
                <span className="text-5xl">📰</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">{post.category}</span>
                  <span className="text-gray-400 text-xs">{post.readTime} min read</span>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/blog" className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm hover:underline">
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
