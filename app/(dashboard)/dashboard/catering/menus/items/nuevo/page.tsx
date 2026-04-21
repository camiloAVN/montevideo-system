'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringMenuItems } from '@/hooks/useCateringMenuItems'
import { useCateringMenaje } from '@/hooks/useCateringMenaje'
import { CateringMenuFromItemsForm } from '@/components/forms/CateringMenuFromItemsForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringMenuFromItemsFormData } from '@/lib/validations/catering-menu-items'
import { ArrowLeft, UtensilsCrossed } from 'lucide-react'

export default function NuevoMenuItemsPage() {
  const router = useRouter()
  const { createMenu } = useCateringMenuItems()
  const { items: menajeItems, fetchItems } = useCateringMenaje()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleSubmit = async (
    data: CateringMenuFromItemsFormData,
    items: { menajeId: string; quantity: number }[]
  ) => {
    setIsSubmitting(true)
    try {
      const menu = await createMenu({ ...data, items })
      if (menu) router.push('/dashboard/catering/menus')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/catering/menus">
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
          <h1 className="text-3xl font-bold">Nuevo Menú por Items</h1>
          <p className="text-gray-400 mt-1">Arma un menú combinando items del catálogo de menaje</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringMenuFromItemsForm
            allMenajeItems={menajeItems}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/catering/menus')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
