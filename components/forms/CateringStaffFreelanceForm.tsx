'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  cateringStaffFreelanceSchema,
  CateringStaffFreelanceFormData,
  CateringStaffFreelance,
  CATERING_STAFF_ROLES,
} from '@/lib/validations/catering-staff-freelance'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { FileText, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-200 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600'
const LABEL_CLASS = 'block text-sm font-medium text-gray-300 mb-1.5'

interface CateringStaffFreelanceFormProps {
  staff?: CateringStaffFreelance | null
  onSubmit: (data: CateringStaffFreelanceFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function CateringStaffFreelanceForm({
  staff,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CateringStaffFreelanceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CateringStaffFreelanceFormData>({
    resolver: zodResolver(cateringStaffFreelanceSchema),
    defaultValues: staff
      ? {
          fullName: staff.fullName,
          documentNumber: staff.documentNumber || '',
          phone: staff.phone || '',
          email: staff.email || '',
          city: staff.city || '',
          role: staff.role || '',
          ratePerShift: staff.ratePerShift != null ? Number(staff.ratePerShift) : undefined,
          ratePerHour: staff.ratePerHour != null ? Number(staff.ratePerHour) : undefined,
          nightSurchargePercent: staff.nightSurchargePercent != null ? Number(staff.nightSurchargePercent) : undefined,
          travelAllowance: staff.travelAllowance != null ? Number(staff.travelAllowance) : undefined,
          hasSocialSecurity: staff.hasSocialSecurity,
          hasFoodHandlingCert: staff.hasFoodHandlingCert,
          isActive: staff.isActive,
        }
      : {
          hasSocialSecurity: false,
          hasFoodHandlingCert: false,
          isActive: true,
        },
  })

  const handleComingSoon = () => {
    toast('Función próximamente disponible', { icon: '🚧' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Nombre completo *</label>
          <input
            {...register('fullName')}
            placeholder="Juan Carlos Pérez..."
            className={cn(INPUT_CLASS, errors.fullName && 'border-red-500')}
          />
          {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className={LABEL_CLASS}>Documento</label>
          <input
            {...register('documentNumber')}
            placeholder="CC / NIT / Pasaporte..."
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Teléfono</label>
          <input
            {...register('phone')}
            placeholder="+57 300 000 0000"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Correo electrónico</label>
          <input
            {...register('email')}
            type="email"
            placeholder="correo@ejemplo.com"
            className={cn(INPUT_CLASS, errors.email && 'border-red-500')}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className={LABEL_CLASS}>Ciudad</label>
          <input
            {...register('city')}
            placeholder="Bogotá, Medellín..."
            className={INPUT_CLASS}
          />
        </div>

        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Tipo de rol</label>
          <select {...register('role')} className={cn(INPUT_CLASS, 'cursor-pointer')}>
            <option value="">Seleccionar rol...</option>
            {CATERING_STAFF_ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rates */}
      <div className="rounded-xl border border-gray-700/60 p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-300">Tarifas</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={LABEL_CLASS}>Tarifa por jornada</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                {...register('ratePerShift', { valueAsNumber: true })}
                className={cn(INPUT_CLASS, 'pl-6')}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Tarifa por hora</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                {...register('ratePerHour', { valueAsNumber: true })}
                className={cn(INPUT_CLASS, 'pl-6')}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Recargo nocturno</label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                step="any"
                placeholder="0"
                {...register('nightSurchargePercent', { valueAsNumber: true })}
                className={cn(INPUT_CLASS, 'pr-8')}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Viáticos / Transporte</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                {...register('travelAllowance', { valueAsNumber: true })}
                className={cn(INPUT_CLASS, 'pl-6')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & docs */}
      <div className="rounded-xl border border-gray-700/60 p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-300">Documentos y certificaciones</p>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register('hasSocialSecurity')}
              className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
            />
            <div>
              <span className="text-sm text-gray-200 font-medium">Seguridad social</span>
              <p className="text-xs text-gray-500">Cuenta con ARL (Administradora de Riesgos Laborales)</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register('hasFoodHandlingCert')}
              className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
            />
            <div>
              <span className="text-sm text-gray-200 font-medium">Certificado de manipulación de alimentos</span>
              <p className="text-xs text-gray-500">Certificación vigente en higiene y manipulación</p>
            </div>
          </label>
        </div>

        <div className="pt-2 border-t border-gray-700/40">
          <p className="text-xs text-gray-500 mb-3">Documentos adjuntos</p>
          <button
            type="button"
            onClick={handleComingSoon}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            <Upload className="w-4 h-4" />
            Adjuntar RUT
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('isActive')}
            className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
          />
          <span className="text-sm text-gray-300">Personal activo</span>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <button
          type="button"
          onClick={handleComingSoon}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          <FileText className="w-4 h-4" />
          Generar contrato PDF
        </button>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {staff ? 'Actualizar personal' : 'Crear personal'}
          </Button>
        </div>
      </div>
    </form>
  )
}
