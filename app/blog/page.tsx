import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Medical Tourism Blog & Resources | Tatavera Health',
  description: 'Expert guides on treatment abroad, destination tips, visa information, and patient stories to help you make informed decisions.',
};

const CATEGORY_ICONS: Record<string, string> = {
  'Medical Tourism Tips': '💡',
  'Treatment Guides': '🩺',
  'Destination Guides': '🌍',
  'Patient Stories': '💬',
  'Visa & Travel': '✈️',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Medical Tourism Tips': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  'Treatment Guides': 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  'Destination Guides': 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
  'Patient Stories': 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  'Visa & Travel': 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
};

const POST_EMOJIS = ['✈️', '❤️', '🔬', '🏥', '🌏', '💊'];

export default function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categoryFilter = searchParams.category || '';
  const filtered = BLOG_POSTS.filter((p) =>
    !categoryFilter || p.category === categoryFilter
  );

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-rose-600 dark:from-slate-900 dark:via-amber-950 dark:to-slate-900 py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                📰 Blog & Resources
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Your Medical Tourism Guide
              </h1>
              <p className="text-orange-100 text-lg max-w-xl">
                Expert articles on treatment abroad, destination guides, visa tips, and patient stories — everything you need to plan your medical journey with confidence.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${!categoryFilter ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
            >
              All Articles
            </Link>
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${categoryFilter === cat ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </Link>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flashcard group overflow-hidden block"
                >
                  {/* Cover */}
                  <div className="relative h-44 -mx-6 -mt-6 mb-5 rounded-t-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">
                      {POST_EMOJIS[i % POST_EMOJIS.length]}
                    </span>
                    <div className={`absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[post.category] ?? 'bg-blue-50 text-blue-600'}`}>
                      {CATEGORY_ICONS[post.category]} {post.category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-2">
                    <span>{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>{post.readTime} min read</span>
                  </div>

                  <h2 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-snug text-base">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                    Read Article →
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📰</div>
              <p className="text-slate-400 text-lg">No articles in this category yet.</p>
              <p className="text-slate-400 text-sm mt-1">Check back soon — we publish weekly!</p>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-3xl p-8 md:p-10 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Get weekly tips in your inbox</h3>
                <p className="text-blue-200 text-sm">Patient guides, cost comparisons, visa tips — delivered every Tuesday. Unsubscribe anytime.</p>
              </div>
              <form className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 md:w-60 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 outline-none focus:ring-2 focus:ring-white/40 text-sm"
                />
                <button type="submit" className="px-5 py-2.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm whitespace-nowrap active:scale-95">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
