import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringMenuFromItemsSchema } from '@/lib/validations/catering-menu-items'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

const menuInclude = {
  menuItems: {
    include: {
      item: {
        select: { id: true, name: true, category: true, total: true, unitCost: true },
      },
    },
    orderBy: { item: { name: 'asc' } },
  },
} as const

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
    const menu = await prisma.cateringMenuFromItems.findUnique({ where: { id }, include: menuInclude })

    if (!menu) return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 })
    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error fetching menu:', error)
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
    const validatedData = cateringMenuFromItemsSchema.parse(body)

    // Replace all item relations
    await prisma.cateringMenuFromItemsRelation.deleteMany({ where: { menuId: id } })

    const menu = await prisma.cateringMenuFromItems.update({
      where: { id },
      data: {
        name: validatedData.name,
        menuType: validatedData.menuType || null,
        description: validatedData.description || null,
        computedTotal: validatedData.customTotal ?? null,
        customTotal: validatedData.customTotal ?? null,
        useCustomTotal: validatedData.useCustomTotal ?? false,
        menuItems: validatedData.items?.length
          ? {
              create: validatedData.items.map((i) => ({
                itemId: i.itemId,
                quantity: i.quantity,
              })),
            }
          : undefined,
      },
      include: menuInclude,
    })

    return NextResponse.json(menu)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error updating menu:', error)
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
    const menu = await prisma.cateringMenuFromItems.findUnique({ where: { id } })
    if (!menu) return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 })

    await prisma.cateringMenuFromItems.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting menu:', error)
    return NextResponse.json({ error: 'Error al eliminar menú' }, { status: 500 })
  }
}
