import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { portfolioItemSchema } from '@/lib/validations';
import type { Category } from '@prisma/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') as Category | null;
  const all = searchParams.get('all') === '1';

  // Admin can request all items (published + unpublished)
  const session = all ? await getSession() : null;
  const isAdmin = !!session;

  try {
    const items = await prisma.portfolioItem.findMany({
      where: {
        ...(isAdmin ? {} : { published: true }),
        ...(category ? { category } : {}),
      },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = portfolioItemSchema.parse(body);
    const item = await prisma.portfolioItem.create({ data: data as any });
    return NextResponse.json(item, { status: 201 });
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', issues: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
