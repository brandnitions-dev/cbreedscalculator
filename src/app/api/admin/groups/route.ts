import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const groups = await prisma.ingredientGroup.findMany({
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
    select: { key: true, label: true, sortOrder: true },
  });
  return NextResponse.json({ groups });
}

