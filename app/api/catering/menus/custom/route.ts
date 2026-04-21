import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringMenuCustomSchema } from '@/lib/validations/catering-menu-custom'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const permissionCheck = await canViewModule('catering-menus')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const menus = await prisma.cateringMenuCustom.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      include: { supplier: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(menus)
  } catch (error) {
    console.error('Error fetching custom menus:', error)
    return NextResponse.json({ error: 'Error al obtener menús' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const permissionCheck = await canEditModule('catering-menus')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const body = await request.json()
    const validatedData = cateringMenuCustomSchema.parse(body)

    const menu = await prisma.cateringMenuCustom.create({
      data: {
        name: validatedData.name,
        menuType: validatedData.menuType || null,
        description: validatedData.description || null,
        supplierId: validatedData.supplierId || null,
        plateCount: validatedData.plateCount ?? null,
        costMode: validatedData.costMode ?? 'PER_PLATE',
        plateCost: validatedData.plateCost ?? null,
        packageCost: validatedData.packageCost ?? null,
        markupPercent: validatedData.markupPercent ?? null,
        markupAmount: validatedData.markupAmount ?? null,
        total: validatedData.total ?? null,
        isActive: validatedData.isActive ?? true,
      },
      include: { supplier: { select: { id: true, name: true } } },
    })

    return NextResponse.json(menu, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error creating custom menu:', error)
    return NextResponse.json({ error: 'Error al crear menú' }, { status: 500 })
  }
}
