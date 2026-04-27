/**
 * Fetches the Neon connection string (neonctl) and sets Netlify production env
 * for the linked site. Does not print secrets.
 */
const { execSync } = require('child_process');
const crypto = require('crypto');

const NEONS = {
  projectId: 'calm-tooth-00446342',
  branch: 'production',
};

const appUrl = 'https://crownbreeds-calc-2026.netlify.app';

const db = execSync(
  `npx neonctl connection-string ${NEONS.branch} --project-id ${NEONS.projectId} --pooled --prisma`,
  { encoding: 'utf8' }
).trim();

if (!db.startsWith('postgresql://')) {
  console.error('Invalid DATABASE_URL from neonctl');
  process.exit(1);
}

function netlifySet(key, value) {
  execSync(`npx netlify env:set ${key} ${JSON.stringify(value)} --context production --force`, {
    stdio: 'inherit',
    shell: true,
    windowsHide: true,
  });
}

netlifySet('DATABASE_URL', db);

const nextSecret = crypto.randomBytes(32).toString('hex');
netlifySet('NEXTAUTH_SECRET', nextSecret);
netlifySet('NEXTAUTH_URL', appUrl);

console.log('Netlify production env: DATABASE_URL (Neon), NEXTAUTH_URL, NEXTAUTH_SECRET (new random)');
