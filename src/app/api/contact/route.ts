import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { contactSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // Rate limiting: max 3 messages per email per hour
    const recentCount = await prisma.contactMessage.count({
      where: {
        email: data.email,
        createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60) },
      },
    });
    if (recentCount >= 3) {
      return NextResponse.json({ error: 'Too many messages' }, { status: 429 });
    }

    await prisma.contactMessage.create({ data });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
