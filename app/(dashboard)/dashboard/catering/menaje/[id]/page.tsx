'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useCateringMenaje } from '@/hooks/useCateringMenaje'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Edit, UtensilsCrossed, Package, Hash } from 'lucide-react'

const formatCOP = (val: number | null | undefined) => {
  if (val === null || val === undefined) return '-'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-700/50 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-gray-200 text-right max-w-[60%]">{value}</span>
    </div>
  )
}

export default function MenajeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { currentItem, isLoading, fetchItem } = useCateringMenaje()

  useEffect(() => {
    if (id) fetchItem(id)
  }, [id, fetchItem])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentItem) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400">Item no encontrado</p>
        <Link href="/dashboard/catering/menaje">
          <Button variant="outline" className="mt-4">
            Volver al listado
          </Button>
        </Link>
      </div>
    )
  }

  const item = currentItem
  const baseCost =
    item.costMode === 'UNIT'
      ? (Number(item.unitCost) || 0) * (item.totalQuantity || 0)
      : Number(item.packageCost) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/catering/menaje">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <Link href={`/dashboard/catering/menaje/${item.id}/editar`}>
          <Button variant="primary" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <UtensilsCrossed className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{item.name}</h1>
          {item.category && <p className="text-gray-400 mt-1">{item.category}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h2 className="font-semibold text-gray-200">Información general</h2>
          </Card.Header>
          <Card.Content>
            <DetailRow label="Nombre" value={item.name} />
            {item.description && <DetailRow label="Descripción" value={item.description} />}
            <DetailRow
              label="Categoría"
              value={
                item.category ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
                    {item.category}
                  </span>
                ) : (
                  '-'
                )
              }
            />
            <DetailRow label="Proveedor" value={item.supplier?.name || '-'} />
            <DetailRow label="Cantidad total" value={item.totalQuantity} />
            <DetailRow
              label="Estado"
              value={
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isActive
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {item.isActive ? 'Activo' : 'Inactivo'}
                </span>
              }
            />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              {item.costMode === 'PACKAGE' ? (
                <Package className="w-4 h-4 text-blue-400" />
              ) : (
                <Hash className="w-4 h-4 text-gray-400" />
              )}
              <h2 className="font-semibold text-gray-200">Costos y precios</h2>
            </div>
          </Card.Header>
          <Card.Content>
            <DetailRow
              label="Modo de cobro"
              value={
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.costMode === 'PACKAGE'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {item.costMode === 'PACKAGE' ? 'Por paquete' : 'Por unidad'}
                </span>
              }
            />
            {item.costMode === 'UNIT' ? (
              <DetailRow label="Costo por unidad" value={formatCOP(item.unitCost)} />
            ) : (
              <DetailRow label="Costo por paquete" value={formatCOP(item.packageCost)} />
            )}
            <DetailRow label="Costo de reposición" value={formatCOP(item.replacementCost)} />
            <DetailRow label="Subtotal base" value={formatCOP(baseCost)} />
            <DetailRow
              label="Ganancia"
              value={
                item.markupAmount !== null ? (
                  <span>
                    {formatCOP(item.markupAmount)}
                    {item.markupPercent !== null && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({Number(item.markupPercent).toFixed(1)}%)
                      </span>
                    )}
                  </span>
                ) : (
                  '-'
                )
              }
            />
            <div className="mt-3 flex items-center justify-between rounded-lg bg-orange-500/5 border border-orange-500/20 px-4 py-3">
              <span className="text-sm font-medium text-gray-300">Total final</span>
              <span className="text-xl font-bold text-orange-400">{formatCOP(item.total)}</span>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
