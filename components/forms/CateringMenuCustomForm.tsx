'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  cateringMenuCustomSchema,
  CateringMenuCustomFormData,
  CateringMenuCustom,
  CATERING_MENU_TYPES,
} from '@/lib/validations/catering-menu-custom'
import { CateringSupplier } from '@/lib/validations/catering-supplier'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { UtensilsCrossed, Package } from 'lucide-react'

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

interface CateringMenuCustomFormProps {
  menu?: CateringMenuCustom | null
  suppliers: CateringSupplier[]
  onSubmit: (data: CateringMenuCustomFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function CateringMenuCustomForm({
  menu,
  suppliers,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CateringMenuCustomFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CateringMenuCustomFormData>({
    resolver: zodResolver(cateringMenuCustomSchema),
    defaultValues: menu
      ? {
          name: menu.name,
          menuType: menu.menuType || '',
          description: menu.description || '',
          supplierId: menu.supplierId || '',
          plateCount: menu.plateCount != null ? Number(menu.plateCount) : undefined,
          costMode: (menu.costMode as 'PER_PLATE' | 'PACKAGE') ?? 'PER_PLATE',
          plateCost: menu.plateCost != null ? Number(menu.plateCost) : undefined,
          packageCost: menu.packageCost != null ? Number(menu.packageCost) : undefined,
          markupPercent: menu.markupPercent != null ? Number(menu.markupPercent) : undefined,
          markupAmount: menu.markupAmount != null ? Number(menu.markupAmount) : undefined,
          total: menu.total != null ? Number(menu.total) : undefined,
          isActive: menu.isActive,
        }
      : { isActive: true, costMode: 'PER_PLATE' },
  })

  const costMode = watch('costMode')
  const plateCost = watch('plateCost')
  const packageCost = watch('packageCost')
  const plateCount = watch('plateCount')
  const markupPercent = watch('markupPercent')
  const markupAmount = watch('markupAmount')

  const baseCost =
    costMode === 'PER_PLATE'
      ? (Number(plateCost) || 0) * (Number(plateCount) || 0)
      : Number(packageCost) || 0

  const computedTotal = baseCost + (Number(markupAmount) || 0)

  useEffect(() => {
    setValue('total', computedTotal > 0 ? computedTotal : undefined)
  }, [computedTotal, setValue])

  const plateCostReg = register('plateCost', { valueAsNumber: true })
  const packageCostReg = register('packageCost', { valueAsNumber: true })
  const plateCountReg = register('plateCount', { valueAsNumber: true })
  const markupPercentReg = register('markupPercent', { valueAsNumber: true })
  const markupAmountReg = register('markupAmount', { valueAsNumber: true })

  const recomputeMarkup = (base: number, pct: number) => {
    if (pct > 0 && base > 0) {
      setValue('markupAmount', parseFloat(((base * pct) / 100).toFixed(2)))
    }
  }

  const handlePlateCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    plateCostReg.onChange(e)
    const cost = parseFloat(e.target.value) || 0
    const qty = Number(plateCount) || 0
    recomputeMarkup(cost * qty, Number(markupPercent) || 0)
  }

  const handlePackageCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    packageCostReg.onChange(e)
    const cost = parseFloat(e.target.value) || 0
    recomputeMarkup(cost, Number(markupPercent) || 0)
  }

  const handlePlateCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    plateCountReg.onChange(e)
    const qty = parseFloat(e.target.value) || 0
    const cost = Number(plateCost) || 0
    recomputeMarkup(cost * qty, Number(markupPercent) || 0)
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Nombre del menú *</label>
          <input
            {...register('name')}
            placeholder="Menú almuerzo ejecutivo..."
            className={cn(INPUT_CLASS, errors.name && 'border-red-500')}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className={LABEL_CLASS}>Tipo de menú</label>
          <select {...register('menuType')} className={cn(INPUT_CLASS, 'cursor-pointer')}>
            <option value="">Seleccionar tipo...</option>
            {CATERING_MENU_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Descripción del menú</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Describa qué incluye el menú: entradas, platos principales, postres, bebidas..."
            className={cn(INPUT_CLASS, 'resize-none')}
          />
        </div>

        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Proveedor (opcional)</label>
          <select {...register('supplierId')} className={cn(INPUT_CLASS, 'cursor-pointer')}>
            <option value="">Sin proveedor asignado</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>Cantidad de platos</label>
          <input
            type="number"
            min={1}
            step={1}
            placeholder="1"
            {...plateCountReg}
            onChange={handlePlateCountChange}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Cost mode toggle + pricing */}
      <div className="rounded-xl border border-gray-700/60 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-300">Modo de cobro</p>
          <Controller
            name="costMode"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-900/60 border border-gray-700">
                <button
                  type="button"
                  onClick={() => field.onChange('PER_PLATE')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    field.value === 'PER_PLATE'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-gray-400 hover:text-gray-200'
                  )}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  Costo por plato
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange('PACKAGE')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    field.value === 'PACKAGE'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-gray-400 hover:text-gray-200'
                  )}
                >
                  <Package className="w-3.5 h-3.5" />
                  Costo de platos
                </button>
              </div>
            )}
          />
        </div>

        <p className="text-xs text-gray-500">
          {costMode === 'PER_PLATE'
            ? 'El proveedor cobra por plato individual. El total base = costo por plato × cantidad de platos.'
            : 'El proveedor cobra un precio fijo por todos los platos. La cantidad es informativa.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {costMode === 'PER_PLATE' ? (
            <div>
              <label className={LABEL_CLASS}>Costo por plato</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0"
                  {...plateCostReg}
                  onChange={handlePlateCostChange}
                  className={cn(INPUT_CLASS, 'pl-6')}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className={LABEL_CLASS}>Costo de platos (total)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0"
                  {...packageCostReg}
                  onChange={handlePackageCostChange}
                  className={cn(INPUT_CLASS, 'pl-6')}
                />
              </div>
            </div>
          )}
        </div>

        {baseCost > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-gray-800/50 border border-gray-700/50 px-4 py-2.5">
            <span className="text-xs text-gray-400">
              {costMode === 'PER_PLATE'
                ? `Subtotal base (${Number(plateCost) > 0 ? formatCOP(Number(plateCost)) : '$0'} × ${Number(plateCount) || 0} platos)`
                : 'Subtotal base (costo fijo de platos)'}
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

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {menu ? 'Actualizar Menú' : 'Crear Menú'}
        </Button>
      </div>
    </form>
  )
}
