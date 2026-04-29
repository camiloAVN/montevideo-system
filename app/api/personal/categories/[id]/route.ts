import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { personalCategorySchema } from '@/lib/validations/personal'
import { canEditModule } from '@/lib/auth/check-permission'
import { ZodError } from 'zod'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const permissionCheck = await canEditModule('personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const body = await request.json()
    const data = personalCategorySchema.parse(body)

    const category = await prisma.personalCategory.update({
      where: { id },
      data: { name: data.name, isActive: data.isActive ?? true },
      include: { _count: { select: { staff: true } } },
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', issues: error.issues }, { status: 400 })
    }
    console.error('Error updating personal category:', error)
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const permissionCheck = await canEditModule('personal')
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: permissionCheck.error }, { status: permissionCheck.status })
    }

    const { id } = await params
    const count = await prisma.personal.count({ where: { categoryId: id } })
    if (count > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar: hay ${count} persona(s) con esta categoría` },
        { status: 409 }
      )
    }

    await prisma.personalCategory.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting personal category:', error)
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 })
  }
}
