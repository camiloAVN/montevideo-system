import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringSupplierSchema } from '@/lib/validations/catering-supplier'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

// GET /api/catering/suppliers/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canViewModule('catering-proveedores')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const supplier = await prisma.cateringSupplier.findUnique({ where: { id } })

    if (!supplier) {
      return NextResponse.json({ error: 'Proveedor no encontrado' }, { status: 404 })
    }

    return NextResponse.json(supplier)
  } catch (error) {
    console.error('Error fetching catering supplier:', error)
    return NextResponse.json({ error: 'Error al obtener proveedor' }, { status: 500 })
  }
}

// PUT /api/catering/suppliers/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-proveedores')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = cateringSupplierSchema.parse(body)

    const supplier = await prisma.cateringSupplier.update({
      where: { id },
      data: {
        name: validatedData.name,
        nit: validatedData.nit || null,
        contactName: validatedData.contactName || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
        city: validatedData.city || null,
        country: validatedData.country || null,
        website: validatedData.website || null,
        notes: validatedData.notes || null,
        isActive: validatedData.isActive ?? true,
      },
    })

    return NextResponse.json(supplier)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error updating catering supplier:', error)
    return NextResponse.json({ error: 'Error al actualizar proveedor' }, { status: 500 })
  }
}

// DELETE /api/catering/suppliers/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const permissionCheck = await canEditModule('catering-proveedores')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params

    const supplier = await prisma.cateringSupplier.findUnique({ where: { id } })
    if (!supplier) {
      return NextResponse.json({ error: 'Proveedor no encontrado' }, { status: 404 })
    }

    await prisma.cateringSupplier.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting catering supplier:', error)
    return NextResponse.json({ error: 'Error al eliminar proveedor' }, { status: 500 })
  }
}
