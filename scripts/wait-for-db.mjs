/**
 * Waits until localhost:5432 accepts connections (Docker Postgres is up).
 * Usage: node scripts/wait-for-db.mjs
 */
import net from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

const host = process.env.PGHOST || '127.0.0.1';
const port = parseInt(process.env.PGPORT || '5432', 10);
const maxAttempts = parseInt(process.env.DB_WAIT_ATTEMPTS || '40', 10);
const intervalMs = 500;

function tryConnect() {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port }, () => {
      socket.end();
      resolve();
    });
    socket.setTimeout(3000);
    socket.on('error', reject);
    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('timeout'));
    });
  });
}

for (let i = 0; i < maxAttempts; i++) {
  try {
    await tryConnect();
    console.log(`Postgres is reachable at ${host}:${port}`);
    process.exit(0);
  } catch {
    process.stdout.write(i === 0 ? 'Waiting for Postgres' : '.');
    await delay(intervalMs);
  }
}

console.error('\nTimed out waiting for Postgres. Is Docker running? Try: npm run db:up');
process.exit(1);
