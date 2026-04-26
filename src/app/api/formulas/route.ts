import { NextResponse } from 'next/server';
import type { ProductType } from '@prisma/client';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireUserId } from '@/lib/require-user';

const TYPES: ProductType[] = ['BALM', 'CLEANER', 'EXFOLIATOR', 'SOAP', 'TREATMENT_OIL'];

function parseTags(v: Prisma.JsonValue | null | undefined): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(x => String(x));
  return [];
}

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to view saved formulas.' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('productType') as ProductType | null;
  const where: Prisma.FormulaWhereInput = { userId };
  if (filter && TYPES.includes(filter)) {
    where.productType = filter;
  }
  const rows = await prisma.formula.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(
    rows.map(r => ({
      ...r,
      tags: parseTags(r.tags),
    })),
  );
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to save formulas.' }, { status: 401 });
  }
  let body: {
    name?: string;
    productType?: ProductType;
    batchSize?: number;
    mode?: string | null;
    ingredients?: Prisma.JsonValue;
    notes?: string | null;
    tags?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const name = (body.name ?? '').trim() || 'Untitled formula';
  const productType = body.productType;
  if (!productType || !TYPES.includes(productType)) {
    return NextResponse.json({ error: 'Invalid productType' }, { status: 400 });
  }
  if (body.ingredients === undefined) {
    return NextResponse.json({ error: 'Missing ingredients payload' }, { status: 400 });
  }
  const batchSize = Number(body.batchSize);
  if (Number.isNaN(batchSize) || batchSize <= 0) {
    return NextResponse.json({ error: 'Invalid batch size' }, { status: 400 });
  }
  const tags = Array.isArray(body.tags) ? body.tags.map(t => String(t).trim()).filter(Boolean) : [];
  const notes = body.notes?.trim() || null;
  const mode = body.mode == null || body.mode === '' ? null : String(body.mode);

  const created = await prisma.formula.create({
    data: {
      name,
      productType,
      userId,
      batchSize,
      mode,
      notes,
      ingredients: body.ingredients as Prisma.InputJsonValue,
      tags: tags as unknown as Prisma.InputJsonValue,
    },
  });
  return NextResponse.json({ ...created, tags });
}
