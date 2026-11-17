import Header from '@/components/Header';
import Footer from '@/components/Footer';

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Shown after the bullets. */
  after?: string;
}

interface Props {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

/** Plain, readable layout shared by the Privacy Policy and Terms of Use pages. */
export default function LegalPage({ title, intro, updated, sections }: Props) {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">{title}</h1>
            <p className="text-slate-600 dark:text-slate-400">{intro}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">Last updated: {updated}</p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-9">
          {sections.map((section, index) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {index + 1}. {section.title}
              </h2>
              {section.paragraphs?.map((text) => (
                <p key={text} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">{text}</p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-6 space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  {section.bullets.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              )}
              {section.after && <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{section.after}</p>}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  );
}
