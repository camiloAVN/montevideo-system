'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringMenaje } from '@/hooks/useCateringMenaje'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { CateringMenajeForm } from '@/components/forms/CateringMenajeForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringMenajeFormData } from '@/lib/validations/catering-menaje'
import { ArrowLeft, UtensilsCrossed } from 'lucide-react'

export default function EditarMenajePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { currentItem, isLoading, fetchItem, editItem } = useCateringMenaje()
  const { suppliers, fetchSuppliers } = useCateringSuppliers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchItem(id)
      fetchSuppliers()
    }
  }, [id, fetchItem, fetchSuppliers])

  const handleSubmit = async (data: CateringMenajeFormData) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      const updated = await editItem(id, data)
      if (updated) router.push(`/dashboard/catering/menaje/${id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && !currentItem) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Cargando item...</p>
        </div>
      </div>
    )
  }

  if (!currentItem) {
    return (
      <div className="text-center py-12">
        <UtensilsCrossed className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Item no encontrado</p>
        <Link href="/dashboard/catering/menaje">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a menaje
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/catering/menaje/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <UtensilsCrossed className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Editar Item de Menaje</h1>
          <p className="text-gray-400 mt-1">Modificar &quot;{currentItem.name}&quot;</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringMenajeForm
            item={currentItem}
            suppliers={suppliers}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/dashboard/catering/menaje/${id}`)}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
