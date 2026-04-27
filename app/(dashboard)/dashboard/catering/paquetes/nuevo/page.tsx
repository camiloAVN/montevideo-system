'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringPackages } from '@/hooks/useCateringPackages'
import { CateringPackageForm } from '@/components/forms/CateringPackageForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringPackageFormData } from '@/lib/validations/catering-package'
import { ArrowLeft, Archive } from 'lucide-react'

export default function NuevoPaquetePage() {
  const router = useRouter()
  const { createPackage } = useCateringPackages()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CateringPackageFormData) => {
    setIsSubmitting(true)
    try {
      const pkg = await createPackage(data)
      if (pkg) router.push('/dashboard/catering/paquetes')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/catering/paquetes">
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
          <h1 className="text-3xl font-bold">Nuevo Paquete</h1>
          <p className="text-gray-400 mt-1">Crea un paquete de catering con items, menaje, menús y personal</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringPackageForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/catering/paquetes')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
