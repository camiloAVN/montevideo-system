import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { personalStaffSchema } from '@/lib/validations/personal'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const permissionCheck = await canViewModule('personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''

    const staff = await prisma.personal.findMany({
      where: {
        AND: [
          search ? { name: { contains: search, mode: 'insensitive' } } : {},
          categoryId ? { categoryId } : {},
        ],
      },
      include: { category: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching personal staff:', error)
    return NextResponse.json({ error: 'Error al obtener personal' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const permissionCheck = await canEditModule('personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const body = await request.json()
    const data = personalStaffSchema.parse(body)

    const staff = await prisma.personal.create({
      data: {
        name: data.name,
        shiftRate: data.shiftRate ?? null,
        categoryId: data.categoryId || null,
        notes: data.notes || null,
        isActive: data.isActive ?? true,
      },
      include: { category: true },
    })

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error creating personal staff:', error)
    return NextResponse.json({ error: 'Error al crear personal' }, { status: 500 })
  }
}
