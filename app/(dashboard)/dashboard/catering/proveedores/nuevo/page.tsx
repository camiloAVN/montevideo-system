'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { CateringSupplierForm } from '@/components/forms/CateringSupplierForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringSupplierFormData } from '@/lib/validations/catering-supplier'
import { ArrowLeft, ShoppingBasket } from 'lucide-react'

export default function NuevoProveedorCateringPage() {
  const router = useRouter()
  const { createSupplier } = useCateringSuppliers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CateringSupplierFormData) => {
    setIsSubmitting(true)
    try {
      const supplier = await createSupplier(data)
      if (supplier) {
        router.push('/dashboard/catering/proveedores')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/catering/proveedores">
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
          <h1 className="text-3xl font-bold">Nuevo Proveedor</h1>
          <p className="text-gray-400 mt-1">Agrega un nuevo proveedor de catering</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringSupplierForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/catering/proveedores')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
