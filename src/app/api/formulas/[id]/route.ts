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

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await ctx.params;
  const row = await prisma.formula.findFirst({ where: { id, userId } });
  if (!row) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ...row, tags: parseTags(row.tags) });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await ctx.params;
  const existing = await prisma.formula.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  let body: {
    name?: string;
    batchSize?: number;
    mode?: string | null;
    ingredients?: Prisma.JsonValue;
    notes?: string | null;
    productType?: ProductType;
    tags?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const data: Prisma.FormulaUpdateInput = {};
  if (body.name != null) data.name = body.name.trim() || 'Untitled formula';
  if (body.batchSize != null) {
    const b = Number(body.batchSize);
    if (Number.isNaN(b) || b <= 0) {
      return NextResponse.json({ error: 'Invalid batch size' }, { status: 400 });
    }
    data.batchSize = b;
  }
  if (body.mode !== undefined) {
    data.mode = body.mode == null || body.mode === '' ? null : String(body.mode);
  }
  if (body.notes !== undefined) data.notes = body.notes?.trim() || null;
  if (body.ingredients !== undefined) data.ingredients = body.ingredients as Prisma.InputJsonValue;
  if (body.tags != null) {
    const tags = Array.isArray(body.tags) ? body.tags.map(t => String(t).trim()).filter(Boolean) : [];
    data.tags = tags as unknown as Prisma.InputJsonValue;
  }
  if (body.productType != null) {
    if (!TYPES.includes(body.productType)) {
      return NextResponse.json({ error: 'Invalid productType' }, { status: 400 });
    }
    data.productType = body.productType;
  }
  const updated = await prisma.formula.update({ where: { id }, data });
  return NextResponse.json({ ...updated, tags: parseTags(updated.tags) });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await ctx.params;
  const existing = await prisma.formula.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await prisma.formula.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
