import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringMenuCustomSchema } from '@/lib/validations/catering-menu-custom'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canViewModule('catering-menus')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const menu = await prisma.cateringMenuCustom.findUnique({
      where: { id },
      include: { supplier: { select: { id: true, name: true } } },
    })

    if (!menu) return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 })
    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error fetching custom menu:', error)
    return NextResponse.json({ error: 'Error al obtener menú' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-menus')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = cateringMenuCustomSchema.parse(body)

    const menu = await prisma.cateringMenuCustom.update({
      where: { id },
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

    return NextResponse.json(menu)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error updating custom menu:', error)
    return NextResponse.json({ error: 'Error al actualizar menú' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-menus')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const menu = await prisma.cateringMenuCustom.findUnique({ where: { id } })
    if (!menu) return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 })

    await prisma.cateringMenuCustom.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting custom menu:', error)
    return NextResponse.json({ error: 'Error al eliminar menú' }, { status: 500 })
  }
}
