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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canViewModule('catering-paquetes')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const pkg = await prisma.cateringPackage.findUnique({
      where: { id },
      include: packageInclude,
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Paquete no encontrado' }, { status: 404 })
    }

    return NextResponse.json(pkg)
  } catch (error) {
    console.error('Error fetching catering package:', error)
    return NextResponse.json({ error: 'Error al obtener paquete' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-paquetes')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = cateringPackageSchema.parse(body)

    const pkg = await prisma.$transaction(async (tx) => {
      await tx.cateringPackage.update({
        where: { id },
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

      // Replace all junction records
      await tx.cateringPackageItem.deleteMany({ where: { packageId: id } })
      await tx.cateringPackageMenaje.deleteMany({ where: { packageId: id } })
      await tx.cateringPackageMenu.deleteMany({ where: { packageId: id } })
      await tx.cateringPackageStaff.deleteMany({ where: { packageId: id } })

      if (validatedData.items?.length) {
        await tx.cateringPackageItem.createMany({
          data: validatedData.items.map((i) => ({
            packageId: id,
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
            packageId: id,
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
            packageId: id,
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
            packageId: id,
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
        where: { id },
        include: packageInclude,
      })
    })

    return NextResponse.json(pkg)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error updating catering package:', error)
    return NextResponse.json({ error: 'Error al actualizar paquete' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-paquetes')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const pkg = await prisma.cateringPackage.findUnique({ where: { id } })
    if (!pkg) {
      return NextResponse.json({ error: 'Paquete no encontrado' }, { status: 404 })
    }

    await prisma.cateringPackage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting catering package:', error)
    return NextResponse.json({ error: 'Error al eliminar paquete' }, { status: 500 })
  }
}
