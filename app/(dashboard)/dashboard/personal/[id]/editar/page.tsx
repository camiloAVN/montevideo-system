'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePersonal } from '@/hooks/usePersonal'
import { PersonalStaffForm } from '@/components/forms/PersonalStaffForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Users } from 'lucide-react'

export default function EditarPersonalPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { currentStaff, isLoading, fetchStaffMember, editStaff } = usePersonal()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) fetchStaffMember(id)
  }, [id, fetchStaffMember])

  const handleSubmit = async (data: Parameters<typeof editStaff>[1]) => {
    setIsSubmitting(true)
    try {
      const updated = await editStaff(id, data)
      if (updated) router.push('/dashboard/personal')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentStaff) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Personal no encontrado</p>
        <Link href="/dashboard/personal">
          <Button variant="ghost" className="mt-4">Volver</Button>
        </Link>
      </div>
    )
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
          <h1 className="text-3xl font-bold">Editar Personal</h1>
          <p className="text-gray-400 mt-1">{currentStaff.name}</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <PersonalStaffForm
            initialData={{
              name: currentStaff.name,
              shiftRate: currentStaff.shiftRate != null ? Number(currentStaff.shiftRate) : null,
              categoryId: currentStaff.categoryId,
              notes: currentStaff.notes,
              isActive: currentStaff.isActive,
            }}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/personal')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
