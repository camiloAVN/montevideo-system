'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringMenuCustom } from '@/hooks/useCateringMenuCustom'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { CateringMenuCustomForm } from '@/components/forms/CateringMenuCustomForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringMenuCustomFormData } from '@/lib/validations/catering-menu-custom'
import { ArrowLeft, ChefHat } from 'lucide-react'

export default function NuevoMenuPersonalizadoPage() {
  const router = useRouter()
  const { createMenu } = useCateringMenuCustom()
  const { suppliers, fetchSuppliers } = useCateringSuppliers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => { fetchSuppliers() }, [fetchSuppliers])

  const handleSubmit = async (data: CateringMenuCustomFormData) => {
    setIsSubmitting(true)
    try {
      const menu = await createMenu(data)
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
          <ChefHat className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Menú Personalizado</h1>
          <p className="text-gray-400 mt-1">Crea un menú con precios manuales</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringMenuCustomForm
            suppliers={suppliers}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/catering/menus')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
