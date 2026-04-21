import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringMenuFromItemsSchema } from '@/lib/validations/catering-menu-items'
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

    const menus = await prisma.cateringMenuFromItems.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      include: {
        menuItems: {
          include: {
            menaje: {
              select: { id: true, name: true, category: true, total: true, costMode: true, totalQuantity: true },
            },
          },
          orderBy: { menaje: { name: 'asc' } },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(menus)
  } catch (error) {
    console.error('Error fetching menus from items:', error)
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
    const validatedData = cateringMenuFromItemsSchema.parse(body)

    const menu = await prisma.cateringMenuFromItems.create({
      data: {
        name: validatedData.name,
        menuType: validatedData.menuType || null,
        description: validatedData.description || null,
        computedTotal: validatedData.customTotal ?? null,
        customTotal: validatedData.customTotal ?? null,
        useCustomTotal: validatedData.useCustomTotal ?? false,
        menuItems: validatedData.items?.length
          ? {
              create: validatedData.items.map((item) => ({
                menajeId: item.menajeId,
                quantity: item.quantity,
              })),
            }
          : undefined,
      },
      include: {
        menuItems: {
          include: {
            menaje: {
              select: { id: true, name: true, category: true, total: true, costMode: true, totalQuantity: true },
            },
          },
        },
      },
    })

    return NextResponse.json(menu, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error creating menu from items:', error)
    return NextResponse.json({ error: 'Error al crear menú' }, { status: 500 })
  }
}
