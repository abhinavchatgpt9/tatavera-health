import { PROCEDURES } from '@/lib/constants';

const USA_COST_MULTIPLIER: Record<string, number> = {
  Cardiac: 18,
  Orthopedic: 12,
  Transplants: 10,
  'IVF & Fertility': 8,
  Cosmetic: 6,
  Spine: 10,
};

const SUCCESS_RATES: Record<string, string> = {
  Cardiac: '97–99%',
  Orthopedic: '96–98%',
  Transplants: '88–93%',
  'IVF & Fertility': '60–70%',
  Cosmetic: '98%+',
  Spine: '90–95%',
};

export default function ProcedureCards() {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const categories = Array.from(new Set(PROCEDURES.map((p) => p.category)));

  const categoryEmoji: Record<string, string> = {
    Cardiac: '❤️',
    Orthopedic: '🦴',
    Transplants: '🫀',
    'IVF & Fertility': '👶',
    Cosmetic: '✨',
    Spine: '🦴',
  };

  return (
    <section id="procedures" className="section-padding bg-white">
      <div className="container-max">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6">Featured Procedures</h2>
          <p className="text-lg text-text-muted">
            Explore our most requested procedures. All prices are inclusive of surgery, hospital
            stay, and 6 months of post-operative telemedicine follow-up.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-16">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="text-3xl">{categoryEmoji[category] ?? '🏥'}</span>
              {category} Procedures
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROCEDURES.filter((p) => p.category === category).map((procedure) => {
                const usaApprox = procedure.costTo * (USA_COST_MULTIPLIER[category] ?? 10);
                const savings = Math.round(((usaApprox - procedure.costFrom) / usaApprox) * 100);
                const successRate = SUCCESS_RATES[category] ?? '95%+';
                return (
                  <div key={procedure.id} className="card card-hover flex flex-col">
                    <div className="mb-4">
                      <span className="inline-block bg-success/10 text-success font-bold px-3 py-1 rounded-full text-sm">
                        Save ~{savings}% vs USA
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold mb-2">{procedure.name}</h4>
                    <p className="text-sm text-text-muted mb-4">{procedure.description}</p>

                    <div className="bg-gradient-subtle rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-text-muted">USA (est.)</span>
                        <span className="text-sm line-through text-text-muted">
                          {formatCurrency(usaApprox)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-text-muted">India</span>
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(procedure.costFrom)}–{formatCurrency(procedure.costTo)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6 flex-grow">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-primary font-semibold">⏱️</span>
                        <span className="text-text-muted">Timeline: {procedure.timeline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-primary font-semibold">🏥</span>
                        <span className="text-text-muted">Hospital Stay: {procedure.hospitalStay}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-success font-semibold">✓</span>
                        <span className="text-text-muted">Success Rate: {successRate}</span>
                      </div>
                    </div>

                    <a href="/free-consultation" className="btn-primary w-full text-center">
                      Get Quote for {procedure.name.split('(')[0].trim()}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-12 p-4 bg-background border border-border rounded-lg">
          <p className="text-sm text-text-muted">
            <strong>Note:</strong> Prices are estimates and vary based on individual medical
            conditions, hospital choice, and surgeon expertise. Final quotes provided after initial
            medical assessment. All costs are transparent with no hidden fees.
          </p>
        </div>
      </div>
    </section>
  );
}
