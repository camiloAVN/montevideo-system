'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useCateringItems } from '@/hooks/useCateringItems'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { CateringItemForm } from '@/components/forms/CateringItemForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringItemFormData } from '@/lib/validations/catering-item'
import { ArrowLeft, Layers } from 'lucide-react'

export default function EditarItemCateringPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string
  const { currentItem: item, isLoading, fetchItem, editItem } = useCateringItems()
  const { suppliers, fetchSuppliers } = useCateringSuppliers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (itemId) fetchItem(itemId)
    fetchSuppliers()
  }, [itemId, fetchItem, fetchSuppliers])

  const handleSubmit = async (data: CateringItemFormData) => {
    setIsSubmitting(true)
    try {
      const result = await editItem(itemId, data)
      if (result) router.push(`/dashboard/catering/items/${itemId}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && !item) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Cargando item...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Item no encontrado</p>
        <Link href="/dashboard/catering/items">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a items
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/catering/items/${itemId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <Layers className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Editar Item</h1>
          <p className="text-gray-400 mt-1">Modificar &quot;{item.name}&quot;</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringItemForm
            item={item}
            suppliers={suppliers}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/dashboard/catering/items/${itemId}`)}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
