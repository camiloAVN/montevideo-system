'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringPackages } from '@/hooks/useCateringPackages'
import { CateringPackageForm, PackageFormInitialData } from '@/components/forms/CateringPackageForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringPackageFormData } from '@/lib/validations/catering-package'
import { ArrowLeft, Archive } from 'lucide-react'

export default function EditarPaquetePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { currentPackage, isLoading, fetchPackage, editPackage } = useCateringPackages()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) fetchPackage(id)
  }, [id, fetchPackage])

  const handleSubmit = async (data: CateringPackageFormData) => {
    setIsSubmitting(true)
    try {
      const updated = await editPackage(id, data)
      if (updated) router.push(`/dashboard/catering/paquetes/${id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentPackage) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Paquete no encontrado</p>
        <Link href="/dashboard/catering/paquetes">
          <Button variant="ghost" className="mt-4">Volver a paquetes</Button>
        </Link>
      </div>
    )
  }

  const pkg = currentPackage

  // Map DB rows to form initial data
  const initialData: PackageFormInitialData = {
    name: pkg.name,
    description: pkg.description,
    type: pkg.type,
    notes: pkg.notes,
    computedTotal: pkg.computedTotal,
    customTotal: pkg.customTotal,
    useCustomTotal: pkg.useCustomTotal,
    isActive: pkg.isActive,
    items: pkg.items.map(r => ({
      itemId: r.itemId,
      name: r.item.name,
      category: r.item.category,
      quantity: r.quantity,
      unitCost: Number(r.unitCost) || 0,
      subtotal: Number(r.subtotal) || 0,
    })),
    menaje: pkg.menaje.map(r => ({
      menajeId: r.menajeId,
      name: r.menaje.name,
      category: r.menaje.category,
      quantity: r.quantity,
      unitCost: Number(r.unitCost) || 0,
      subtotal: Number(r.subtotal) || 0,
      isFixed: true as const,
    })),
    menus: pkg.menus.map(r => ({
      menuType: r.menuType as 'CUSTOM' | 'FROM_ITEMS',
      menuId: r.menuId,
      menuName: r.menuName,
      quantity: r.quantity,
      unitCost: Number(r.unitCost) || 0,
      subtotal: Number(r.subtotal) || 0,
      isFixed: r.menuType === 'CUSTOM',
    })),
    staff: pkg.staff.map(r => ({
      staffType: r.staffType as 'FREELANCE' | 'COMPANY',
      staffId: r.staffId,
      staffName: r.staffName,
      quantity: r.quantity,
      unitCost: Number(r.unitCost) || 0,
      subtotal: Number(r.subtotal) || 0,
      isFixed: r.staffType === 'COMPANY',
    })),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/catering/paquetes/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <Archive className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Editar Paquete</h1>
          <p className="text-gray-400 mt-1">{pkg.name}</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringPackageForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/dashboard/catering/paquetes/${id}`)}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
