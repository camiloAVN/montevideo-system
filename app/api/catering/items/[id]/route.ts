import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringItemSchema } from '@/lib/validations/catering-item'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

// GET /api/catering/items/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canViewModule('catering-items')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const item = await prisma.cateringItem.findUnique({
      where: { id },
      include: { supplier: { select: { id: true, name: true } } },
    })

    if (!item) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching catering item:', error)
    return NextResponse.json({ error: 'Error al obtener item' }, { status: 500 })
  }
}

// PUT /api/catering/items/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-items')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = cateringItemSchema.parse(body)

    const item = await prisma.cateringItem.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        category: validatedData.category || null,
        supplierId: validatedData.supplierId || null,
        unitCost: validatedData.unitCost ?? null,
        markupPercent: validatedData.markupPercent ?? null,
        markupAmount: validatedData.markupAmount ?? null,
        total: validatedData.total ?? null,
        notes: validatedData.notes || null,
        isActive: validatedData.isActive ?? true,
      },
      include: { supplier: { select: { id: true, name: true } } },
    })

    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error updating catering item:', error)
    return NextResponse.json({ error: 'Error al actualizar item' }, { status: 500 })
  }
}

// DELETE /api/catering/items/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-items')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const item = await prisma.cateringItem.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
    }

    await prisma.cateringItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting catering item:', error)
    return NextResponse.json({ error: 'Error al eliminar item' }, { status: 500 })
  }
}
