'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCateringPackages } from '@/hooks/useCateringPackages'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Archive, Plus, Search, Eye, Edit, Trash2, Calculator, Tag } from 'lucide-react'
import { CateringPackage, PACKAGE_TYPES } from '@/lib/validations/catering-package'

const formatCOP = (val: number | null | undefined) => {
  if (val === null || val === undefined) return '-'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val)
}

function PackagesTable({ packages, onDelete }: { packages: CateringPackage[]; onDelete: (id: string) => void }) {
  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <Archive className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No hay paquetes registrados</p>
        <p className="text-sm text-gray-500 mt-2">Crea tu primer paquete de catering para comenzar</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
            <th className="text-left px-4 py-3">Paquete</th>
            <th className="text-left px-4 py-3">Tipo</th>
            <th className="text-center px-4 py-3">Componentes</th>
            <th className="text-right px-4 py-3">Total</th>
            <th className="text-center px-4 py-3">Estado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => {
            const total = pkg.useCustomTotal ? pkg.customTotal : pkg.computedTotal
            const totalCount = pkg.items.length + pkg.menaje.length + pkg.menus.length + pkg.staff.length
            return (
              <tr key={pkg.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium text-gray-200">{pkg.name}</span>
                    {pkg.description && (
                      <p className="text-xs text-gray-500 truncate max-w-[220px] mt-0.5">{pkg.description}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {pkg.type ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
                      {pkg.type}
                    </span>
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {pkg.items.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400">
                        {pkg.items.length} item{pkg.items.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {pkg.menaje.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400">
                        {pkg.menaje.length} menaje
                      </span>
                    )}
                    {pkg.menus.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-green-500/10 text-green-400">
                        {pkg.menus.length} menú{pkg.menus.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {pkg.staff.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-400">
                        {pkg.staff.length} personal
                      </span>
                    )}
                    {totalCount === 0 && <span className="text-gray-600 text-xs">Sin componentes</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {pkg.useCustomTotal ? (
                      <Tag className="w-3 h-3 text-orange-400" />
                    ) : (
                      <Calculator className="w-3 h-3 text-gray-500" />
                    )}
                    <span className="font-semibold font-mono text-orange-400">{formatCOP(total)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pkg.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {pkg.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/dashboard/catering/paquetes/${pkg.id}`}>
                      <Button variant="ghost" size="sm" title="Ver detalles">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/catering/paquetes/${pkg.id}/editar`}>
                      <Button variant="ghost" size="sm" title="Editar">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm('¿Estás seguro de que deseas eliminar este paquete?')) {
                          onDelete(pkg.id)
                        }
                      }}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function CateringPaquetesPage() {
  const { packages, isLoading, searchQuery, setSearchQuery, fetchPackages, deletePackage } = useCateringPackages()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    fetchPackages(searchQuery)
  }, [fetchPackages, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(localSearch)
  }

  const filteredPackages = typeFilter
    ? packages.filter(p => p.type === typeFilter)
    : packages

  const handleDelete = async (id: string) => {
    const success = await deletePackage(id)
    if (success) fetchPackages(searchQuery)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Archive className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Paquetes</h1>
            <p className="text-gray-400 mt-1">Paquetes completos de catering para eventos</p>
          </div>
        </div>
        <Link href="/dashboard/catering/paquetes/nuevo">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Paquete
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
              <Button type="submit" variant="outline">Buscar</Button>
            </form>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-300 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="">Todos los tipos</option>
              {PACKAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </Card.Header>
        <Card.Content>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Cargando paquetes...</p>
            </div>
          ) : (
            <PackagesTable packages={filteredPackages} onDelete={handleDelete} />
          )}
        </Card.Content>
      </Card>
    </div>
  )
}
