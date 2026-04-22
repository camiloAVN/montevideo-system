import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringStaffCompanySchema } from '@/lib/validations/catering-staff-company'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

const staffInclude = {
  supplier: { select: { id: true, name: true } },
} as const

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canViewModule('catering-personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const staff = await prisma.cateringStaffCompany.findUnique({ where: { id }, include: staffInclude })

    if (!staff) return NextResponse.json({ error: 'Personal no encontrado' }, { status: 404 })
    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching company staff:', error)
    return NextResponse.json({ error: 'Error al obtener personal' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = cateringStaffCompanySchema.parse(body)

    const staff = await prisma.cateringStaffCompany.update({
      where: { id },
      data: {
        name: validatedData.name || null,
        supplierId: validatedData.supplierId || null,
        role: validatedData.role || null,
        staffCount: validatedData.staffCount ?? null,
        costMode: validatedData.costMode ?? 'PER_HOUR',
        costPerHour: validatedData.costPerHour ?? null,
        costPerShift: validatedData.costPerShift ?? null,
        markupPercent: validatedData.markupPercent ?? null,
        markupAmount: validatedData.markupAmount ?? null,
        total: validatedData.total ?? null,
        isActive: validatedData.isActive ?? true,
      },
      include: staffInclude,
    })

    return NextResponse.json(staff)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error updating company staff:', error)
    return NextResponse.json({ error: 'Error al actualizar personal' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const staff = await prisma.cateringStaffCompany.findUnique({ where: { id } })
    if (!staff) return NextResponse.json({ error: 'Personal no encontrado' }, { status: 404 })

    await prisma.cateringStaffCompany.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting company staff:', error)
    return NextResponse.json({ error: 'Error al eliminar personal' }, { status: 500 })
  }
}
