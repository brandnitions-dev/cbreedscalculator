import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { Prisma } from '@prisma/client';

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  const body = (await req.json()) as {
    slug?: string;
    name?: string;
    desc?: string;
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

  const updated = await prisma.ingredient.update({
    where: { id },
    data: {
      slug: body.slug?.trim(),
      name: body.name?.trim(),
      desc: body.desc?.trim(),
      color: body.color ?? undefined,
      potency: (body.potency ?? undefined) as never,
      maxPct: body.maxPct ?? undefined,
      warn: body.warn ?? undefined,
      active: body.active ?? undefined,
      benefits: (body.benefits ?? undefined) as Prisma.InputJsonValue | undefined,
      tips: (body.tips ?? undefined) as Prisma.InputJsonValue | undefined,
      meta: (body.meta ?? undefined) as Prisma.InputJsonValue | undefined,
      balmDermalFocus: body.balmDermalFocus ?? undefined,
      usageFocus: body.usageFocus ?? undefined,
      groups: body.groupKeys
        ? {
            deleteMany: {},
            create: body.groupKeys.map(k => ({ group: { connect: { key: k } } })),
          }
        : undefined,
      products: body.productTypes
        ? {
            deleteMany: {},
            create: body.productTypes.map(pt => ({ productType: pt as never })),
          }
        : undefined,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: updated.id });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.ingredient.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

