/**
 * Copy saved formulas (+ batch logs) from an old Postgres URL (e.g. previous Neon)
 * into the current / new database.
 *
 * Env:
 *   SOURCE_DATABASE_URL — old Neon connection string (required)
 *   TARGET_DATABASE_URL — new DB (optional; falls back to DATABASE_URL)
 *   MIGRATE_FORMULAS_OWNER_EMAIL — if set, every imported row is owned by this user
 *     on the target DB (useful when old users do not exist in the new DB)
 *   MIGRATE_FORMULAS_DRY_RUN=1 — log actions only, no writes
 *   MIGRATE_FORMULAS_SKIP_DEDUPE=1 — allow inserts even when a near-duplicate exists
 *
 * Windows (PowerShell):
 *   $env:SOURCE_DATABASE_URL="postgresql://..."; $env:TARGET_DATABASE_URL="postgresql://..."; npm run db:migrate-formulas
 */

import 'dotenv/config';
import { Prisma, PrismaClient } from '@prisma/client';

const sourceUrl = process.env.SOURCE_DATABASE_URL?.trim();
const targetUrl = (process.env.TARGET_DATABASE_URL || process.env.DATABASE_URL)?.trim();
const ownerOverride = process.env.MIGRATE_FORMULAS_OWNER_EMAIL?.trim().toLowerCase();
const dryRun = process.env.MIGRATE_FORMULAS_DRY_RUN === '1';
const skipDedupe = process.env.MIGRATE_FORMULAS_SKIP_DEDUPE === '1';

function die(msg: string): never {
  console.error(msg);
  process.exit(1);
}

if (!sourceUrl) {
  die('SOURCE_DATABASE_URL is required (old Neon connection string).');
}
if (!targetUrl) {
  die('TARGET_DATABASE_URL or DATABASE_URL is required for the destination.');
}
if (sourceUrl === targetUrl) {
  die('SOURCE_DATABASE_URL and target URL must differ.');
}

const source = new PrismaClient({ datasourceUrl: sourceUrl });
const target = new PrismaClient({ datasourceUrl: targetUrl });

async function resolveTargetUserId(sourceEmail: string): Promise<string | null> {
  const email = ownerOverride ?? sourceEmail.toLowerCase();
  const user = await target.user.findUnique({ where: { email } });
  return user?.id ?? null;
}

function sameSnapshot(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function main() {
  const rows = await source.formula.findMany({
    include: {
      user: { select: { email: true } },
      batches: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Source: ${rows.length} formula(s). dryRun=${dryRun} dedupe=${!skipDedupe}`);

  let inserted = 0;
  let skippedDup = 0;
  let skippedNoUser = 0;

  for (const f of rows) {
    const srcEmail = f.user.email;
    const targetUserId = await resolveTargetUserId(srcEmail);

    if (!targetUserId) {
      console.warn(
        `[skip] No target user for email "${ownerOverride ?? srcEmail}" — formula "${f.name}" (${f.id})`,
      );
      skippedNoUser++;
      continue;
    }

    if (!skipDedupe) {
      const existing = await target.formula.findFirst({
        where: {
          userId: targetUserId,
          name: f.name,
          productType: f.productType,
        },
      });
      if (existing && sameSnapshot(existing.ingredients, f.ingredients)) {
        console.log(`[dup] "${f.name}" already present for user — skipping`);
        skippedDup++;
        continue;
      }
    }

    if (dryRun) {
      console.log(`[dry-run] would insert "${f.name}" → user ${targetUserId}`);
      inserted++;
      continue;
    }

    const created = await target.$transaction(async (tx) => {
      const nf = await tx.formula.create({
        data: {
          name: f.name,
          productType: f.productType,
          mode: f.mode,
          batchSize: f.batchSize,
          ingredients: f.ingredients as Prisma.InputJsonValue,
          eoBlend:
            f.eoBlend === null ? Prisma.JsonNull : (f.eoBlend as Prisma.InputJsonValue | undefined),
          soapData:
            f.soapData === null ? Prisma.JsonNull : (f.soapData as Prisma.InputJsonValue | undefined),
          tags: f.tags as Prisma.InputJsonValue,
          notes: f.notes,
          userId: targetUserId,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
        },
      });

      for (const b of f.batches) {
        await tx.batchLog.create({
          data: {
            formulaId: nf.id,
            batchSize: b.batchSize,
            notes: b.notes,
            createdAt: b.createdAt,
          },
        });
      }

      return nf;
    });

    console.log(`[ok] "${f.name}" → ${created.id}`);
    inserted++;
  }

  console.log(
    `Done. inserted=${inserted} skippedDuplicate=${skippedDup} skippedNoUser=${skippedNoUser}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await source.$disconnect();
    await target.$disconnect();
  });
