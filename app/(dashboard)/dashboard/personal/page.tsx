'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePersonal } from '@/hooks/usePersonal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import {
  Plus, Search, Pencil, Trash2, Users, Tag, Settings2,
  CheckCircle2, XCircle,
} from 'lucide-react'

const formatCOP = (val: unknown) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })
    .format(Number(val) || 0)

export default function PersonalPage() {
  const { staff, categories, isLoading, fetchStaff, fetchCategories, deleteStaff } = usePersonal()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchStaff()
    fetchCategories()
  }, [fetchStaff, fetchCategories])

  const filtered = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !categoryFilter || s.categoryId === categoryFilter
    return matchSearch && matchCategory
  })

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar a "${name}"?`)) return
    setDeletingId(id)
    await deleteStaff(id)
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/10">
            <Users className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Personal</h1>
            <p className="text-gray-400 mt-0.5">{staff.length} persona{staff.length !== 1 ? 's' : ''} registrada{staff.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/personal/categorias">
            <Button variant="ghost" size="sm">
              <Settings2 className="w-4 h-4 mr-2" />
              Categorías
            </Button>
          </Link>
          <Link href="/dashboard/personal/nuevo">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar personal
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-300 text-sm focus:outline-none focus:border-teal-500 transition-colors min-w-[200px]"
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card>
        <Card.Content className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">
                {search || categoryFilter ? 'Sin resultados' : 'No hay personal registrado'}
              </p>
              {!search && !categoryFilter && (
                <Link href="/dashboard/personal/nuevo">
                  <Button variant="ghost" size="sm" className="mt-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar el primero
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 text-xs">
                    <th className="text-left px-4 py-3">Nombre</th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell">Categoría</th>
                    <th className="text-right px-4 py-3 hidden md:table-cell">Valor turno</th>
                    <th className="text-center px-4 py-3 hidden sm:table-cell">Estado</th>
                    <th className="px-4 py-3 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className="border-t border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-gray-200 font-medium">{s.name}</span>
                        {s.notes && (
                          <span className="block text-xs text-gray-500 truncate max-w-xs">{s.notes}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {s.category ? (
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-teal-400" />
                            <span className="text-gray-300 text-xs">{s.category.name}</span>
                          </span>
                        ) : (
                          <span className="text-gray-600 text-xs">Sin categoría</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        {s.shiftRate != null ? (
                          <span className="font-mono text-teal-400 font-semibold">{formatCOP(s.shiftRate)}</span>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        {s.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <XCircle className="w-3.5 h-3.5" /> Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/dashboard/personal/${s.id}/editar`}>
                            <button className="p-1.5 rounded hover:bg-teal-500/10 text-gray-500 hover:text-teal-400 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(s.id, s.name)}
                            disabled={deletingId === s.id}
                            className="p-1.5 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}
