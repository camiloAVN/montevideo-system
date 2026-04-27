import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { personalCategorySchema, DEFAULT_PERSONAL_CATEGORIES } from '@/lib/validations/personal'
import { canViewModule, canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

async function seedDefaultsIfEmpty() {
  const count = await prisma.personalCategory.count()
  if (count === 0) {
    await prisma.personalCategory.createMany({
      data: DEFAULT_PERSONAL_CATEGORIES.map(name => ({ name, isDefault: true })),
    })
  }
}

export async function GET() {
  try {
    const permissionCheck = await canViewModule('personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    await seedDefaultsIfEmpty()

    const categories = await prisma.personalCategory.findMany({
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      include: { _count: { select: { staff: true } } },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching personal categories:', error)
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const permissionCheck = await canEditModule('personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const body = await request.json()
    const data = personalCategorySchema.parse(body)

    const category = await prisma.personalCategory.create({
      data: { name: data.name, isActive: data.isActive ?? true },
      include: { _count: { select: { staff: true } } },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error creating personal category:', error)
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 })
  }
}
