import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { cateringSupplierSchema } from '@/lib/validations/catering-supplier'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

// GET /api/catering/suppliers
export async function GET(request: NextRequest) {
  try {
    const permissionCheck = await canViewModule('catering-proveedores')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const suppliers = await prisma.cateringSupplier.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { contactName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { nit: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(suppliers)
  } catch (error) {
    console.error('Error fetching catering suppliers:', error)
    return NextResponse.json({ error: 'Error al obtener proveedores' }, { status: 500 })
  }
}

// POST /api/catering/suppliers
export async function POST(request: NextRequest) {
  try {
    const permissionCheck = await canEditModule('catering-proveedores')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const body = await request.json()
    const validatedData = cateringSupplierSchema.parse(body)

    const supplier = await prisma.cateringSupplier.create({
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

    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error creating catering supplier:', error)
    return NextResponse.json({ error: 'Error al crear proveedor' }, { status: 500 })
  }
}
