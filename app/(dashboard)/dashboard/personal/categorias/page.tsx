'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePersonal } from '@/hooks/usePersonal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Plus, Pencil, Trash2, Check, X, Tag, Shield } from 'lucide-react'

export default function CategoriasPersonalPage() {
  const { categories, fetchCategories, createCategory, editCategory, deleteCategory } = usePersonal()
  const [loading, setLoading] = useState(true)

  // New category form
  const [newName, setNewName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState('')

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories().finally(() => setLoading(false))
  }, [fetchCategories])

  const handleAdd = async () => {
    if (newName.trim().length < 2) { setAddError('Mínimo 2 caracteres'); return }
    setIsAdding(true)
    setAddError('')
    const created = await createCategory({ name: newName.trim() })
    if (created) setNewName('')
    setIsAdding(false)
  }

  const startEdit = (id: string, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const cancelEdit = () => { setEditingId(null); setEditName('') }

  const handleSave = async (id: string) => {
    if (editName.trim().length < 2) return
    setSavingId(id)
    await editCategory(id, { name: editName.trim() })
    setSavingId(null)
    setEditingId(null)
  }

  const handleDelete = async (id: string, name: string, staffCount: number) => {
    if (staffCount > 0) return
    if (!confirm(`¿Eliminar la categoría "${name}"?`)) return
    setDeletingId(id)
    await deleteCategory(id)
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/personal">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Personal
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-teal-500/10">
          <Tag className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Categorías de Personal</h1>
          <p className="text-gray-400 mt-1">{categories.length} categoría{categories.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Add new */}
      <Card>
        <Card.Content className="pt-6">
          <p className="text-sm font-medium text-gray-300 mb-3">Agregar nueva categoría</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Nombre de la categoría..."
                value={newName}
                onChange={e => { setNewName(e.target.value); setAddError('') }}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
              />
              {addError && <p className="text-red-400 text-xs mt-1">{addError}</p>}
            </div>
            <Button
              variant="primary"
              onClick={handleAdd}
              disabled={isAdding || !newName.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAdding ? 'Guardando...' : 'Agregar'}
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Categories list */}
      <Card>
        <Card.Content className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">No hay categorías</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {categories.map(cat => {
                const staffCount = cat._count?.staff ?? 0
                const isEditing = editingId === cat.id
                return (
                  <li key={cat.id} className="flex items-center gap-3 px-4 py-3">
                    {cat.isDefault && (
                      <Shield className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    )}
                    {!cat.isDefault && <Tag className="w-3.5 h-3.5 text-gray-600 shrink-0" />}

                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          autoFocus
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSave(cat.id)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                          className="flex-1 px-2 py-1 rounded bg-gray-800 border border-teal-500/50 text-gray-100 text-sm focus:outline-none focus:border-teal-500"
                        />
                        <button
                          onClick={() => handleSave(cat.id)}
                          disabled={savingId === cat.id}
                          className="p-1.5 rounded bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded hover:bg-white/5 text-gray-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-sm text-gray-200">{cat.name}</span>
                        {staffCount > 0 && (
                          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                            {staffCount} persona{staffCount !== 1 ? 's' : ''}
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(cat.id, cat.name)}
                            className="p-1.5 rounded hover:bg-teal-500/10 text-gray-500 hover:text-teal-400 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name, staffCount)}
                            disabled={deletingId === cat.id || staffCount > 0}
                            title={staffCount > 0 ? 'No se puede eliminar: tiene personal asignado' : 'Eliminar'}
                            className="p-1.5 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Card.Content>
      </Card>

      <p className="text-xs text-gray-600 flex items-center gap-1">
        <Shield className="w-3 h-3 text-teal-600" />
        Las categorías predeterminadas pueden editarse pero no eliminarse si tienen personal asignado.
      </p>
    </div>
  )
}
