/**
 * Rewrite saved "The Purge" exfoliator snapshots to match the current OIL_PRESETS
 * bha_penetrating recipe (single source of truth in treatment-oils.ts).
 *
 * Matches:
 * - productType EXFOLIATOR or TREATMENT_OIL
 * - name is one of the canonical titles, OR snapshot looks like the previous preset
 *   (activePct 0.13, bisabolol-first actives weight 6)
 *
 * Usage: DATABASE_URL=... npx tsx scripts/sync-purge-saved-formulas.ts
 * Dry run: SYNC_PURGE_DRY_RUN=1 npx tsx scripts/sync-purge-saved-formulas.ts
 */
import 'dotenv/config';
import { PrismaClient, type Prisma } from '@prisma/client';
import { OIL_PRESETS } from '../src/lib/ingredients/treatment-oils';

const CANONICAL_NAMES = new Set([
  'The Purge — BHA Penetration Oil',
  'The Purge - BHA Penetration Oil',
  'EXFOLIATOR - The Purge — BHA Penetration Oil',
]);

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function activesInclude(ingredients: unknown, slug: string): boolean {
  const pools = asRecord(asRecord(ingredients)?.pools);
  const actives = pools?.actives;
  if (!Array.isArray(actives)) return false;
  return actives.some(a => (a as { ingId?: string }).ingId === slug);
}

function shouldSyncPurge(row: { name: string; ingredients: unknown }): boolean {
  if (CANONICAL_NAMES.has(row.name)) return true;
  if (activesInclude(row.ingredients, 'willowbark')) return true;
  if (activesInclude(row.ingredients, 'salicylic_acid')) {
    // Already on SA — still refresh to latest preset ratios/protocol
    return true;
  }
  const root = asRecord(row.ingredients);
  if (!root || root.v !== 1) return false;
  if (root.activePct === 0.13) return true;
  return false;
}

async function main() {
  const p = OIL_PRESETS.find(x => x.id === 'bha_penetrating');
  if (!p || typeof p.activePct !== 'number' || typeof p.eoPct !== 'number') {
    console.error('bha_penetrating preset missing activePct/eoPct');
    process.exit(1);
  }
  const snapshot: Prisma.InputJsonValue = {
    v: 1,
    activePct: p.activePct,
    eoPct: p.eoPct,
    manufacturingNote: p.manufacturingNote ?? undefined,
    pools: {
      carriers: p.carriers,
      actives: p.actives,
      eos: p.eos,
    },
  };

  const dry = process.env.SYNC_PURGE_DRY_RUN === '1';
  const prisma = new PrismaClient();

  const rows = await prisma.formula.findMany({
    where: { productType: { in: ['EXFOLIATOR', 'TREATMENT_OIL'] } },
    select: { id: true, name: true, ingredients: true },
  });

  const targets = rows.filter(r => shouldSyncPurge(r));

  console.log(
    `Found ${targets.length} saved formula(s) to sync to Purge preset (dryRun=${dry}).`,
  );

  for (const r of targets) {
    if (dry) {
      console.log(`[dry-run] ${r.id} "${r.name}"`);
      continue;
    }
    await prisma.formula.update({
      where: { id: r.id },
      data: { ingredients: snapshot },
    });
    console.log(`[ok] ${r.id} "${r.name}"`);
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
