/**
 * SOURCE: Neon production (same project as wire-neon-to-netlify.cjs).
 * TARGET: your VPS Postgres — set TARGET_DATABASE_URL (required).
 *
 * Optional: MIGRATE_FORMULAS_OWNER_EMAIL, MIGRATE_FORMULAS_DRY_RUN=1, MIGRATE_FORMULAS_SKIP_DEDUPE=1
 *
 * PowerShell:
 *   $env:TARGET_DATABASE_URL="postgresql://USER:PASS@VPS_HOST:5432/DB?sslmode=require"
 *   $env:MIGRATE_FORMULAS_OWNER_EMAIL="admin@mosskynlab.com"
 *   npm run db:migrate-formulas:to-vps
 */
const { execSync, spawnSync } = require('child_process');

const NEONS = {
  orgId: 'org-holy-shadow-57548995',
  projectId: 'calm-tooth-00446342',
  branch: 'production',
};

const target = process.env.TARGET_DATABASE_URL?.trim();
if (!target) {
  console.error(
    'Set TARGET_DATABASE_URL to your VPS Postgres URL.\n' +
      '(It is not in Netlify for this repo — only Neon DATABASE_URL is there.)',
  );
  process.exit(1);
}

let source;
try {
  source = execSync(
    `npx neonctl connection-string ${NEONS.branch} --project-id ${NEONS.projectId} --pooled --prisma --org-id ${NEONS.orgId}`,
    { encoding: 'utf8', shell: true, windowsHide: true },
  ).trim();
} catch (e) {
  console.error('Could not read Neon connection string (neonctl). Log in: npx neonctl auth.');
  process.exit(1);
}

if (!source.startsWith('postgresql://')) {
  console.error('Neon connection-string did not return a postgres URL.');
  process.exit(1);
}

if (source === target) {
  console.error('SOURCE and TARGET are identical — nothing to migrate.');
  process.exit(1);
}

const env = {
  ...process.env,
  SOURCE_DATABASE_URL: source,
  TARGET_DATABASE_URL: target,
};

const r = spawnSync('npx', ['tsx', 'scripts/migrate-formulas-neon-to-neon.ts'], {
  stdio: 'inherit',
  env,
  shell: true,
  windowsHide: true,
});

process.exit(r.status === null ? 1 : r.status);
