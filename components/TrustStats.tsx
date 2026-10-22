import { Users, Building2, Stethoscope, Globe, type LucideIcon } from 'lucide-react';
import { TRUST_STATS } from '@/lib/constants';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Card } from '@/components/ui/Card';
import { StaggerGroup, StaggerItem, SpotlightCard } from '@/components/ui/motion';

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  'building-2': Building2,
  stethoscope: Stethoscope,
  globe: Globe,
};

export default function TrustStats() {
  if (TRUST_STATS.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-slate-50 py-14 dark:bg-slate-900/50">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StaggerGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {TRUST_STATS.map((stat) => {
            const Icon = ICONS[stat.icon];
            return (
              <StaggerItem key={stat.label}>
                <SpotlightCard>
                  <Card hoverable className="p-6 text-center">
                    <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <div className="mb-1 text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white lg:text-4xl">
                      <AnimatedCounter target={stat.value} duration={1800} />
                    </div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
                  </Card>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
