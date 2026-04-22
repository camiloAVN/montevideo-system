'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringStaffFreelance } from '@/hooks/useCateringStaffFreelance'
import { CateringStaffFreelanceForm } from '@/components/forms/CateringStaffFreelanceForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringStaffFreelanceFormData } from '@/lib/validations/catering-staff-freelance'
import { ArrowLeft, UserCheck } from 'lucide-react'

export default function EditarFreelancePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { currentStaff, isLoading, fetchStaffMember, editStaff } = useCateringStaffFreelance()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) fetchStaffMember(id)
  }, [id, fetchStaffMember])

  const handleSubmit = async (data: CateringStaffFreelanceFormData) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      const updated = await editStaff(id, data)
      if (updated) router.push('/dashboard/catering/personal')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && !currentStaff) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentStaff) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Personal no encontrado</p>
        <Link href="/dashboard/catering/personal">
          <Button variant="outline" className="mt-4">Volver</Button>
        </Link>
      </div>
    )
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
          <h1 className="text-3xl font-bold">Editar Personal Freelance</h1>
          <p className="text-gray-400 mt-1">Modificar &quot;{currentStaff.fullName}&quot;</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringStaffFreelanceForm
            staff={currentStaff}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/catering/personal')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
