import Link from 'next/link';
import { DESTINATIONS } from '@/lib/constants';

export default function DestinationsPreview() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Top Medical Destinations</h2>
          <p className="text-gray-500 mt-2">World-class treatment across 8 leading countries</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="text-4xl mb-3">{dest.flag}</div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{dest.country}</h3>
              <p className="text-blue-600 text-xs font-medium mt-1">{dest.topTreatment}</p>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{dest.highlight}</p>
              <span className="inline-block mt-3 text-xs text-blue-600 font-semibold">Explore →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
