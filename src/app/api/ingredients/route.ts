import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Public ingredient feed for calculators.
 *
 * Query params:
 * - productType: BALM | CLEANER | EXFOLIATOR | SOAP | TREATMENT_OIL
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productType = searchParams.get('productType');
  if (!productType) {
    return NextResponse.json({ error: 'productType is required' }, { status: 400 });
  }

  const groups = await prisma.ingredientGroup.findMany({
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
            products: { some: { productType: productType as never } },
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
              benefits: true,
              tips: true,
              meta: true,
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

