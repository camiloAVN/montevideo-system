'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePersonal } from '@/hooks/usePersonal'
import { PersonalStaffForm } from '@/components/forms/PersonalStaffForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Users } from 'lucide-react'

export default function NuevoPersonalPage() {
  const router = useRouter()
  const { createStaff } = usePersonal()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: Parameters<typeof createStaff>[0]) => {
    setIsSubmitting(true)
    try {
      const created = await createStaff(data)
      if (created) router.push('/dashboard/personal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/personal">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-teal-500/10">
          <Users className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Personal</h1>
          <p className="text-gray-400 mt-1">Registrar una persona en el sistema</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <PersonalStaffForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/personal')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
