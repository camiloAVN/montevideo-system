'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCateringStaffCompany } from '@/hooks/useCateringStaffCompany'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { CateringStaffCompanyForm } from '@/components/forms/CateringStaffCompanyForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CateringStaffCompanyFormData } from '@/lib/validations/catering-staff-company'
import { ArrowLeft, Building2 } from 'lucide-react'

export default function NuevoEmpresaPage() {
  const router = useRouter()
  const { createStaff } = useCateringStaffCompany()
  const { suppliers, fetchSuppliers } = useCateringSuppliers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => { fetchSuppliers() }, [fetchSuppliers])

  const handleSubmit = async (data: CateringStaffCompanyFormData) => {
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
          <Building2 className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Personal por Empresa</h1>
          <p className="text-gray-400 mt-1">Vincula personal a través de un proveedor</p>
        </div>
      </div>

      <Card>
        <Card.Content className="pt-6">
          <CateringStaffCompanyForm
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
