import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringPackageSchema } from '@/lib/validations/catering-package'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

const packageInclude = {
  items: { include: { item: { select: { id: true, name: true, category: true, total: true } } } },
  menaje: { include: { menaje: { select: { id: true, name: true, category: true, total: true } } } },
  menus: true,
  staff: true,
}

export async function GET(request: NextRequest) {
  try {
    const permissionCheck = await canViewModule('catering-paquetes')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const packages = await prisma.cateringPackage.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      include: packageInclude,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(packages)
  } catch (error) {
    console.error('Error fetching catering packages:', error)
    return NextResponse.json({ error: 'Error al obtener paquetes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const permissionCheck = await canEditModule('catering-paquetes')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const body = await request.json()
    const validatedData = cateringPackageSchema.parse(body)

    const pkg = await prisma.$transaction(async (tx) => {
      const created = await tx.cateringPackage.create({
        data: {
          name: validatedData.name,
          description: validatedData.description || null,
          type: validatedData.type || null,
          notes: validatedData.notes || null,
          computedTotal: validatedData.computedTotal ?? null,
          customTotal: validatedData.customTotal ?? null,
          useCustomTotal: validatedData.useCustomTotal ?? false,
          isActive: validatedData.isActive ?? true,
        },
      })

      if (validatedData.items?.length) {
        await tx.cateringPackageItem.createMany({
          data: validatedData.items.map((i) => ({
            packageId: created.id,
            itemId: i.itemId,
            quantity: i.quantity,
            unitCost: i.unitCost ?? null,
            subtotal: i.subtotal ?? null,
          })),
        })
      }

      if (validatedData.menaje?.length) {
        await tx.cateringPackageMenaje.createMany({
          data: validatedData.menaje.map((m) => ({
            packageId: created.id,
            menajeId: m.menajeId,
            quantity: m.quantity,
            unitCost: m.unitCost ?? null,
            subtotal: m.subtotal ?? null,
          })),
        })
      }

      if (validatedData.menus?.length) {
        await tx.cateringPackageMenu.createMany({
          data: validatedData.menus.map((m) => ({
            packageId: created.id,
            menuType: m.menuType,
            menuId: m.menuId,
            menuName: m.menuName,
            quantity: m.quantity,
            unitCost: m.unitCost ?? null,
            subtotal: m.subtotal ?? null,
          })),
        })
      }

      if (validatedData.staff?.length) {
        await tx.cateringPackageStaff.createMany({
          data: validatedData.staff.map((s) => ({
            packageId: created.id,
            staffType: s.staffType,
            staffId: s.staffId,
            staffName: s.staffName,
            quantity: s.quantity,
            unitCost: s.unitCost ?? null,
            subtotal: s.subtotal ?? null,
          })),
        })
      }

      return tx.cateringPackage.findUnique({
        where: { id: created.id },
        include: packageInclude,
      })
    })

    return NextResponse.json(pkg, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error creating catering package:', error)
    return NextResponse.json({ error: 'Error al crear paquete' }, { status: 500 })
  }
}
