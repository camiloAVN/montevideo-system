'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringStaffCompany } from '@/hooks/useCateringStaffCompany'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { CateringStaffCompanyForm } from '@/components/forms/CateringStaffCompanyForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringStaffCompanyFormData } from '@/lib/validations/catering-staff-company'
import { ArrowLeft, Building2 } from 'lucide-react'

export default function EditarEmpresaPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { currentStaff, isLoading, fetchStaffMember, editStaff } = useCateringStaffCompany()
  const { suppliers, fetchSuppliers } = useCateringSuppliers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) fetchStaffMember(id)
    fetchSuppliers()
  }, [id, fetchStaffMember, fetchSuppliers])

  const handleSubmit = async (data: CateringStaffCompanyFormData) => {
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
          <Building2 className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Editar Personal por Empresa</h1>
          <p className="text-gray-400 mt-1">
            Modificar &quot;{currentStaff.name || currentStaff.supplier?.name || 'registro'}&quot;
          </p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringStaffCompanyForm
            staff={currentStaff}
            suppliers={suppliers}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/catering/personal')}
            isSubmitting={isSubmitting}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
