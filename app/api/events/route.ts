import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { eventSchema } from '@/lib/validations/event'

export async function GET() {
  const check = await canViewModule('calendario')
  if (!check.hasPermission) {
    return NextResponse.json({ error: check.error }, { status: check.status ?? 403 })
  }

  const events = await prisma.calendarEvent.findMany({
    orderBy: { start: 'asc' },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  })

  return NextResponse.json(events)
}

export async function POST(request: NextRequest) {
  const check = await canEditModule('calendario')
  if (!check.hasPermission) {
    return NextResponse.json({ error: check.error }, { status: check.status ?? 403 })
  }

  const body = await request.json()
  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { start, end, ...rest } = parsed.data

  const event = await prisma.calendarEvent.create({
    data: {
      ...rest,
      start: new Date(start),
      end: end ? new Date(end) : null,
      createdById: check.userId,
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  })

  return NextResponse.json(event, { status: 201 })
}
