'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringMenaje } from '@/hooks/useCateringMenaje'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { CateringMenajeForm } from '@/components/forms/CateringMenajeForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringMenajeFormData } from '@/lib/validations/catering-menaje'
import { ArrowLeft, UtensilsCrossed } from 'lucide-react'

export default function NuevoMenajePage() {
  const router = useRouter()
  const { createItem } = useCateringMenaje()
  const { suppliers, fetchSuppliers } = useCateringSuppliers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const handleSubmit = async (data: CateringMenajeFormData) => {
    setIsSubmitting(true)
    try {
      const item = await createItem(data)
      if (item) router.push('/dashboard/catering/menaje')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/catering/menaje">
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
          <h1 className="text-3xl font-bold">Nuevo Item de Menaje</h1>
          <p className="text-gray-400 mt-1">Agrega un nuevo item al catálogo de menaje</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringMenajeForm
            suppliers={suppliers}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/catering/menaje')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
