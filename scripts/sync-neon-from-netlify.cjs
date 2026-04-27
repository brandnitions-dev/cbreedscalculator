/**
 * prisma db push + seed using DATABASE_URL from the linked Netlify site's
 * production env (no manual copy/paste). Requires: netlify login + netlify link.
 */
const { execSync } = require('child_process');

const url = execSync('npx netlify env:get DATABASE_URL --context production', {
  encoding: 'utf8',
}).trim();

if (!url.startsWith('postgres')) {
  console.error('Netlify production DATABASE_URL must be a postgres URL.');
  process.exit(1);
}

console.log('Using DATABASE_URL from Netlify (production). Running prisma db push...');
execSync('npx prisma db push', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: url },
});
console.log('Running db:seed...');
execSync('npm run db:seed', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: url },
});
