'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  cateringMenajeSchema,
  CateringMenajeFormData,
  CateringMenaje,
  CATERING_MENAJE_CATEGORIES,
} from '@/lib/validations/catering-menaje'
import { CateringSupplier } from '@/lib/validations/catering-supplier'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { Package, Hash } from 'lucide-react'

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-200 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600'

const LABEL_CLASS = 'block text-sm font-medium text-gray-300 mb-1.5'

interface CateringMenajeFormProps {
  item?: CateringMenaje | null
  suppliers: CateringSupplier[]
  onSubmit: (data: CateringMenajeFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

const formatCOP = (val: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)

export function CateringMenajeForm({
  item,
  suppliers,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CateringMenajeFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CateringMenajeFormData>({
    resolver: zodResolver(cateringMenajeSchema),
    defaultValues: item
      ? {
          name: item.name,
          description: item.description || '',
          category: item.category || '',
          supplierId: item.supplierId || '',
          totalQuantity: Number(item.totalQuantity) ?? 0,
          costMode: (item.costMode as 'UNIT' | 'PACKAGE') ?? 'UNIT',
          unitCost: item.unitCost != null ? Number(item.unitCost) : undefined,
          packageCost: item.packageCost != null ? Number(item.packageCost) : undefined,
          replacementCost: item.replacementCost != null ? Number(item.replacementCost) : undefined,
          markupPercent: item.markupPercent != null ? Number(item.markupPercent) : undefined,
          markupAmount: item.markupAmount != null ? Number(item.markupAmount) : undefined,
          total: item.total != null ? Number(item.total) : undefined,
          isActive: item.isActive,
        }
      : { isActive: true, costMode: 'UNIT', totalQuantity: 0 },
  })

  const costMode = watch('costMode')
  const unitCost = watch('unitCost')
  const packageCost = watch('packageCost')
  const totalQuantity = watch('totalQuantity')
  const replacementCost = watch('replacementCost')
  const markupPercent = watch('markupPercent')
  const markupAmount = watch('markupAmount')

  // Base cost before markup
  const baseCost =
    costMode === 'UNIT'
      ? (Number(unitCost) || 0) * (Number(totalQuantity) || 0)
      : Number(packageCost) || 0

  const withReplacement = baseCost + (Number(replacementCost) || 0)
  const computedTotal = withReplacement + (Number(markupAmount) || 0)

  // Sync total field
  useEffect(() => {
    setValue('total', computedTotal > 0 ? computedTotal : undefined)
  }, [computedTotal, setValue])

  // Markup handlers (bidirectional % <-> $)
  const unitCostReg = register('unitCost', { valueAsNumber: true })
  const packageCostReg = register('packageCost', { valueAsNumber: true })
  const totalQuantityReg = register('totalQuantity', { valueAsNumber: true })
  const replacementCostReg = register('replacementCost', { valueAsNumber: true })
  const markupPercentReg = register('markupPercent', { valueAsNumber: true })
  const markupAmountReg = register('markupAmount', { valueAsNumber: true })

  const recomputeMarkupAmount = (
    newBase: number,
    newReplacement: number,
    pct: number
  ) => {
    const base = newBase + newReplacement
    if (pct > 0 && base > 0) {
      setValue('markupAmount', parseFloat(((base * pct) / 100).toFixed(2)))
    }
  }

  const handleUnitCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    unitCostReg.onChange(e)
    const cost = parseFloat(e.target.value) || 0
    const qty = Number(totalQuantity) || 0
    const repl = Number(replacementCost) || 0
    const pct = Number(markupPercent) || 0
    recomputeMarkupAmount(cost * qty, repl, pct)
  }

  const handlePackageCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    packageCostReg.onChange(e)
    const cost = parseFloat(e.target.value) || 0
    const repl = Number(replacementCost) || 0
    const pct = Number(markupPercent) || 0
    recomputeMarkupAmount(cost, repl, pct)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    totalQuantityReg.onChange(e)
    const qty = parseFloat(e.target.value) || 0
    const cost = Number(unitCost) || 0
    const repl = Number(replacementCost) || 0
    const pct = Number(markupPercent) || 0
    recomputeMarkupAmount(cost * qty, repl, pct)
  }

  const handleReplacementCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    replacementCostReg.onChange(e)
    const repl = parseFloat(e.target.value) || 0
    const pct = Number(markupPercent) || 0
    recomputeMarkupAmount(baseCost, repl, pct)
  }

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markupPercentReg.onChange(e)
    const pct = parseFloat(e.target.value) || 0
    const repl = Number(replacementCost) || 0
    const base = baseCost + repl
    if (base > 0) {
      setValue('markupAmount', parseFloat(((base * pct) / 100).toFixed(2)))
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markupAmountReg.onChange(e)
    const amount = parseFloat(e.target.value) || 0
    const repl = Number(replacementCost) || 0
    const base = baseCost + repl
    if (base > 0) {
      setValue('markupPercent', parseFloat(((amount / base) * 100).toFixed(4)))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={LABEL_CLASS}>Nombre *</label>
          <input
            {...register('name')}
            placeholder="Copa de vino tinto"
            className={cn(INPUT_CLASS, errors.name && 'border-red-500')}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className={LABEL_CLASS}>Categoría</label>
          <select {...register('category')} className={cn(INPUT_CLASS, 'cursor-pointer')}>
            <option value="">Seleccionar categoría...</option>
            {CATERING_MENAJE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Descripción</label>
          <input
            {...register('description')}
            placeholder="Descripción del item..."
            className={INPUT_CLASS}
          />
        </div>

        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Proveedor</label>
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
          <label className={LABEL_CLASS}>Cantidad total</label>
          <input
            type="number"
            min={0}
            step={1}
            placeholder="0"
            {...totalQuantityReg}
            onChange={handleQuantityChange}
            className={cn(INPUT_CLASS, errors.totalQuantity && 'border-red-500')}
          />
          {errors.totalQuantity && (
            <p className="text-red-400 text-xs mt-1">{errors.totalQuantity.message}</p>
          )}
        </div>
      </div>

      {/* Cost mode toggle */}
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
                  onClick={() => field.onChange('UNIT')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    field.value === 'UNIT'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-gray-400 hover:text-gray-200'
                  )}
                >
                  <Hash className="w-3.5 h-3.5" />
                  Costo por unidad
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
                  Costo por paquete
                </button>
              </div>
            )}
          />
        </div>

        <p className="text-xs text-gray-500">
          {costMode === 'UNIT'
            ? 'El proveedor cobra por unidad. El total base se calcula multiplicando el costo unitario por la cantidad.'
            : 'El proveedor cobra un precio fijo por el paquete completo, independiente de la cantidad de items.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {costMode === 'UNIT' ? (
            <div>
              <label className={LABEL_CLASS}>Costo por unidad</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0"
                  {...unitCostReg}
                  onChange={handleUnitCostChange}
                  className={cn(INPUT_CLASS, 'pl-6')}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className={LABEL_CLASS}>Costo total por paquete</label>
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

          <div>
            <label className={LABEL_CLASS}>Costo de reposición</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                {...replacementCostReg}
                onChange={handleReplacementCostChange}
                className={cn(INPUT_CLASS, 'pl-6')}
              />
            </div>
          </div>
        </div>

        {/* Base cost display */}
        {baseCost > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-gray-800/50 border border-gray-700/50 px-4 py-2.5">
            <span className="text-xs text-gray-400">
              {costMode === 'UNIT'
                ? `Subtotal base (${Number(unitCost) > 0 ? formatCOP(Number(unitCost)) : '$0'} × ${Number(totalQuantity) || 0} uds)`
                : 'Subtotal base (paquete)'}
            </span>
            <span className="text-sm font-semibold text-gray-200">{formatCOP(baseCost)}</span>
          </div>
        )}

        {/* Ganancia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={LABEL_CLASS}>% Ganancia</label>
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
            {Number(markupAmount) > 0 && withReplacement > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                ≈ {Number(markupPercent).toFixed(2)}% del costo total
              </p>
            )}
          </div>
        </div>

        {/* Breakdown y total final */}
        {withReplacement > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-gray-700/50">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Costo base</span>
              <span>{formatCOP(baseCost)}</span>
            </div>
            {(Number(replacementCost) || 0) > 0 && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>Costo reposición</span>
                <span>+ {formatCOP(Number(replacementCost) || 0)}</span>
              </div>
            )}
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
          {item ? 'Actualizar Item' : 'Crear Item'}
        </Button>
      </div>
    </form>
  )
}
