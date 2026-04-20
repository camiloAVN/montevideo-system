'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCateringItems } from '@/hooks/useCateringItems'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Plus, Search, Layers, Eye, Edit, Trash2 } from 'lucide-react'
import { CateringItem, CATERING_ITEM_CATEGORIES } from '@/lib/validations/catering-item'

const formatCOP = (val: number | null) => {
  if (val === null) return '-'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

function ItemsTable({ items, onDelete }: { items: CateringItem[]; onDelete: (id: string) => void }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No hay items registrados</p>
        <p className="text-sm text-gray-500 mt-2">Crea tu primer item de catering para comenzar</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Costo Unit.</th>
            <th>Ganancia</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div>
                  <span className="font-medium">{item.name}</span>
                  {item.description && (
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">{item.description}</p>
                  )}
                </div>
              </td>
              <td>
                {item.category ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
                    {item.category}
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
              <td className="text-gray-400">{item.supplier?.name || '-'}</td>
              <td className="text-gray-300 font-mono text-sm">{formatCOP(item.unitCost)}</td>
              <td className="text-gray-300 font-mono text-sm">
                {item.markupAmount !== null ? (
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
                )}
              </td>
              <td className="font-semibold text-orange-400 font-mono text-sm">
                {formatCOP(item.total)}
              </td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isActive
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {item.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/catering/items/${item.id}`}>
                    <Button variant="ghost" size="sm" title="Ver detalles">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/catering/items/${item.id}/editar`}>
                    <Button variant="ghost" size="sm" title="Editar">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas eliminar este item?')) {
                        onDelete(item.id)
                      }
                    }}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default function CateringItemsPage() {
  const { items, isLoading, searchQuery, setSearchQuery, fetchItems, deleteItem } = useCateringItems()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    fetchItems(searchQuery)
  }, [fetchItems, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(localSearch)
  }

  const filteredItems = categoryFilter
    ? items.filter((i) => i.category === categoryFilter)
    : items

  const handleDelete = async (id: string) => {
    const success = await deleteItem(id)
    if (success) fetchItems(searchQuery)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Layers className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Items</h1>
            <p className="text-gray-400 mt-1">Insumos, alimentos y bebidas para catering</p>
          </div>
        </div>
        <Link href="/dashboard/catering/items/nuevo">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Item
          </Button>
        </Link>
      </div>

      <Card>
        <Card.Header>
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre o descripción..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <Button type="submit" variant="outline">
                Buscar
              </Button>
            </form>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-300 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="">Todas las categorías</option>
              {CATERING_ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </Card.Header>
        <Card.Content>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Cargando items...</p>
            </div>
          ) : (
            <ItemsTable items={filteredItems} onDelete={handleDelete} />
          )}
        </Card.Content>
      </Card>
    </div>
  )
}
