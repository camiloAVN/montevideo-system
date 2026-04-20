'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cateringSupplierSchema, CateringSupplierFormData, CateringSupplier } from '@/lib/validations/catering-supplier'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface CateringSupplierFormProps {
  supplier?: CateringSupplier | null
  onSubmit: (data: CateringSupplierFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function CateringSupplierForm({
  supplier,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CateringSupplierFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CateringSupplierFormData>({
    resolver: zodResolver(cateringSupplierSchema),
    defaultValues: supplier
      ? {
          name: supplier.name,
          nit: supplier.nit || '',
          contactName: supplier.contactName || '',
          email: supplier.email || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
          city: supplier.city || '',
          country: supplier.country || '',
          website: supplier.website || '',
          notes: supplier.notes || '',
          isActive: supplier.isActive,
        }
      : { isActive: true },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre *"
          placeholder="Catering Express S.A.S"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="NIT / Documento"
          placeholder="900.123.456-7"
          error={errors.nit?.message}
          {...register('nit')}
        />

        <Input
          label="Persona de Contacto"
          placeholder="Juan García"
          error={errors.contactName?.message}
          {...register('contactName')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="contacto@catering.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Teléfono"
          placeholder="+57 300 123 4567"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Sitio Web"
          placeholder="https://catering.com"
          error={errors.website?.message}
          {...register('website')}
        />

        <Input
          label="Dirección"
          placeholder="Calle 100 #15-20"
          error={errors.address?.message}
          {...register('address')}
        />

        <Input
          label="Ciudad"
          placeholder="Bogotá"
          error={errors.city?.message}
          {...register('city')}
        />

        <Input
          label="País"
          placeholder="Colombia"
          error={errors.country?.message}
          {...register('country')}
        />
      </div>

      <Textarea
        label="Notas"
        placeholder="Información adicional sobre el proveedor..."
        rows={4}
        error={errors.notes?.message}
        {...register('notes')}
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {supplier ? 'Actualizar Proveedor' : 'Crear Proveedor'}
        </Button>
      </div>
    </form>
  )
}
