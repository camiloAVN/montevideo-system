'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Plus, Search, ShoppingBasket, Eye, Edit, Trash2 } from 'lucide-react'
import { CateringSupplier } from '@/lib/validations/catering-supplier'

function SuppliersTable({
  suppliers,
  onDelete,
}: {
  suppliers: CateringSupplier[]
  onDelete: (id: string) => void
}) {
  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBasket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No hay proveedores registrados</p>
        <p className="text-sm text-gray-500 mt-2">Crea tu primer proveedor de catering para comenzar</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>NIT</th>
            <th>Contacto</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>
                <span className="font-medium">{supplier.name}</span>
              </td>
              <td className="text-gray-400 font-mono text-sm">{supplier.nit || '-'}</td>
              <td className="text-gray-400">{supplier.contactName || '-'}</td>
              <td className="text-gray-400">{supplier.email || '-'}</td>
              <td className="text-gray-400">{supplier.phone || '-'}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    supplier.isActive
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {supplier.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/catering/proveedores/${supplier.id}`}>
                    <Button variant="ghost" size="sm" title="Ver detalles">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/catering/proveedores/${supplier.id}/editar`}>
                    <Button variant="ghost" size="sm" title="Editar">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
                        onDelete(supplier.id)
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

export default function CateringProveedoresPage() {
  const { suppliers, isLoading, searchQuery, setSearchQuery, fetchSuppliers, deleteSupplier } =
    useCateringSuppliers()
  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    fetchSuppliers(searchQuery)
  }, [fetchSuppliers, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(localSearch)
  }

  const handleDelete = async (id: string) => {
    const success = await deleteSupplier(id)
    if (success) fetchSuppliers(searchQuery)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <ShoppingBasket className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Proveedores</h1>
            <p className="text-gray-400 mt-1">Proveedores de alimentos, bebidas y servicios de catering</p>
          </div>
        </div>
        <Link href="/dashboard/catering/proveedores/nuevo">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </Link>
      </div>

      <Card>
        <Card.Header>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre, contacto, NIT o email..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button type="submit" variant="outline">
              Buscar
            </Button>
          </form>
        </Card.Header>
        <Card.Content>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Cargando proveedores...</p>
            </div>
          ) : (
            <SuppliersTable suppliers={suppliers} onDelete={handleDelete} />
          )}
        </Card.Content>
      </Card>
    </div>
  )
}
