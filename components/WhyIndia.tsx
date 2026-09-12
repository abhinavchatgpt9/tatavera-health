import { TRUST_STATS } from '@/lib/constants';

export default function WhyIndia() {
  return (
    <section id="why-india" className="section-padding bg-background">
      <div className="container-max">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6">Why Choose Indian Hospitals?</h2>
          <p className="text-lg text-text-muted">
            World-class medical expertise at a fraction of Western costs. JCI-accredited facilities,
            internationally trained surgeons, and proven outcomes.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="card card-hover text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-3">
                {stat.value}
              </div>
              <h4 className="text-lg font-semibold mb-2">{stat.label}</h4>
            </div>
          ))}
        </div>

        {/* Detailed Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-3">70-80% Cost Savings</h3>
            <p className="text-text-muted">
              A heart bypass that costs $123,000 in the USA costs just $7,000 in India. With
              hospital stays, flights, and accommodation included, you still save over $100,000.
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold mb-3">JCI-Accredited Excellence</h3>
            <p className="text-text-muted">
              All our partner hospitals are JCI-certified, meeting identical standards to Mayo
              Clinic, Cleveland Clinic, and other top Western institutions.
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold mb-3">World-Class Surgeons</h3>
            <p className="text-text-muted">
              Our surgeons trained at Harvard, Stanford, Johns Hopkins, and other leading
              institutions. Many have decades of experience and thousands of successful cases.
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold mb-3">Hassle-Free Travel</h3>
            <p className="text-text-muted">
              We handle everything: visa coordination, flight bookings, hospital accommodation,
              airport transfers, and even tourism recommendations for companions.
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-3">Ongoing Support</h3>
            <p className="text-text-muted">
              24/7 access to your surgical team via telemedicine for 6 months post-operation.
              Your surgeon remains involved in your recovery, even from home.
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3">Latest Technology</h3>
            <p className="text-text-muted">
              Robotic-assisted surgery, advanced imaging (CT, MRI), and minimally invasive
              techniques. Many Indian hospitals have cutting-edge tech before Western ones.
            </p>
          </div>
        </div>

        {/* Stats Highlight */}
        <div className="gradient-subtle rounded-lg p-8 md:p-12 mt-16 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">By The Numbers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-success flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Less than 1% complication rate for routine procedures</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-success flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Average patient satisfaction score of 4.9/5</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-success flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Most patients return to normal activity within 6-8 weeks</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">What Sets Us Apart</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-success flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Dedicated medical coordinators, not call centers</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-success flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Transparent pricing with no hidden costs</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-success flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Only partner with top-tier hospitals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
