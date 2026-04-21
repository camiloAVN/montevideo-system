import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringMenajeSchema } from '@/lib/validations/catering-menaje'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const permissionCheck = await canViewModule('catering-menaje')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    const items = await prisma.cateringMenaje.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          category ? { category } : {},
        ],
      },
      include: {
        supplier: { select: { id: true, name: true } },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching catering menaje:', error)
    return NextResponse.json({ error: 'Error al obtener items de menaje' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const permissionCheck = await canEditModule('catering-menaje')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const body = await request.json()
    const validatedData = cateringMenajeSchema.parse(body)

    const item = await prisma.cateringMenaje.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        category: validatedData.category || null,
        supplierId: validatedData.supplierId || null,
        totalQuantity: validatedData.totalQuantity ?? 0,
        costMode: validatedData.costMode ?? 'UNIT',
        unitCost: validatedData.unitCost ?? null,
        packageCost: validatedData.packageCost ?? null,
        replacementCost: validatedData.replacementCost ?? null,
        markupPercent: validatedData.markupPercent ?? null,
        markupAmount: validatedData.markupAmount ?? null,
        total: validatedData.total ?? null,
        isActive: validatedData.isActive ?? true,
      },
      include: {
        supplier: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error creating catering menaje:', error)
    return NextResponse.json({ error: 'Error al crear item de menaje' }, { status: 500 })
  }
}
