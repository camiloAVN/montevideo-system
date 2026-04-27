'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useCateringPackages } from '@/hooks/useCateringPackages'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Archive, Edit, Calculator, Tag, ShoppingBasket, UtensilsCrossed, BookOpen, UserCheck } from 'lucide-react'

const formatCOP = (val: number | null | undefined) => {
  if (val === null || val === undefined) return '-'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val)
}

export default function PaqueteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { currentPackage, isLoading, fetchPackage } = useCateringPackages()

  useEffect(() => {
    if (id) fetchPackage(id)
  }, [id, fetchPackage])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentPackage) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Paquete no encontrado</p>
        <Link href="/dashboard/catering/paquetes">
          <Button variant="ghost" className="mt-4">Volver a paquetes</Button>
        </Link>
      </div>
    )
  }

  const pkg = currentPackage
  const total = pkg.useCustomTotal ? pkg.customTotal : pkg.computedTotal

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/catering/paquetes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
        <Link href={`/dashboard/catering/paquetes/${pkg.id}/editar`}>
          <Button variant="primary" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-orange-500/10">
          <Archive className="w-7 h-7 text-orange-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">{pkg.name}</h1>
            {pkg.type && (
              <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-orange-500/10 text-orange-400">
                {pkg.type}
              </span>
            )}
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pkg.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
              {pkg.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          {pkg.description && <p className="text-gray-400 mt-1">{pkg.description}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: components */}
        <div className="lg:col-span-2 space-y-4">

          {/* Items */}
          {pkg.items.length > 0 && (
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <ShoppingBasket className="w-4 h-4 text-orange-400" />
                  <h2 className="font-semibold text-gray-200">Items de catering</h2>
                  <span className="ml-auto text-xs text-gray-500">{pkg.items.length} item{pkg.items.length !== 1 ? 's' : ''}</span>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs border-b border-white/5">
                        <th className="text-left pb-2">Item</th>
                        <th className="text-left pb-2">Categoría</th>
                        <th className="text-center pb-2">Cant.</th>
                        <th className="text-right pb-2">Costo unit.</th>
                        <th className="text-right pb-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkg.items.map(r => (
                        <tr key={r.id} className="border-b border-white/5">
                          <td className="py-2 text-gray-200">{r.item.name}</td>
                          <td className="py-2 text-gray-500 text-xs">{r.item.category ?? '-'}</td>
                          <td className="py-2 text-center text-gray-300">{r.quantity}</td>
                          <td className="py-2 text-right font-mono text-gray-400 text-xs">{formatCOP(r.unitCost)}</td>
                          <td className="py-2 text-right font-semibold font-mono text-orange-400">{formatCOP(r.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Menaje */}
          {pkg.menaje.length > 0 && (
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                  <h2 className="font-semibold text-gray-200">Menaje</h2>
                  <span className="ml-auto text-xs text-gray-500">{pkg.menaje.length} item{pkg.menaje.length !== 1 ? 's' : ''}</span>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs border-b border-white/5">
                        <th className="text-left pb-2">Item</th>
                        <th className="text-left pb-2">Categoría</th>
                        <th className="text-center pb-2">Cant.</th>
                        <th className="text-right pb-2">Costo unit.</th>
                        <th className="text-right pb-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkg.menaje.map(r => (
                        <tr key={r.id} className="border-b border-white/5">
                          <td className="py-2 text-gray-200">{r.menaje.name}</td>
                          <td className="py-2 text-gray-500 text-xs">{r.menaje.category ?? '-'}</td>
                          <td className="py-2 text-center text-gray-300">{r.quantity}</td>
                          <td className="py-2 text-right font-mono text-gray-400 text-xs">{formatCOP(r.unitCost)}</td>
                          <td className="py-2 text-right font-semibold font-mono text-orange-400">{formatCOP(r.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Menus */}
          {pkg.menus.length > 0 && (
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  <h2 className="font-semibold text-gray-200">Menús</h2>
                  <span className="ml-auto text-xs text-gray-500">{pkg.menus.length} menú{pkg.menus.length !== 1 ? 's' : ''}</span>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs border-b border-white/5">
                        <th className="text-left pb-2">Menú</th>
                        <th className="text-left pb-2">Tipo</th>
                        <th className="text-center pb-2">Cant.</th>
                        <th className="text-right pb-2">Costo unit.</th>
                        <th className="text-right pb-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkg.menus.map(r => (
                        <tr key={r.id} className="border-b border-white/5">
                          <td className="py-2 text-gray-200">{r.menuName}</td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 rounded text-xs ${r.menuType === 'CUSTOM' ? 'bg-violet-500/10 text-violet-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {r.menuType === 'CUSTOM' ? 'Personalizado' : 'Por Items'}
                            </span>
                          </td>
                          <td className="py-2 text-center text-gray-300">{r.quantity}</td>
                          <td className="py-2 text-right font-mono text-gray-400 text-xs">{formatCOP(r.unitCost)}</td>
                          <td className="py-2 text-right font-semibold font-mono text-orange-400">{formatCOP(r.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Staff */}
          {pkg.staff.length > 0 && (
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-orange-400" />
                  <h2 className="font-semibold text-gray-200">Personal</h2>
                  <span className="ml-auto text-xs text-gray-500">{pkg.staff.length} persona{pkg.staff.length !== 1 ? 's' : ''}</span>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs border-b border-white/5">
                        <th className="text-left pb-2">Personal</th>
                        <th className="text-left pb-2">Tipo</th>
                        <th className="text-center pb-2">Cant.</th>
                        <th className="text-right pb-2">Costo unit.</th>
                        <th className="text-right pb-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkg.staff.map(r => (
                        <tr key={r.id} className="border-b border-white/5">
                          <td className="py-2 text-gray-200">{r.staffName}</td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 rounded text-xs ${r.staffType === 'FREELANCE' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {r.staffType === 'FREELANCE' ? 'Freelance' : 'Empresa'}
                            </span>
                          </td>
                          <td className="py-2 text-center text-gray-300">{r.quantity}</td>
                          <td className="py-2 text-right font-mono text-gray-400 text-xs">{formatCOP(r.unitCost)}</td>
                          <td className="py-2 text-right font-semibold font-mono text-orange-400">{formatCOP(r.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          )}

          {pkg.items.length === 0 && pkg.menaje.length === 0 && pkg.menus.length === 0 && pkg.staff.length === 0 && (
            <Card>
              <Card.Content>
                <p className="text-center text-gray-500 py-8">Este paquete aún no tiene componentes. <Link href={`/dashboard/catering/paquetes/${pkg.id}/editar`} className="text-orange-400 hover:underline">Editar paquete</Link></p>
              </Card.Content>
            </Card>
          )}
        </div>

        {/* Right column: summary */}
        <div className="space-y-4">
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-gray-200">Resumen de costos</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Items</span>
                  <span className="font-mono">{formatCOP(pkg.items.reduce((s, r) => s + (r.subtotal ?? 0), 0))}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Menaje</span>
                  <span className="font-mono">{formatCOP(pkg.menaje.reduce((s, r) => s + (r.subtotal ?? 0), 0))}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Menús</span>
                  <span className="font-mono">{formatCOP(pkg.menus.reduce((s, r) => s + (r.subtotal ?? 0), 0))}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Personal</span>
                  <span className="font-mono">{formatCOP(pkg.staff.reduce((s, r) => s + (r.subtotal ?? 0), 0))}</span>
                </div>
                <div className="border-t border-white/5 pt-2 flex justify-between text-gray-300">
                  <span className="flex items-center gap-1">
                    <Calculator className="w-3.5 h-3.5" />
                    Total calculado
                  </span>
                  <span className="font-mono">{formatCOP(pkg.computedTotal)}</span>
                </div>
                {pkg.useCustomTotal && (
                  <div className="flex justify-between text-orange-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Total personalizado
                    </span>
                    <span className="font-mono">{formatCOP(pkg.customTotal)}</span>
                  </div>
                )}
                <div className="border-t border-orange-500/20 pt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-200">Total del paquete</span>
                  <span className="text-xl font-bold text-orange-400 font-mono">{formatCOP(total)}</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          {pkg.notes && (
            <Card>
              <Card.Header><h2 className="font-semibold text-gray-200">Notas</h2></Card.Header>
              <Card.Content>
                <p className="text-gray-400 text-sm whitespace-pre-wrap">{pkg.notes}</p>
              </Card.Content>
            </Card>
          )}

          <Card>
            <Card.Header><h2 className="font-semibold text-gray-200">Información</h2></Card.Header>
            <Card.Content>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Creado</span>
                  <span>{new Date(pkg.createdAt).toLocaleDateString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actualizado</span>
                  <span>{new Date(pkg.updatedAt).toLocaleDateString('es-CO')}</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}
