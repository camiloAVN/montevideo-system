'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCateringMenuItems } from '@/hooks/useCateringMenuItems'
import { useCateringMenuCustom } from '@/hooks/useCateringMenuCustom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Plus, ChefHat, UtensilsCrossed, ChevronDown, ChevronRight, Edit, Trash2, Package } from 'lucide-react'
import { CateringMenuFromItems } from '@/lib/validations/catering-menu-items'
import { CateringMenuCustom } from '@/lib/validations/catering-menu-custom'

const formatCOP = (val: number | null | undefined) => {
  if (val == null) return '-'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(val))
}

// ── Menús por items ─────────────────────────────────────────────────────────

function MenuFromItemsList({
  menus,
  onDelete,
}: {
  menus: CateringMenuFromItems[]
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  if (menus.length === 0) {
    return (
      <div className="text-center py-12">
        <UtensilsCrossed className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No hay menús por items creados</p>
        <p className="text-sm text-gray-500 mt-2">Crea tu primer menú combinando items de menaje</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {menus.map((menu) => {
        const isOpen = expanded.has(menu.id)
        const displayTotal = menu.useCustomTotal ? menu.customTotal : menu.computedTotal

        return (
          <div key={menu.id} className="rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
              <button
                type="button"
                onClick={() => toggle(menu.id)}
                className="text-gray-400 hover:text-gray-200 transition-colors flex-shrink-0"
              >
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              <div className="flex-1 min-w-0">
                <span className="font-medium text-gray-200">{menu.name}</span>
                {menu.description && (
                  <p className="text-xs text-gray-500 truncate">{menu.description}</p>
                )}
              </div>

              {menu.menuType && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 flex-shrink-0">
                  {menu.menuType}
                </span>
              )}

              <span className="text-xs text-gray-500 flex-shrink-0">
                {menu.menuItems.length} item{menu.menuItems.length !== 1 ? 's' : ''}
              </span>

              {menu.useCustomTotal && (
                <span className="text-xs text-amber-400/70 flex-shrink-0">total mod.</span>
              )}

              <span className="font-semibold text-orange-400 font-mono text-sm flex-shrink-0 w-32 text-right">
                {formatCOP(displayTotal)}
              </span>

              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                  menu.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                }`}
              >
                {menu.isActive ? 'Activo' : 'Inactivo'}
              </span>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Link href={`/dashboard/catering/menus/items/${menu.id}/editar`}>
                  <Button variant="ghost" size="sm" title="Editar">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => {
                    if (confirm('¿Estás seguro de que deseas eliminar este menú?')) onDelete(menu.id)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {isOpen && (
              <div className="border-t border-gray-700/40 bg-gray-900/20 px-4 py-3">
                {menu.menuItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {menu.menuItems.map((rel) => (
                      <div
                        key={rel.id}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/40 border border-gray-700/30 text-sm"
                      >
                        <div className="min-w-0">
                          <span className="text-gray-200 font-medium truncate block">{rel.menaje.name}</span>
                          {rel.menaje.category && (
                            <span className="text-xs text-gray-500">{rel.menaje.category}</span>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className="text-gray-400 text-xs block">×{rel.quantity}</span>
                          <span className="text-orange-400 font-mono text-xs">
                            {formatCOP((Number(rel.menaje.total) || 0) * rel.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Sin items asociados</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Menús personalizados ────────────────────────────────────────────────────

function CustomMenusList({
  menus,
  onDelete,
}: {
  menus: CateringMenuCustom[]
  onDelete: (id: string) => void
}) {
  if (menus.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No hay menús personalizados creados</p>
        <p className="text-sm text-gray-500 mt-2">Crea tu primer menú personalizado con precios manuales</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Proveedor</th>
            <th>Platos</th>
            <th>Modo</th>
            <th>Ganancia</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td>
                <div>
                  <span className="font-medium">{menu.name}</span>
                  {menu.description && (
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{menu.description}</p>
                  )}
                </div>
              </td>
              <td>
                {menu.menuType ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
                    {menu.menuType}
                  </span>
                ) : <span className="text-gray-500">-</span>}
              </td>
              <td className="text-gray-400 text-sm">{menu.supplier?.name || '-'}</td>
              <td className="text-gray-300 text-center text-sm">{menu.plateCount ?? '-'}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                    menu.costMode === 'PACKAGE'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {menu.costMode === 'PACKAGE' ? (
                    <><Package className="w-3 h-3" />Paquete</>
                  ) : (
                    <><UtensilsCrossed className="w-3 h-3" />Por plato</>
                  )}
                </span>
              </td>
              <td className="text-gray-300 font-mono text-sm">
                {menu.markupAmount != null ? (
                  <span>
                    {formatCOP(menu.markupAmount)}
                    {menu.markupPercent != null && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({Number(menu.markupPercent).toFixed(1)}%)
                      </span>
                    )}
                  </span>
                ) : '-'}
              </td>
              <td className="font-semibold text-orange-400 font-mono text-sm">
                {formatCOP(menu.total)}
              </td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    menu.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {menu.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/catering/menus/personalizado/${menu.id}/editar`}>
                    <Button variant="ghost" size="sm" title="Editar">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas eliminar este menú?')) onDelete(menu.id)
                    }}
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

// ── Main page ───────────────────────────────────────────────────────────────

type Tab = 'items' | 'personalizado'

export default function CateringMenusPage() {
  const [activeTab, setActiveTab] = useState<Tab>('items')
  const { menus: itemMenus, isLoading: loadingItems, fetchMenus: fetchItemMenus, deleteMenu: deleteItemMenu } =
    useCateringMenuItems()
  const { menus: customMenus, isLoading: loadingCustom, fetchMenus: fetchCustomMenus, deleteMenu: deleteCustomMenu } =
    useCateringMenuCustom()

  useEffect(() => {
    fetchItemMenus()
    fetchCustomMenus()
  }, [fetchItemMenus, fetchCustomMenus])

  const handleDeleteItemMenu = async (id: string) => {
    const ok = await deleteItemMenu(id)
    if (ok) fetchItemMenus()
  }

  const handleDeleteCustomMenu = async (id: string) => {
    const ok = await deleteCustomMenu(id)
    if (ok) fetchCustomMenus()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <ChefHat className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Menús</h1>
            <p className="text-gray-400 mt-1">Gestiona los menús de catering</p>
          </div>
        </div>

        {activeTab === 'items' ? (
          <Link href="/dashboard/catering/menus/items/nuevo">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Menú por Items
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard/catering/menus/personalizado/nuevo">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Menú Personalizado
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <div className="border-b border-gray-700/50 px-4">
          <div className="flex gap-1">
            {(
              [
                { key: 'items' as Tab, label: 'Menús por Items', icon: <UtensilsCrossed className="w-4 h-4" />, count: itemMenus.length },
                { key: 'personalizado' as Tab, label: 'Menús Personalizados', icon: <ChefHat className="w-4 h-4" />, count: customMenus.length },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                    activeTab === tab.key ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Card.Content>
          {activeTab === 'items' && (
            loadingItems ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 mt-4">Cargando menús...</p>
              </div>
            ) : (
              <MenuFromItemsList menus={itemMenus} onDelete={handleDeleteItemMenu} />
            )
          )}

          {activeTab === 'personalizado' && (
            loadingCustom ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 mt-4">Cargando menús...</p>
              </div>
            ) : (
              <CustomMenusList menus={customMenus} onDelete={handleDeleteCustomMenu} />
            )
          )}
        </Card.Content>
      </Card>
    </div>
  )
}
