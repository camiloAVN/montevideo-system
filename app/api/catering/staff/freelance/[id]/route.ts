import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringStaffFreelanceSchema } from '@/lib/validations/catering-staff-freelance'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

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
    const staff = await prisma.cateringStaffFreelance.findUnique({ where: { id } })

    if (!staff) return NextResponse.json({ error: 'Personal no encontrado' }, { status: 404 })
    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching freelance staff:', error)
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
    const validatedData = cateringStaffFreelanceSchema.parse(body)

    const staff = await prisma.cateringStaffFreelance.update({
      where: { id },
      data: {
        fullName: validatedData.fullName,
        documentNumber: validatedData.documentNumber || null,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        city: validatedData.city || null,
        role: validatedData.role || null,
        ratePerShift: validatedData.ratePerShift ?? null,
        ratePerHour: validatedData.ratePerHour ?? null,
        nightSurchargePercent: validatedData.nightSurchargePercent ?? null,
        travelAllowance: validatedData.travelAllowance ?? null,
        hasSocialSecurity: validatedData.hasSocialSecurity ?? false,
        hasFoodHandlingCert: validatedData.hasFoodHandlingCert ?? false,
        isActive: validatedData.isActive ?? true,
      },
    })

    return NextResponse.json(staff)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error updating freelance staff:', error)
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
    const staff = await prisma.cateringStaffFreelance.findUnique({ where: { id } })
    if (!staff) return NextResponse.json({ error: 'Personal no encontrado' }, { status: 404 })

    await prisma.cateringStaffFreelance.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting freelance staff:', error)
    return NextResponse.json({ error: 'Error al eliminar personal' }, { status: 500 })
  }
}
