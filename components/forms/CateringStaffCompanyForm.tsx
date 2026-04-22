'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  cateringStaffCompanySchema,
  CateringStaffCompanyFormData,
  CateringStaffCompany,
  CATERING_STAFF_ROLES,
} from '@/lib/validations/catering-staff-company'
import { CateringSupplier } from '@/lib/validations/catering-supplier'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { Clock, Calendar, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-200 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600'
const LABEL_CLASS = 'block text-sm font-medium text-gray-300 mb-1.5'

const formatCOP = (val: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)

interface CateringStaffCompanyFormProps {
  staff?: CateringStaffCompany | null
  suppliers: CateringSupplier[]
  onSubmit: (data: CateringStaffCompanyFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function CateringStaffCompanyForm({
  staff,
  suppliers,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CateringStaffCompanyFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CateringStaffCompanyFormData>({
    resolver: zodResolver(cateringStaffCompanySchema),
    defaultValues: staff
      ? {
          name: staff.name || '',
          supplierId: staff.supplierId || '',
          role: staff.role || '',
          staffCount: staff.staffCount != null ? Number(staff.staffCount) : undefined,
          costMode: (staff.costMode as 'PER_HOUR' | 'PER_SHIFT') ?? 'PER_HOUR',
          costPerHour: staff.costPerHour != null ? Number(staff.costPerHour) : undefined,
          costPerShift: staff.costPerShift != null ? Number(staff.costPerShift) : undefined,
          markupPercent: staff.markupPercent != null ? Number(staff.markupPercent) : undefined,
          markupAmount: staff.markupAmount != null ? Number(staff.markupAmount) : undefined,
          total: staff.total != null ? Number(staff.total) : undefined,
          isActive: staff.isActive,
        }
      : { isActive: true, costMode: 'PER_HOUR' },
  })

  const costMode = watch('costMode')
  const staffCount = watch('staffCount')
  const costPerHour = watch('costPerHour')
  const costPerShift = watch('costPerShift')
  const markupPercent = watch('markupPercent')
  const markupAmount = watch('markupAmount')

  const activeCost = costMode === 'PER_HOUR' ? Number(costPerHour) || 0 : Number(costPerShift) || 0
  const baseCost = activeCost * (Number(staffCount) || 0)
  const computedTotal = baseCost + (Number(markupAmount) || 0)

  useEffect(() => {
    setValue('total', computedTotal > 0 ? computedTotal : undefined)
  }, [computedTotal, setValue])

  const costPerHourReg = register('costPerHour', { valueAsNumber: true })
  const costPerShiftReg = register('costPerShift', { valueAsNumber: true })
  const markupPercentReg = register('markupPercent', { valueAsNumber: true })
  const markupAmountReg = register('markupAmount', { valueAsNumber: true })

  const handleCostChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    reg: ReturnType<typeof register>
  ) => {
    reg.onChange(e)
    const cost = parseFloat(e.target.value) || 0
    const qty = Number(staffCount) || 0
    const base = cost * qty
    const pct = Number(markupPercent) || 0
    if (pct > 0 && base > 0) {
      setValue('markupAmount', parseFloat(((base * pct) / 100).toFixed(2)))
    }
  }

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markupPercentReg.onChange(e)
    const pct = parseFloat(e.target.value) || 0
    if (baseCost > 0) {
      setValue('markupAmount', parseFloat(((baseCost * pct) / 100).toFixed(2)))
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markupAmountReg.onChange(e)
    const amount = parseFloat(e.target.value) || 0
    if (baseCost > 0) {
      setValue('markupPercent', parseFloat(((amount / baseCost) * 100).toFixed(4)))
    }
  }

  const handleComingSoon = () => {
    toast('Función próximamente disponible', { icon: '🚧' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Referencia / descripción</label>
          <input
            {...register('name')}
            placeholder="Meseros para evento corporativo, Bartenders feria..."
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Proveedor / empresa *</label>
          <select {...register('supplierId')} className={cn(INPUT_CLASS, 'cursor-pointer')}>
            <option value="">Seleccionar proveedor...</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>Tipo de rol</label>
          <select {...register('role')} className={cn(INPUT_CLASS, 'cursor-pointer')}>
            <option value="">Seleccionar rol...</option>
            {CATERING_STAFF_ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>Cantidad de personal</label>
          <input
            type="number"
            min={1}
            step={1}
            placeholder="1"
            {...register('staffCount', { valueAsNumber: true })}
            className={INPUT_CLASS}
          />
          {errors.staffCount && <p className="text-red-400 text-xs mt-1">{errors.staffCount.message}</p>}
        </div>
      </div>

      {/* Cost mode + pricing */}
      <div className="rounded-xl border border-gray-700/60 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-300">Modo de costo</p>
          <Controller
            name="costMode"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-900/60 border border-gray-700">
                <button
                  type="button"
                  onClick={() => field.onChange('PER_HOUR')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    field.value === 'PER_HOUR'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-gray-400 hover:text-gray-200'
                  )}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Por hora
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange('PER_SHIFT')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    field.value === 'PER_SHIFT'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-gray-400 hover:text-gray-200'
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Por turno
                </button>
              </div>
            )}
          />
        </div>

        <div>
          {costMode === 'PER_HOUR' ? (
            <div>
              <label className={LABEL_CLASS}>Costo por hora (por persona)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0"
                  {...costPerHourReg}
                  onChange={(e) => handleCostChange(e, costPerHourReg)}
                  className={cn(INPUT_CLASS, 'pl-6')}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className={LABEL_CLASS}>Costo por turno (por persona)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0"
                  {...costPerShiftReg}
                  onChange={(e) => handleCostChange(e, costPerShiftReg)}
                  className={cn(INPUT_CLASS, 'pl-6')}
                />
              </div>
            </div>
          )}
        </div>

        {baseCost > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-gray-800/50 border border-gray-700/50 px-4 py-2.5">
            <span className="text-xs text-gray-400">
              Subtotal base ({formatCOP(activeCost)} × {Number(staffCount) || 0} personas)
            </span>
            <span className="text-sm font-semibold text-gray-200">{formatCOP(baseCost)}</span>
          </div>
        )}

        {/* Markup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={LABEL_CLASS}>% Margen de ganancia</label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                {...markupPercentReg}
                onChange={handlePercentChange}
                className={cn(INPUT_CLASS, 'pr-8')}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Valor ganancia</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                {...markupAmountReg}
                onChange={handleAmountChange}
                className={cn(INPUT_CLASS, 'pl-6')}
              />
            </div>
            {Number(markupAmount) > 0 && baseCost > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                ≈ {Number(markupPercent).toFixed(2)}% del costo base
              </p>
            )}
          </div>
        </div>

        {baseCost > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-gray-700/50">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Costo base</span>
              <span>{formatCOP(baseCost)}</span>
            </div>
            {(Number(markupAmount) || 0) > 0 && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>Ganancia ({Number(markupPercent).toFixed(1)}%)</span>
                <span>+ {formatCOP(Number(markupAmount) || 0)}</span>
              </div>
            )}
            <div className="flex items-center justify-between rounded-lg bg-orange-500/5 border border-orange-500/20 px-4 py-3 mt-2">
              <span className="text-sm font-medium text-gray-300">Total final</span>
              <span className="text-lg font-bold text-orange-400">
                {computedTotal > 0 ? formatCOP(computedTotal) : '—'}
              </span>
            </div>
          </div>
        )}
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
            {staff ? 'Actualizar personal' : 'Registrar personal'}
          </Button>
        </div>
      </div>
    </form>
  )
}
