import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') ?? '').trim();
  const productType = searchParams.get('productType') ?? '';
  const groupKey = searchParams.get('groupKey') ?? '';

  const ingredients = await prisma.ingredient.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { slug: { contains: q, mode: 'insensitive' } },
                { desc: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        productType ? { products: { some: { productType: productType as never } } } : {},
        groupKey ? { groups: { some: { group: { key: groupKey } } } } : {},
      ],
    },
    orderBy: [{ updatedAt: 'desc' }],
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
      groups: { select: { group: { select: { key: true, label: true } } } },
      products: { select: { productType: true } },
    },
  });

  return NextResponse.json({
    ingredients: ingredients.map(i => ({
      ...i,
      groupKeys: i.groups.map(g => g.group.key),
      productTypes: i.products.map(p => p.productType),
    })),
  });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as {
    slug: string;
    name: string;
    desc: string;
    color?: string | null;
    potency?: 'mild' | 'moderate' | 'strong' | null;
    maxPct?: number | null;
    warn?: boolean;
    active?: boolean;
    benefits?: Record<string, number>;
    tips?: { low: string; mid: string; high: string };
    meta?: Prisma.InputJsonObject;
    groupKeys?: string[];
    productTypes?: string[];
    balmDermalFocus?: 'universal' | 'dry' | 'oily';
    usageFocus?: 'universal' | 'face' | 'body' | 'lips' | 'eyes';
  };

  if (!body?.slug || !body?.name || !body?.desc) {
    return NextResponse.json({ error: 'slug, name, desc are required' }, { status: 400 });
  }

  const created = await prisma.ingredient.create({
    data: {
      slug: body.slug.trim(),
      name: body.name.trim(),
      desc: body.desc.trim(),
      color: body.color ?? undefined,
      potency: (body.potency ?? undefined) as never,
      maxPct: body.maxPct ?? undefined,
      warn: body.warn ?? false,
      active: body.active ?? false,
      benefits: (body.benefits ?? {}) as Prisma.InputJsonValue,
      tips: (body.tips ?? { low: '', mid: '', high: '' }) as Prisma.InputJsonValue,
      meta: (body.meta ?? {}) as Prisma.InputJsonValue,
      balmDermalFocus: (body.balmDermalFocus ?? 'universal') as 'universal' | 'dry' | 'oily',
      usageFocus: (body.usageFocus ?? 'universal') as 'universal' | 'face' | 'body' | 'lips' | 'eyes',
      groups: body.groupKeys?.length
        ? {
            create: body.groupKeys.map(k => ({
              group: { connect: { key: k } },
            })),
          }
        : undefined,
      products: body.productTypes?.length
        ? {
            create: body.productTypes.map(pt => ({
              productType: pt as never,
            })),
          }
        : undefined,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}

