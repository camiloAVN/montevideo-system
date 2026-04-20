import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { eventSchema } from '@/lib/validations/event'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await canViewModule('calendario')
  if (!check.hasPermission) {
    return NextResponse.json({ error: check.error }, { status: check.status ?? 403 })
  }

  const { id } = await params
  const event = await prisma.calendarEvent.findUnique({
    where: { id },
    include: { createdBy: { select: { id: true, name: true, email: true } } },
  })

  if (!event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
  }

  return NextResponse.json(event)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await canEditModule('calendario')
  if (!check.hasPermission) {
    return NextResponse.json({ error: check.error }, { status: check.status ?? 403 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { start, end, ...rest } = parsed.data

  const event = await prisma.calendarEvent.update({
    where: { id },
    data: {
      ...rest,
      start: new Date(start),
      end: end ? new Date(end) : null,
    },
    include: { createdBy: { select: { id: true, name: true, email: true } } },
  })

  return NextResponse.json(event)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await canEditModule('calendario')
  if (!check.hasPermission) {
    return NextResponse.json({ error: check.error }, { status: check.status ?? 403 })
  }

  const { id } = await params
  await prisma.calendarEvent.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
