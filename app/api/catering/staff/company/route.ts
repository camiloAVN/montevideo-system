import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringStaffCompanySchema } from '@/lib/validations/catering-staff-company'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

const staffInclude = {
  supplier: { select: { id: true, name: true } },
} as const

export async function GET() {
  try {
    const permissionCheck = await canViewModule('catering-personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const staff = await prisma.cateringStaffCompany.findMany({
      include: staffInclude,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching company staff:', error)
    return NextResponse.json({ error: 'Error al obtener personal por empresa' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const permissionCheck = await canEditModule('catering-personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const body = await request.json()
    const validatedData = cateringStaffCompanySchema.parse(body)

    const staff = await prisma.cateringStaffCompany.create({
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

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error creating company staff:', error)
    return NextResponse.json({ error: 'Error al crear personal por empresa' }, { status: 500 })
  }
}
