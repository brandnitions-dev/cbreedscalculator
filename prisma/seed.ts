import 'dotenv/config';
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CARRIERS_A } from '@/lib/ingredients/carriers-a';
import { ACTIVES_B } from '@/lib/ingredients/actives-b';
import { EXFOLIANTS_C } from '@/lib/ingredients/exfoliants-c';
import { ESSENTIAL_OILS } from '@/lib/ingredients/essential-oils';
import { SOAP_OILS } from '@/lib/ingredients/soap-oils';
import { SOAP_ADDITIVES } from '@/lib/ingredients/soap-additives';
import { OIL_CARRIERS, OIL_ACTIVES, OIL_EOS } from '@/lib/ingredients/treatment-oils';
import { getDefaultBalmDermalForSlug } from '@/lib/ingredients/balm-dermal-defaults';

const prisma = new PrismaClient();

const ACTIVE_INGREDIENT_SLUGS = new Set([
  // Base / fixed formula ingredients that are represented in the ingredient DB.
  'beef_tallow',
  'jojoba',
  'beeswax',
  'vitaminE',

  // Carrier oils A
  'rosehip',
  'grapeseed',
  'sesame',

  // Active oils B
  'blackseed',

  // Essential oils
  'sandalwood',
  'neroli',
  'oud',
  'peppermint',
  'rosemary',
  'vanilla_abs',

  // Cleaners
  'ground_ginger',
  'coffee_grounds',
  'charcoal',
  'sea_salt_cleaner',

  // Clinical actives - BHA oil only
  'willowbark',
  'bisabolol',
]);

function getDefaultUsageFocusForSlug(slug: string): 'universal' | 'face' | 'body' {
  if (
    [
      'rosehip',
      'grapeseed',
      'blackseed',
      'ground_ginger',
      'charcoal',
      'neroli',
      'rosemary',
      'willowbark',
      'bisabolol',
    ].includes(slug)
  ) {
    return 'face';
  }

  if (['coffee_grounds', 'sea_salt_cleaner', 'peppermint'].includes(slug)) {
    return 'body';
  }

  return 'universal';
}

async function main() {
  console.log('🌱 Seeding database...');

  // Seed admin user
  const passwordHash = await bcrypt.hash('MosskynLab2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mosskynlab.com' },
    update: {},
    create: {
      email: 'admin@mosskynlab.com',
      name: 'MOSSKYN LAB Admin',
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
    meta?: Prisma.InputJsonObject;
    groupKeys: string[];
    productTypes: Array<'BALM' | 'CLEANER' | 'EXFOLIATOR' | 'SOAP' | 'TREATMENT_OIL'>;
    balmDermalFocus?: 'universal' | 'dry' | 'oily';
    usageFocus?: 'universal' | 'face' | 'body';
  }) => {
    const dermal = params.balmDermalFocus ?? 'universal';
    const usageFocus = params.usageFocus ?? getDefaultUsageFocusForSlug(params.slug);
    const active = ACTIVE_INGREDIENT_SLUGS.has(params.slug);
    const ing = await prisma.ingredient.upsert({
      where: { slug: params.slug },
      update: {
        name: params.name,
        desc: params.desc,
        color: params.color ?? undefined,
        potency: params.potency ?? undefined,
        maxPct: params.maxPct ?? undefined,
        warn: params.warn ?? undefined,
        benefits: (params.benefits ?? {}) as Prisma.InputJsonValue,
        tips: (params.tips ?? { low: '', mid: '', high: '' }) as Prisma.InputJsonValue,
        meta: (params.meta ?? {}) as Prisma.InputJsonValue,
        active,
        balmDermalFocus: dermal,
        usageFocus,
      },
      create: {
        slug: params.slug,
        name: params.name,
        desc: params.desc,
        color: params.color ?? undefined,
        potency: params.potency ?? undefined,
        maxPct: params.maxPct ?? undefined,
        warn: params.warn ?? false,
        benefits: (params.benefits ?? {}) as Prisma.InputJsonValue,
        tips: (params.tips ?? { low: '', mid: '', high: '' }) as Prisma.InputJsonValue,
        meta: (params.meta ?? {}) as Prisma.InputJsonValue,
        active,
        balmDermalFocus: dermal,
        usageFocus,
      },
      select: { id: true, slug: true },
    });

    // Group assignments (seed is the source of truth for stock placement)
    const targetGroupIds = params.groupKeys
      .map(groupKey => groupByKey.get(groupKey)?.id)
      .filter((id): id is string => Boolean(id));
    await prisma.ingredientGroupAssignment.deleteMany({
      where: {
        ingredientId: ing.id,
        groupId: { notIn: targetGroupIds },
      },
    });
    await Promise.all(
      params.groupKeys
        .map((groupKey) => {
          const g = groupByKey.get(groupKey);
          if (!g) return null;
          return prisma.ingredientGroupAssignment.upsert({
            where: { ingredientId_groupId: { ingredientId: ing.id, groupId: g.id } },
            update: {},
            create: { ingredientId: ing.id, groupId: g.id },
          });
        })
        .filter(Boolean)
    );

    // Product assignments
    await prisma.ingredientProductAssignment.deleteMany({
      where: {
        ingredientId: ing.id,
        productType: { notIn: params.productTypes as never },
      },
    });
    await Promise.all(
      params.productTypes.map((productType) =>
        prisma.ingredientProductAssignment.upsert({
          where: { ingredientId_productType: { ingredientId: ing.id, productType } },
          update: {},
          create: { ingredientId: ing.id, productType },
        })
      )
    );
  };

  // Balm/Cleaner shared pools
  let n = 0;
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
      balmDermalFocus: getDefaultBalmDermalForSlug(i.id),
    });
    if (++n % 25 === 0) console.log(`  … ${n} items`);
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
      balmDermalFocus: getDefaultBalmDermalForSlug(i.id),
    });
    if (++n % 25 === 0) console.log(`  … ${n} items`);
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
    if (++n % 25 === 0) console.log(`  … ${n} items`);
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
      balmDermalFocus: getDefaultBalmDermalForSlug(i.id),
    });
    if (++n % 25 === 0) console.log(`  … ${n} items`);
  }

  // Exfoliator / Treatment oil pools (keep their separate ids)
  for (const i of OIL_CARRIERS) {
    const sharedSelectable = i.id === 'rosehip' || i.id === 'grapeseed';
    await upsertIngredient({
      slug: i.id,
      name: i.name,
      desc: i.desc,
      color: i.color,
      maxPct: i.maxPct ?? null,
      warn: i.warn ?? false,
      benefits: i.benefits,
      tips: i.tips,
      groupKeys: sharedSelectable ? ['oil_carriers', 'carriers_a'] : ['oil_carriers'],
      productTypes: sharedSelectable ? ['EXFOLIATOR', 'TREATMENT_OIL', 'BALM', 'CLEANER'] : ['EXFOLIATOR', 'TREATMENT_OIL'],
      balmDermalFocus: sharedSelectable ? getDefaultBalmDermalForSlug(i.id) : undefined,
    });
    if (++n % 25 === 0) console.log(`  … ${n} items`);
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
    if (++n % 25 === 0) console.log(`  … ${n} items`);
  }
  for (const i of OIL_EOS) {
    const sharedSelectable = i.id === 'rosemary';
    await upsertIngredient({
      slug: i.id,
      name: i.name,
      desc: i.desc,
      color: i.color,
      maxPct: i.maxPct ?? null,
      warn: i.warn ?? false,
      benefits: i.benefits,
      tips: i.tips,
      groupKeys: sharedSelectable ? ['oil_eos', 'essential_oils'] : ['oil_eos'],
      productTypes: sharedSelectable ? ['EXFOLIATOR', 'TREATMENT_OIL', 'BALM', 'CLEANER', 'SOAP'] : ['EXFOLIATOR', 'TREATMENT_OIL'],
      balmDermalFocus: sharedSelectable ? getDefaultBalmDermalForSlug(i.id) : undefined,
    });
    if (++n % 25 === 0) console.log(`  … ${n} items`);
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
    if (++n % 25 === 0) console.log(`  … ${n} items`);
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
    if (++n % 25 === 0) console.log(`  … ${n} items`);
  }

  console.log('✅ Ingredient library seeded.');

  console.log('');
  console.log('🎉 Seed complete!');
  console.log('');
  console.log('   Admin login:');
  console.log('   Email:    admin@mosskynlab.com');
  console.log('   Password: MosskynLab2024!');
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
