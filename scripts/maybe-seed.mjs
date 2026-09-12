/**
 * Runs the database seed during a Vercel build, but only when RUN_SEED=1.
 *
 * The build server can reach Postgres; local machines behind a firewall often
 * cannot. Set RUN_SEED=1 in Vercel, deploy once, then remove the variable so
 * later deploys skip it. The seed itself is idempotent, so a stray run is
 * harmless — this guard exists to keep normal builds fast.
 */

import { execSync } from 'node:child_process';

if (process.env.RUN_SEED !== '1') {
  console.log('[seed] RUN_SEED is not 1 — skipping.');
  process.exit(0);
}

try {
  console.log('[seed] RUN_SEED=1 — seeding database…');
  execSync('npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts', {
    stdio: 'inherit',
  });
  console.log('[seed] done.');
} catch (error) {
  // Never fail the build over seeding — the app still deploys, and the seed
  // can be re-run. A hard failure here would take the whole site down.
  console.error('[seed] failed, continuing with the build:', error.message);
}
