'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useCateringItems } from '@/hooks/useCateringItems'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  ArrowLeft, Edit, Layers, Tag, ShoppingBasket,
  DollarSign, TrendingUp, FileText, Calendar,
} from 'lucide-react'

const formatCOP = (val: number | null) => {
  if (val === null) return '-'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

export default function ItemCateringDetailPage() {
  const params = useParams()
  const { currentItem: item, isLoading, fetchItem } = useCateringItems()
  const itemId = params.id as string

  useEffect(() => {
    if (itemId) fetchItem(itemId)
  }, [itemId, fetchItem])

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
    })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Cargando item...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Item no encontrado</p>
        <Link href="/dashboard/catering/items">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a items
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/catering/items">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Layers className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{item.name}</h1>
              {item.category && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
                  {item.category}
                </span>
              )}
            </div>
          </div>
        </div>
        <Link href={`/dashboard/catering/items/${item.id}/editar`}>
          <Button variant="primary">
            <Edit className="w-4 h-4 mr-2" />
            Editar Item
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info general */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold">Información General</h2>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-gray-400">Descripción</label>
                  <p className="mt-1">{item.description || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Proveedor</label>
                  <div className="mt-1 flex items-center gap-2">
                    {item.supplier ? (
                      <>
                        <ShoppingBasket className="w-4 h-4 text-orange-400" />
                        <Link
                          href={`/dashboard/catering/proveedores/${item.supplier.id}`}
                          className="text-orange-400 hover:text-orange-300"
                        >
                          {item.supplier.name}
                        </Link>
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Pricing */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold">Precios y Márgenes</h2>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="rounded-lg bg-gray-900/40 border border-gray-700/50 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Costo unitario</p>
                  <p className="text-xl font-bold text-gray-200">{formatCOP(item.unitCost)}</p>
                </div>
                <div className="rounded-lg bg-gray-900/40 border border-gray-700/50 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Ganancia</p>
                  <p className="text-xl font-bold text-green-400">{formatCOP(item.markupAmount)}</p>
                  {item.markupPercent !== null && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {Number(item.markupPercent).toFixed(2)}%
                    </p>
                  )}
                </div>
                <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-4 text-center">
                  <p className="text-xs text-orange-400/70 mb-1">Total</p>
                  <p className="text-xl font-bold text-orange-400">{formatCOP(item.total)}</p>
                </div>
              </div>

              {item.unitCost !== null && item.markupPercent !== null && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span>
                    Margen del <span className="text-green-400 font-medium">{Number(item.markupPercent).toFixed(2)}%</span>
                    {' '}sobre el costo
                  </span>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {item.notes && (
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-400" />
                  <h2 className="text-lg font-semibold">Notas</h2>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-300 whitespace-pre-wrap text-sm">{item.notes}</p>
              </Card.Content>
            </Card>
          )}

          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold">Detalles</h2>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado</span>
                  <span className={item.isActive ? 'text-green-400 font-medium' : 'text-gray-400'}>
                    {item.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Categoría</span>
                  <span>{item.category || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Creado</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Actualizado</span>
                  <span>{formatDate(item.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ID</span>
                  <span className="font-mono text-xs text-gray-500">{item.id}</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}
