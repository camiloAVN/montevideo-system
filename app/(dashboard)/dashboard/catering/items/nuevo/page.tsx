'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringItems } from '@/hooks/useCateringItems'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { CateringItemForm } from '@/components/forms/CateringItemForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringItemFormData } from '@/lib/validations/catering-item'
import { ArrowLeft, Layers } from 'lucide-react'

export default function NuevoItemCateringPage() {
  const router = useRouter()
  const { createItem } = useCateringItems()
  const { suppliers, fetchSuppliers } = useCateringSuppliers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const handleSubmit = async (data: CateringItemFormData) => {
    setIsSubmitting(true)
    try {
      const item = await createItem(data)
      if (item) router.push('/dashboard/catering/items')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/catering/items">
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
          <h1 className="text-3xl font-bold">Nuevo Item</h1>
          <p className="text-gray-400 mt-1">Agrega un nuevo item al catálogo de catering</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringItemForm
            suppliers={suppliers}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/catering/items')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
