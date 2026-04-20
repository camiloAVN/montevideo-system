'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { CateringSupplierForm } from '@/components/forms/CateringSupplierForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringSupplierFormData } from '@/lib/validations/catering-supplier'
import { ArrowLeft, ShoppingBasket } from 'lucide-react'

export default function EditarProveedorCateringPage() {
  const router = useRouter()
  const params = useParams()
  const supplierId = params.id as string
  const { currentSupplier: supplier, isLoading, fetchSupplier, editSupplier } =
    useCateringSuppliers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (supplierId) fetchSupplier(supplierId)
  }, [supplierId, fetchSupplier])

  const handleSubmit = async (data: CateringSupplierFormData) => {
    setIsSubmitting(true)
    try {
      const result = await editSupplier(supplierId, data)
      if (result) {
        router.push(`/dashboard/catering/proveedores/${supplierId}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && !supplier) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Cargando proveedor...</p>
        </div>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="text-center py-12">
        <ShoppingBasket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Proveedor no encontrado</p>
        <Link href="/dashboard/catering/proveedores">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a proveedores
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/catering/proveedores/${supplierId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <ShoppingBasket className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Editar Proveedor</h1>
          <p className="text-gray-400 mt-1">Modificar &quot;{supplier.name}&quot;</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringSupplierForm
            supplier={supplier}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/dashboard/catering/proveedores/${supplierId}`)}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
