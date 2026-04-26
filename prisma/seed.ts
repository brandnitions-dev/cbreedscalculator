import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CARRIERS_A } from '@/lib/ingredients/carriers-a';
import { ACTIVES_B } from '@/lib/ingredients/actives-b';
import { EXFOLIANTS_C } from '@/lib/ingredients/exfoliants-c';
import { ESSENTIAL_OILS } from '@/lib/ingredients/essential-oils';
import { SOAP_OILS } from '@/lib/ingredients/soap-oils';
import { SOAP_ADDITIVES } from '@/lib/ingredients/soap-additives';
import { OIL_CARRIERS, OIL_ACTIVES, OIL_EOS } from '@/lib/ingredients/treatment-oils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed admin user
  const passwordHash = await bcrypt.hash('CrownBreeds2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crownbreeds.com' },
    update: {},
    create: {
      email: 'admin@crownbreeds.com',
      name: 'Crown Breeds Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  console.log('🧪 Seeding ingredient library...');

  const groups = [
    { key: 'carriers_a', label: 'Carrier Oils (A)', sortOrder: 10 },
    { key: 'actives_b', label: 'Active Botanicals (B)', sortOrder: 20 },
    { key: 'exfoliants_c', label: 'Physical Exfoliants (C)', sortOrder: 30 },
    { key: 'essential_oils', label: 'Essential Oils', sortOrder: 40 },
    { key: 'oil_carriers', label: 'Treatment/Exfoliator Carriers', sortOrder: 50 },
    { key: 'oil_actives', label: 'Treatment/Exfoliator Actives', sortOrder: 60 },
    { key: 'oil_eos', label: 'Treatment/Exfoliator Essential Oils', sortOrder: 70 },
    { key: 'soap_oils', label: 'Soap Oils (SAP)', sortOrder: 80 },
    { key: 'soap_additives', label: 'Soap Additives', sortOrder: 90 },
  ] as const;

  const groupByKey = new Map<string, { id: string }>();
  for (const g of groups) {
    const row = await prisma.ingredientGroup.upsert({
      where: { key: g.key },
      update: { label: g.label, sortOrder: g.sortOrder },
      create: { key: g.key, label: g.label, sortOrder: g.sortOrder },
      select: { id: true },
    });
    groupByKey.set(g.key, row);
  }

  const upsertIngredient = async (params: {
    slug: string;
    name: string;
    desc: string;
    color?: string | null;
    potency?: 'mild' | 'moderate' | 'strong' | null;
    maxPct?: number | null;
    warn?: boolean;
    benefits?: Record<string, number>;
    tips?: { low: string; mid: string; high: string };
    meta?: Record<string, unknown>;
    groupKeys: string[];
    productTypes: Array<'BALM' | 'CLEANER' | 'EXFOLIATOR' | 'SOAP' | 'TREATMENT_OIL'>;
  }) => {
    const ing = await prisma.ingredient.upsert({
      where: { slug: params.slug },
      update: {
        name: params.name,
        desc: params.desc,
        color: params.color ?? undefined,
        potency: params.potency ?? undefined,
        maxPct: params.maxPct ?? undefined,
        warn: params.warn ?? undefined,
        benefits: params.benefits ?? {},
        tips: params.tips ?? { low: '', mid: '', high: '' },
        meta: params.meta ?? {},
      },
      create: {
        slug: params.slug,
        name: params.name,
        desc: params.desc,
        color: params.color ?? undefined,
        potency: params.potency ?? undefined,
        maxPct: params.maxPct ?? undefined,
        warn: params.warn ?? false,
        benefits: params.benefits ?? {},
        tips: params.tips ?? { low: '', mid: '', high: '' },
        meta: params.meta ?? {},
      },
      select: { id: true, slug: true },
    });

    // Group assignments
    for (const groupKey of params.groupKeys) {
      const g = groupByKey.get(groupKey);
      if (!g) continue;
      await prisma.ingredientGroupAssignment.upsert({
        where: { ingredientId_groupId: { ingredientId: ing.id, groupId: g.id } },
        update: {},
        create: { ingredientId: ing.id, groupId: g.id },
      });
    }

    // Product assignments
    for (const productType of params.productTypes) {
      await prisma.ingredientProductAssignment.upsert({
        where: { ingredientId_productType: { ingredientId: ing.id, productType } },
        update: {},
        create: { ingredientId: ing.id, productType },
      });
    }
  };

  // Balm/Cleaner shared pools
  for (const i of CARRIERS_A) {
    await upsertIngredient({
      slug: i.id,
      name: i.name,
      desc: i.desc,
      potency: i.potency ?? null,
      benefits: i.benefits,
      tips: i.tips,
      groupKeys: ['carriers_a'],
      productTypes: ['BALM', 'CLEANER'],
    });
  }
  for (const i of ACTIVES_B) {
    await upsertIngredient({
      slug: i.id,
      name: i.name,
      desc: i.desc,
      potency: i.potency ?? null,
      benefits: i.benefits,
      tips: i.tips,
      groupKeys: ['actives_b'],
      productTypes: ['BALM', 'CLEANER'],
    });
  }
  for (const i of EXFOLIANTS_C) {
    await upsertIngredient({
      slug: i.id,
      name: i.name,
      desc: i.desc,
      potency: i.potency ?? null,
      benefits: i.benefits,
      tips: i.tips,
      groupKeys: ['exfoliants_c'],
      productTypes: ['CLEANER'],
    });
  }
  for (const i of ESSENTIAL_OILS) {
    await upsertIngredient({
      slug: i.id,
      name: i.name,
      desc: i.desc,
      potency: i.potency ?? null,
      benefits: i.benefits,
      tips: i.tips,
      groupKeys: ['essential_oils'],
      productTypes: ['BALM', 'CLEANER', 'SOAP'],
    });
  }

  // Exfoliator / Treatment oil pools (keep their separate ids)
  for (const i of OIL_CARRIERS) {
    await upsertIngredient({
      slug: i.id,
      name: i.name,
      desc: i.desc,
      color: i.color,
      maxPct: i.maxPct ?? null,
      warn: i.warn ?? false,
      benefits: i.benefits,
      tips: i.tips,
      groupKeys: ['oil_carriers'],
      productTypes: ['EXFOLIATOR', 'TREATMENT_OIL'],
    });
  }
  for (const i of OIL_ACTIVES) {
    await upsertIngredient({
      slug: i.id,
      name: i.name,
      desc: i.desc,
      color: i.color,
      maxPct: i.maxPct ?? null,
      warn: i.warn ?? false,
      benefits: i.benefits,
      tips: i.tips,
      groupKeys: ['oil_actives'],
      productTypes: ['EXFOLIATOR', 'TREATMENT_OIL'],
    });
  }
  for (const i of OIL_EOS) {
    await upsertIngredient({
      slug: i.id,
      name: i.name,
      desc: i.desc,
      color: i.color,
      maxPct: i.maxPct ?? null,
      warn: i.warn ?? false,
      benefits: i.benefits,
      tips: i.tips,
      groupKeys: ['oil_eos'],
      productTypes: ['EXFOLIATOR', 'TREATMENT_OIL'],
    });
  }

  // Soap oils (store SAP/indices in meta)
  for (const o of SOAP_OILS) {
    await upsertIngredient({
      slug: o.id,
      name: o.name,
      desc: o.desc,
      meta: {
        kind: 'soap_oil',
        sapNaOH: o.sapNaOH,
        sapKOH: o.sapKOH,
        hardness: o.hardness,
        cleansing: o.cleansing,
        conditioning: o.conditioning,
        bubbly: o.bubbly,
        creamy: o.creamy,
        iodine: o.iodine,
        defaultPct: o.defaultPct,
        category: o.category,
      },
      groupKeys: ['soap_oils'],
      productTypes: ['SOAP'],
    });
  }

  // Soap additives (store additive fields in meta)
  for (const a of SOAP_ADDITIVES) {
    await upsertIngredient({
      slug: a.id,
      name: a.name,
      desc: a.desc,
      meta: {
        kind: 'soap_additive',
        phase: a.phase,
        usageRate: a.usageRate,
        notes: a.notes,
      },
      groupKeys: ['soap_additives'],
      productTypes: ['SOAP'],
    });
  }

  console.log('✅ Ingredient library seeded.');

  console.log('');
  console.log('🎉 Seed complete!');
  console.log('');
  console.log('   Admin login:');
  console.log('   Email:    admin@crownbreeds.com');
  console.log('   Password: CrownBreeds2024!');
  console.log('');
  console.log('   ⚠️  Change this password immediately after first login.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
