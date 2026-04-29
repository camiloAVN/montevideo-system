'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuotations } from '@/hooks/useQuotations'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  ArrowLeft, Edit, Trash2, Download, User, Mail, Calendar,
  FileText, Package, Package2, UtensilsCrossed, Users2, Briefcase,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  statusLabels, statusColors, Quotation,
  QuotationCateringLine,
} from '@/lib/validations/quotation'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function computeLineTotal(line: QuotationCateringLine): number {
  const unitPrice = Number(line.unitPrice) || 0
  if (
    line.type === 'personal' ||
    line.type === 'catering-staff' ||
    line.type === 'catering-staff-freelance'
  ) {
    return unitPrice * (line.people || 1) * (line.shifts || 1)
  }
  if (line.type === 'catering-menaje' || line.type === 'catering-staff-company') {
    return unitPrice
  }
  return unitPrice * (line.quantity || 1)
}

function getQtyDisplay(line: QuotationCateringLine): string {
  if (
    line.type === 'personal' ||
    line.type === 'catering-staff' ||
    line.type === 'catering-staff-freelance'
  ) {
    return `${line.people} pers. × ${line.shifts} turno${(line.shifts ?? 1) !== 1 ? 's' : ''}`
  }
  if (line.type === 'catering-staff-company') {
    return `${line.people} pers.`
  }
  return String(line.quantity)
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  total,
  color,
  textColor,
  borderColor,
  bgColor,
}: {
  icon: React.ElementType
  title: string
  total: number
  color: string
  textColor: string
  borderColor: string
  bgColor: string
}) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-t-lg border-b ${bgColor} ${borderColor}`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${textColor}`} />
        <h3 className={`font-semibold text-base ${textColor}`}>{title}</h3>
      </div>
      <span className={`font-bold text-sm ${textColor}`}>{formatCurrency(total)}</span>
    </div>
  )
}

// ── Generic line table ────────────────────────────────────────────────────────
function LineTable({
  rows,
}: {
  rows: { key: string; description: string; sub?: string; qty: string; unitPrice: number | null; total: number }[]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wide">
            <th className="text-left py-2 px-3 font-medium w-1/2">Descripción</th>
            <th className="text-right py-2 px-3 font-medium">Cantidad</th>
            <th className="text-right py-2 px-3 font-medium">P. Unit.</th>
            <th className="text-right py-2 px-3 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.key}
              className={`border-b border-gray-800/50 ${i % 2 === 0 ? '' : 'bg-gray-900/30'}`}
            >
              <td className="py-2.5 px-3">
                <p className="text-gray-200">{row.description}</p>
                {row.sub && <p className="text-xs text-gray-500 mt-0.5">{row.sub}</p>}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-300">{row.qty}</td>
              <td className="py-2.5 px-3 text-right text-gray-300">
                {row.unitPrice !== null ? formatCurrency(row.unitPrice) : '—'}
              </td>
              <td className="py-2.5 px-3 text-right font-medium text-green-400">
                {formatCurrency(row.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Subtotal row ──────────────────────────────────────────────────────────────
function SectionFooter({ label, total }: { label: string; total: number }) {
  return (
    <div className="flex justify-end px-3 py-2 border-t border-gray-800 bg-gray-900/20 rounded-b-lg">
      <span className="text-sm text-gray-400 mr-4">{label}</span>
      <span className="text-sm font-semibold text-white">{formatCurrency(total)}</span>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = use(params)
  const { isLoading, fetchQuotation, deleteQuotation, downloadPDF } = useQuotations()
  const [q, setQ] = useState<Quotation | null>(null)

  useEffect(() => {
    fetchQuotation(id).then((data) => setQ(data))
  }, [id, fetchQuotation])

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
      const success = await deleteQuotation(id)
      if (success) router.push('/dashboard/cotizaciones')
    }
  }

  if (isLoading || !q) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="inline-block w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Derived data ────────────────────────────────────────────────────────────
  const inventoryItems = q.items.filter((i) => !!i.inventoryItemId)
  const customItems = q.items.filter((i) => !i.inventoryItemId)
  const groups = q.groups ?? []
  const concepts = q.conceptItems ?? []
  const cateringOnly = (q.cateringLines ?? []).filter((l) => l.type !== 'personal')
  const personalLines = (q.cateringLines ?? []).filter((l) => l.type === 'personal')

  const inventorySubtotal = inventoryItems.reduce((s, i) => s + Number(i.unitPrice) * i.quantity, 0)
  const customSubtotal = customItems.reduce((s, i) => s + Number(i.unitPrice) * i.quantity, 0)
  const groupsSubtotal = groups.reduce((s, g) => s + Number(g.unitPrice) * g.quantity, 0)
  const conceptsSubtotal = concepts.reduce((s, c) => s + Number(c.unitPrice) * c.quantity, 0)
  const cateringSubtotal = cateringOnly.reduce((s, l) => s + computeLineTotal(l), 0)
  const personalSubtotal = personalLines.reduce((s, l) => s + computeLineTotal(l), 0)

  const hasSections =
    inventoryItems.length > 0 ||
    customItems.length > 0 ||
    groups.length > 0 ||
    concepts.length > 0 ||
    cateringOnly.length > 0 ||
    personalLines.length > 0

  return (
    <div className="space-y-6 pb-8">
      {/* ── Top bar ── */}
      <div>
        <Link
          href="/dashboard/cotizaciones"
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a cotizaciones
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold">{q.title}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[q.status]}`}>
                {statusLabels[q.status]}
              </span>
            </div>
            <p className="text-pink-400 font-mono mt-1">{q.quotationNumber}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => downloadPDF(id, q.quotationNumber)}>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
            <Link href={`/dashboard/cotizaciones/${id}/editar`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Button
              variant="outline"
              className="text-red-400 hover:text-red-300 hover:border-red-500/50"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-4">
          {q.description && (
            <Card>
              <Card.Content>
                <p className="text-gray-300">{q.description}</p>
              </Card.Content>
            </Card>
          )}

          {!hasSections && (
            <Card>
              <Card.Content>
                <p className="text-gray-400 text-center py-8">Esta cotización no tiene items.</p>
              </Card.Content>
            </Card>
          )}

          {/* ── Grupos / Paquetes ── */}
          {groups.length > 0 && (
            <div className="rounded-lg border border-cyan-500/20 overflow-hidden">
              <SectionHeader
                icon={Package2}
                title="Grupos / Paquetes"
                total={groupsSubtotal}
                color="#0e7490"
                textColor="text-cyan-300"
                borderColor="border-cyan-500/20"
                bgColor="bg-cyan-500/5"
              />
              <LineTable
                rows={groups.map((g) => ({
                  key: g.id,
                  description: g.name,
                  sub: g.description || undefined,
                  qty: String(g.quantity),
                  unitPrice: Number(g.unitPrice),
                  total: Number(g.unitPrice) * g.quantity,
                }))}
              />
              <SectionFooter label="Subtotal Grupos" total={groupsSubtotal} />
            </div>
          )}

          {/* ── Conceptos de Contratistas ── */}
          {concepts.length > 0 && (
            <div className="rounded-lg border border-violet-500/20 overflow-hidden">
              <SectionHeader
                icon={Briefcase}
                title="Conceptos de Contratistas"
                total={conceptsSubtotal}
                color="#6d28d9"
                textColor="text-violet-300"
                borderColor="border-violet-500/20"
                bgColor="bg-violet-500/5"
              />
              <LineTable
                rows={concepts.map((c) => ({
                  key: c.id,
                  description: c.name,
                  sub: c.description
                    ? c.description
                    : c.concept?.supplier?.name
                    ? `Proveedor: ${c.concept.supplier.name}`
                    : undefined,
                  qty: String(c.quantity),
                  unitPrice: Number(c.unitPrice),
                  total: Number(c.unitPrice) * c.quantity,
                }))}
              />
              <SectionFooter label="Subtotal Contratistas" total={conceptsSubtotal} />
            </div>
          )}

          {/* ── Catering ── */}
          {cateringOnly.length > 0 && (
            <div className="rounded-lg border border-orange-500/20 overflow-hidden">
              <SectionHeader
                icon={UtensilsCrossed}
                title="Catering"
                total={cateringSubtotal}
                color="#92400e"
                textColor="text-orange-300"
                borderColor="border-orange-500/20"
                bgColor="bg-orange-500/5"
              />
              <LineTable
                rows={cateringOnly.map((l) => ({
                  key: l.id,
                  description: l.description,
                  sub: l.category || undefined,
                  qty: getQtyDisplay(l),
                  unitPrice:
                    l.type === 'catering-menaje' || l.type === 'catering-staff-company'
                      ? null
                      : Number(l.unitPrice),
                  total: computeLineTotal(l),
                }))}
              />
              <SectionFooter label="Subtotal Catering" total={cateringSubtotal} />
            </div>
          )}

          {/* ── Personal ── */}
          {personalLines.length > 0 && (
            <div className="rounded-lg border border-teal-500/20 overflow-hidden">
              <SectionHeader
                icon={Users2}
                title="Personal"
                total={personalSubtotal}
                color="#064e3b"
                textColor="text-teal-300"
                borderColor="border-teal-500/20"
                bgColor="bg-teal-500/5"
              />
              <LineTable
                rows={personalLines.map((l) => ({
                  key: l.id,
                  description: l.description,
                  sub: l.category || undefined,
                  qty: getQtyDisplay(l),
                  unitPrice: Number(l.unitPrice),
                  total: computeLineTotal(l),
                }))}
              />
              <SectionFooter label="Subtotal Personal" total={personalSubtotal} />
            </div>
          )}

          {/* ── Items del Inventario ── */}
          {inventoryItems.length > 0 && (
            <div className="rounded-lg border border-pink-500/20 overflow-hidden">
              <SectionHeader
                icon={Package}
                title="Items del Inventario"
                total={inventorySubtotal}
                color="#be185d"
                textColor="text-pink-300"
                borderColor="border-pink-500/20"
                bgColor="bg-pink-500/5"
              />
              <LineTable
                rows={inventoryItems.map((i) => ({
                  key: i.id,
                  description: i.description,
                  qty: String(i.quantity),
                  unitPrice: Number(i.unitPrice),
                  total: Number(i.unitPrice) * i.quantity,
                }))}
              />
              <SectionFooter label="Subtotal Inventario" total={inventorySubtotal} />
            </div>
          )}

          {/* ── Items Personalizados ── */}
          {customItems.length > 0 && (
            <div className="rounded-lg border border-gray-600/30 overflow-hidden">
              <SectionHeader
                icon={FileText}
                title="Items Personalizados"
                total={customSubtotal}
                color="#374151"
                textColor="text-gray-300"
                borderColor="border-gray-600/30"
                bgColor="bg-gray-800/30"
              />
              <LineTable
                rows={customItems.map((i) => ({
                  key: i.id,
                  description: i.description,
                  qty: String(i.quantity),
                  unitPrice: Number(i.unitPrice),
                  total: Number(i.unitPrice) * i.quantity,
                }))}
              />
              <SectionFooter label="Subtotal Personalizados" total={customSubtotal} />
            </div>
          )}

          {/* ── Grand total ── */}
          {hasSections && (
            <Card>
              <Card.Content>
                <div className="max-w-sm ml-auto space-y-2 text-sm">
                  {groupsSubtotal > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Grupos</span>
                      <span>{formatCurrency(groupsSubtotal)}</span>
                    </div>
                  )}
                  {conceptsSubtotal > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Contratistas</span>
                      <span>{formatCurrency(conceptsSubtotal)}</span>
                    </div>
                  )}
                  {cateringSubtotal > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Catering</span>
                      <span>{formatCurrency(cateringSubtotal)}</span>
                    </div>
                  )}
                  {personalSubtotal > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Personal</span>
                      <span>{formatCurrency(personalSubtotal)}</span>
                    </div>
                  )}
                  {inventorySubtotal > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Inventario</span>
                      <span>{formatCurrency(inventorySubtotal)}</span>
                    </div>
                  )}
                  {customSubtotal > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Personalizados</span>
                      <span>{formatCurrency(customSubtotal)}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t border-gray-800 text-gray-300">
                    <span>Subtotal</span>
                    <span>{formatCurrency(Number(q.subtotal))}</span>
                  </div>
                  {Number(q.discount) > 0 && (
                    <div className="flex justify-between text-red-400">
                      <span>Descuento</span>
                      <span>-{formatCurrency(Number(q.discount))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <span>IVA</span>
                    <span>+{formatCurrency(Number(q.tax))}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-pink-600/40 text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-400">{formatCurrency(Number(q.total))}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* ── Notes / Terms ── */}
          {(q.notes || q.terms) && (
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold">Información Adicional</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {q.notes && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1 font-medium">Notas</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{q.notes}</p>
                    </div>
                  )}
                  {q.terms && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1 font-medium">Términos y Condiciones</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{q.terms}</p>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Client */}
          <Card>
            <Card.Header>
              <h2 className="text-base font-semibold">Cliente</h2>
            </Card.Header>
            <Card.Content>
              {q.client ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{q.client.name}</p>
                      {q.client.company && (
                        <p className="text-xs text-gray-400">{q.client.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-300 break-all">{q.client.email}</p>
                  </div>
                  {q.client.phone && (
                    <p className="text-sm text-gray-400 pl-7">{q.client.phone}</p>
                  )}
                  {q.client.taxId && (
                    <p className="text-xs text-gray-500 pl-7">NIT: {q.client.taxId}</p>
                  )}
                  <Link href={`/dashboard/clientes/${q.client.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-1">
                      Ver perfil del cliente
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Sin cliente asignado</p>
              )}
            </Card.Content>
          </Card>

          {/* Project */}
          {q.project && (
            <Card>
              <Card.Header>
                <h2 className="text-base font-semibold">Proyecto</h2>
              </Card.Header>
              <Card.Content>
                <div className="flex items-start gap-3 mb-3">
                  <FileText className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                  <p className="font-medium text-sm">{q.project.title}</p>
                </div>
                <Link href={`/dashboard/proyectos/${q.project.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver proyecto
                  </Button>
                </Link>
              </Card.Content>
            </Card>
          )}

          {/* Dates */}
          <Card>
            <Card.Header>
              <h2 className="text-base font-semibold">Fechas</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Emitida</p>
                    <p className="font-medium">
                      {format(new Date(q.createdAt), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Válida hasta</p>
                    <p className="font-medium">
                      {format(new Date(q.validUntil), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Última actualización</p>
                    <p className="font-medium text-gray-400">
                      {format(new Date(q.updatedAt), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Created by */}
          {q.createdByUser && (
            <Card>
              <Card.Header>
                <h2 className="text-base font-semibold">Creada por</h2>
              </Card.Header>
              <Card.Content>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pink-600/20 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {q.createdByUser.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-400">{q.createdByUser.email}</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Summary mini-card */}
          <Card>
            <Card.Header>
              <h2 className="text-base font-semibold">Resumen</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-1.5 text-sm">
                {groups.length > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Package2 className="w-3.5 h-3.5 text-cyan-400" />
                      Grupos ({groups.length})
                    </span>
                    <span className="text-cyan-400">{formatCurrency(groupsSubtotal)}</span>
                  </div>
                )}
                {concepts.length > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-violet-400" />
                      Contratistas ({concepts.length})
                    </span>
                    <span className="text-violet-400">{formatCurrency(conceptsSubtotal)}</span>
                  </div>
                )}
                {cateringOnly.length > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
                      Catering ({cateringOnly.length})
                    </span>
                    <span className="text-orange-400">{formatCurrency(cateringSubtotal)}</span>
                  </div>
                )}
                {personalLines.length > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Users2 className="w-3.5 h-3.5 text-teal-400" />
                      Personal ({personalLines.length})
                    </span>
                    <span className="text-teal-400">{formatCurrency(personalSubtotal)}</span>
                  </div>
                )}
                {inventoryItems.length > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-pink-400" />
                      Inventario ({inventoryItems.length})
                    </span>
                    <span className="text-pink-400">{formatCurrency(inventorySubtotal)}</span>
                  </div>
                )}
                {customItems.length > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      Personalizados ({customItems.length})
                    </span>
                    <span>{formatCurrency(customSubtotal)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-800 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-green-400">{formatCurrency(Number(q.total))}</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}
