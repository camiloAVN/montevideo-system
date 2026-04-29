'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { conceptSchema, ConceptFormData, Concept, conceptCategories } from '@/lib/validations/concept'
import { Supplier } from '@/lib/validations/supplier'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'

interface ConceptFormProps {
  initialData?: Concept
  onSubmit: (data: ConceptFormData) => Promise<void>
  isLoading?: boolean
}

function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function ConceptForm({ initialData, onSubmit, isLoading }: ConceptFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)

  const initBase = Number(initialData?.unitPrice || 0)
  const initMarkup = Number(initialData?.markupPercentage || 0)

  const [markupPct, setMarkupPct] = useState<number>(initMarkup)
  const [finalPrice, setFinalPrice] = useState<number>(Math.round(initBase * (1 + initMarkup / 100)))

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConceptFormData>({
    resolver: zodResolver(conceptSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      supplierId: initialData?.supplierId || '',
      unitPrice: initBase || undefined,
      markupPercentage: initMarkup,
      category: initialData?.category || '',
      notes: initialData?.notes || '',
      isActive: initialData?.isActive ?? true,
    },
  })

  const watchedUnitPrice = watch('unitPrice')
  const basePrice = Number(watchedUnitPrice) || 0

  // When base price changes externally, recompute final price
  useEffect(() => {
    setFinalPrice(Math.round(basePrice * (1 + markupPct / 100)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePrice])

  const handleMarkupPctChange = (value: number) => {
    const pct = Math.max(0, value)
    setMarkupPct(pct)
    setValue('markupPercentage', pct)
    setFinalPrice(Math.round(basePrice * (1 + pct / 100)))
  }

  const handleFinalPriceChange = (value: number) => {
    const fp = Math.max(0, value)
    setFinalPrice(fp)
    if (basePrice > 0) {
      const newPct = parseFloat((((fp - basePrice) / basePrice) * 100).toFixed(2))
      const pct = Math.max(0, newPct)
      setMarkupPct(pct)
      setValue('markupPercentage', pct)
    }
  }

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/suppliers')
        if (response.ok) {
          const data = await response.json()
          setSuppliers(data)
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error)
      } finally {
        setLoadingSuppliers(false)
      }
    }
    fetchSuppliers()
  }, [])

  const supplierOptions = [
    { value: '', label: 'Sin contratista asignado' },
    ...suppliers.map((s) => ({
      value: s.id,
      label: s.name + (s.contactName ? ` (${s.contactName})` : ''),
    })),
  ]

  const categoryOptions = [
    { value: '', label: 'Selecciona una categoria' },
    ...conceptCategories,
  ]

  const markupAmount = basePrice > 0 ? finalPrice - basePrice : 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title>Informacion del Concepto</Card.Title>
          <Card.Description>
            Define el servicio o concepto que ofrece el contratista
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Nombre del Concepto *"
                placeholder="Ej: Show de luces LED, Servicio de catering, DJ"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Descripcion"
                placeholder="Describe el servicio o concepto..."
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>

            <Select
              label="Categoria"
              options={categoryOptions}
              error={errors.category?.message}
              {...register('category')}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">
                Precio base (costo contratista)
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                error={errors.unitPrice?.message}
                {...register('unitPrice', { valueAsNumber: true })}
              />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Pricing / Markup card */}
      <Card>
        <Card.Header>
          <Card.Title>Ganancia</Card.Title>
          <Card.Description>
            Define la ganancia sobre el precio base. Edita el porcentaje o el precio final — se calculan mutuamente.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          {/* hidden registered field so the value is submitted */}
          <input type="hidden" {...register('markupPercentage', { valueAsNumber: true })} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* % Ganancia */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">
                % Ganancia
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={markupPct}
                  onChange={(e) => handleMarkupPctChange(Number(e.target.value) || 0)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
              </div>
              {basePrice > 0 && markupPct > 0 && (
                <p className="text-xs text-gray-500">
                  Ganancia: {formatCOP(markupAmount)}
                </p>
              )}
            </div>

            {/* Arrow divider */}
            <div className="hidden md:flex items-center justify-center pt-6">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="h-px w-8 bg-gray-700" />
                <span className="text-xs">↔</span>
                <div className="h-px w-8 bg-gray-700" />
              </div>
            </div>

            {/* Precio final */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">
                Precio final (cliente)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={finalPrice}
                onChange={(e) => handleFinalPriceChange(Number(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              />
              {basePrice > 0 && (
                <p className="text-xs text-emerald-500 font-medium">
                  {formatCOP(finalPrice)}
                </p>
              )}
            </div>
          </div>

          {/* Summary row */}
          {basePrice > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700 grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Precio base</p>
                <p className="text-gray-300 font-medium">{formatCOP(basePrice)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Ganancia ({markupPct}%)</p>
                <p className="text-emerald-400 font-medium">+{formatCOP(markupAmount)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Precio final</p>
                <p className="text-white font-bold">{formatCOP(finalPrice)}</p>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Contratista Asociado</Card.Title>
          <Card.Description>
            Opcionalmente, asocia este concepto a un contratista especifico
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 gap-6">
            {loadingSuppliers ? (
              <div className="text-center py-4">
                <div className="inline-block w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 mt-2 text-sm">Cargando contratistas...</p>
              </div>
            ) : (
              <Select
                label="Contratista"
                options={supplierOptions}
                error={errors.supplierId?.message}
                {...register('supplierId')}
              />
            )}

            <Textarea
              label="Notas Adicionales"
              placeholder="Notas sobre el servicio, requerimientos especiales, etc..."
              rows={3}
              error={errors.notes?.message}
              {...register('notes')}
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-pink-600 focus:ring-pink-600"
                {...register('isActive')}
              />
              <label htmlFor="isActive" className="text-sm text-gray-300">
                Concepto activo (disponible para usar en cotizaciones)
              </label>
            </div>
          </div>
        </Card.Content>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Guardar Cambios' : 'Crear Concepto'}
        </Button>
      </div>
    </form>
  )
}
