import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringMenajeSchema } from '@/lib/validations/catering-menaje'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canViewModule('catering-menaje')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const item = await prisma.cateringMenaje.findUnique({
      where: { id },
      include: { supplier: { select: { id: true, name: true } } },
    })

    if (!item) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching catering menaje item:', error)
    return NextResponse.json({ error: 'Error al obtener item de menaje' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-menaje')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = cateringMenajeSchema.parse(body)

    const item = await prisma.cateringMenaje.update({
      where: { id },
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
      include: { supplier: { select: { id: true, name: true } } },
    })

    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error updating catering menaje item:', error)
    return NextResponse.json({ error: 'Error al actualizar item de menaje' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-menaje')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const item = await prisma.cateringMenaje.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
    }

    await prisma.cateringMenaje.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting catering menaje item:', error)
    return NextResponse.json({ error: 'Error al eliminar item de menaje' }, { status: 500 })
  }
}
