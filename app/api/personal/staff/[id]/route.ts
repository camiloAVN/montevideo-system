import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { personalStaffSchema } from '@/lib/validations/personal'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const permissionCheck = await canViewModule('personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const staff = await prisma.personal.findUnique({
      where: { id: params.id },
      include: { category: true },
    })

    if (!staff) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching personal staff member:', error)
    return NextResponse.json({ error: 'Error al obtener personal' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const permissionCheck = await canEditModule('personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const body = await request.json()
    const data = personalStaffSchema.parse(body)

    const staff = await prisma.personal.update({
      where: { id: params.id },
      data: {
        name: data.name,
        shiftRate: data.shiftRate ?? null,
        categoryId: data.categoryId || null,
        notes: data.notes || null,
        isActive: data.isActive ?? true,
      },
      include: { category: true },
    })

    return NextResponse.json(staff)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error updating personal staff member:', error)
    return NextResponse.json({ error: 'Error al actualizar personal' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const permissionCheck = await canEditModule('personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    await prisma.personal.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting personal staff member:', error)
    return NextResponse.json({ error: 'Error al eliminar personal' }, { status: 500 })
  }
}
