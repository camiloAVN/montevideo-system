'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringMenuItems } from '@/hooks/useCateringMenuItems'
import { useCateringMenaje } from '@/hooks/useCateringMenaje'
import { CateringMenuFromItemsForm } from '@/components/forms/CateringMenuFromItemsForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringMenuFromItemsFormData } from '@/lib/validations/catering-menu-items'
import { ArrowLeft, UtensilsCrossed } from 'lucide-react'

export default function EditarMenuItemsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { currentMenu, isLoading, fetchMenu, editMenu } = useCateringMenuItems()
  const { items: menajeItems, fetchItems } = useCateringMenaje()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) { fetchMenu(id); fetchItems() }
  }, [id, fetchMenu, fetchItems])

  const handleSubmit = async (
    data: CateringMenuFromItemsFormData,
    items: { menajeId: string; quantity: number }[]
  ) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      const updated = await editMenu(id, { ...data, items })
      if (updated) router.push('/dashboard/catering/menus')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && !currentMenu) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentMenu) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Menú no encontrado</p>
        <Link href="/dashboard/catering/menus">
          <Button variant="outline" className="mt-4">Volver a menús</Button>
        </Link>
      </div>
    )
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
          <h1 className="text-3xl font-bold">Editar Menú por Items</h1>
          <p className="text-gray-400 mt-1">Modificar &quot;{currentMenu.name}&quot;</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringMenuFromItemsForm
            menu={currentMenu}
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
