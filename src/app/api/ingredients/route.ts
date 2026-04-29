import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const PUBLIC_GROUP_KEYS: Record<string, string[]> = {
  BALM: ['carriers_a', 'actives_b', 'essential_oils'],
  CLEANER: ['carriers_a', 'actives_b', 'exfoliants_c', 'essential_oils'],
  EXFOLIATOR: ['oil_carriers', 'oil_actives', 'oil_eos'],
  TREATMENT_OIL: ['oil_carriers', 'oil_actives', 'oil_eos'],
  SOAP: ['soap_oils', 'soap_additives', 'essential_oils'],
};

/**
 * Public ingredient feed for calculators.
 *
 * Query params:
 * - productType: BALM | CLEANER | EXFOLIATOR | SOAP | TREATMENT_OIL
 * - dermal: all | dry | oily — only for BALM: filter by balmDermalFocus
 * - usage: all | face | body | lips | eyes — filter by formula surface
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productType = searchParams.get('productType');
  if (!productType) {
    return NextResponse.json({ error: 'productType is required' }, { status: 400 });
  }
  const groupKeys = PUBLIC_GROUP_KEYS[productType];
  if (!groupKeys) {
    return NextResponse.json({ error: 'Invalid productType' }, { status: 400 });
  }
  const dermal = searchParams.get('dermal');
  const dermalMode =
    productType === 'BALM' && (dermal === 'dry' || dermal === 'oily') ? dermal : null;
  const usage = searchParams.get('usage');
  const usageMode =
    usage === 'face' || usage === 'body' || usage === 'lips' || usage === 'eyes' ? usage : null;

  const groups = await prisma.ingredientGroup.findMany({
    where: { key: { in: groupKeys } },
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
    select: {
      id: true,
      key: true,
      label: true,
      sortOrder: true,
      ingredients: {
        orderBy: [{ sortOrder: 'asc' }, { ingredient: { name: 'asc' } }],
        where: {
          ingredient: {
            active: true,
            products: { some: { productType: productType as never } },
            ...(usageMode
              ? { AND: [{ OR: [{ usageFocus: 'universal' }, { usageFocus: usageMode }] }] }
              : {}),
            ...(dermalMode
              ? { OR: [{ balmDermalFocus: 'universal' }, { balmDermalFocus: dermalMode }] }
              : {}),
          },
        },
        select: {
          sortOrder: true,
          ingredient: {
            select: {
              id: true,
              slug: true,
              name: true,
              desc: true,
              color: true,
              potency: true,
              maxPct: true,
              warn: true,
              active: true,
              benefits: true,
              tips: true,
              meta: true,
              balmDermalFocus: true,
              usageFocus: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({
    productType,
    groups: groups.map(g => ({
      key: g.key,
      label: g.label,
      sortOrder: g.sortOrder,
      ingredients: g.ingredients.map(ga => ({
        sortOrder: ga.sortOrder,
        ...ga.ingredient,
      })),
    })),
  });
}

