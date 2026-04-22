'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringStaffFreelance } from '@/hooks/useCateringStaffFreelance'
import { CateringStaffFreelanceForm } from '@/components/forms/CateringStaffFreelanceForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringStaffFreelanceFormData } from '@/lib/validations/catering-staff-freelance'
import { ArrowLeft, UserCheck } from 'lucide-react'

export default function NuevoFreelancePage() {
  const router = useRouter()
  const { createStaff } = useCateringStaffFreelance()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CateringStaffFreelanceFormData) => {
    setIsSubmitting(true)
    try {
      const created = await createStaff(data)
      if (created) router.push('/dashboard/catering/personal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/catering/personal">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <UserCheck className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Personal Freelance</h1>
          <p className="text-gray-400 mt-1">Registra un colaborador freelance de catering</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringStaffFreelanceForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/catering/personal')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
