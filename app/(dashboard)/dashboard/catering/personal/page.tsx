'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCateringStaffFreelance } from '@/hooks/useCateringStaffFreelance'
import { useCateringStaffCompany } from '@/hooks/useCateringStaffCompany'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Plus, Users, UserCheck, Edit, Trash2, CheckCircle2, XCircle, Building2 } from 'lucide-react'
import { CateringStaffFreelance } from '@/lib/validations/catering-staff-freelance'
import { CateringStaffCompany } from '@/lib/validations/catering-staff-company'

const formatCOP = (val: number | null | undefined) => {
  if (val == null) return '-'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(val))
}

// ── Freelance list ──────────────────────────────────────────────────────────

function FreelanceList({
  staff,
  onDelete,
}: {
  staff: CateringStaffFreelance[]
  onDelete: (id: string) => void
}) {
  if (staff.length === 0) {
    return (
      <div className="text-center py-12">
        <UserCheck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No hay personal freelance registrado</p>
        <p className="text-sm text-gray-500 mt-2">Agrega tu primer colaborador freelance</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700/50 text-left">
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Tarifa/jornada</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Tarifa/hora</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">ARL</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Manip. alimentos</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/30">
          {staff.map((s) => (
            <tr key={s.id} className="hover:bg-gray-800/20 transition-colors">
              <td className="py-3 pr-4">
                <div>
                  <p className="font-medium text-gray-200">{s.fullName}</p>
                  {s.documentNumber && <p className="text-xs text-gray-500">{s.documentNumber}</p>}
                </div>
              </td>
              <td className="py-3 pr-4">
                {s.role ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
                    {s.role}
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
              <td className="py-3 pr-4 text-gray-400 text-sm">{s.city || '-'}</td>
              <td className="py-3 pr-4 text-right font-mono text-gray-300 text-sm">{formatCOP(s.ratePerShift)}</td>
              <td className="py-3 pr-4 text-right font-mono text-gray-300 text-sm">{formatCOP(s.ratePerHour)}</td>
              <td className="py-3 pr-4 text-center">
                {s.hasSocialSecurity
                  ? <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />
                  : <XCircle className="w-4 h-4 text-gray-600 mx-auto" />}
              </td>
              <td className="py-3 pr-4 text-center">
                {s.hasFoodHandlingCert
                  ? <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />
                  : <XCircle className="w-4 h-4 text-gray-600 mx-auto" />}
              </td>
              <td className="py-3 pr-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  s.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {s.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/catering/personal/freelance/${s.id}/editar`}>
                    <Button variant="ghost" size="sm" title="Editar">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas eliminar este registro?')) onDelete(s.id)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Company list ────────────────────────────────────────────────────────────

function CompanyList({
  staff,
  onDelete,
}: {
  staff: CateringStaffCompany[]
  onDelete: (id: string) => void
}) {
  if (staff.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No hay personal por empresa registrado</p>
        <p className="text-sm text-gray-500 mt-2">Vincula personal a través de un proveedor</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700/50 text-left">
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Personas</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Modo</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ganancia</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Total</th>
            <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/30">
          {staff.map((s) => (
            <tr key={s.id} className="hover:bg-gray-800/20 transition-colors">
              <td className="py-3 pr-4">
                <span className="font-medium text-gray-200">{s.name || '-'}</span>
              </td>
              <td className="py-3 pr-4 text-gray-400 text-sm">{s.supplier?.name || '-'}</td>
              <td className="py-3 pr-4">
                {s.role ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
                    {s.role}
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
              <td className="py-3 pr-4 text-center text-gray-300">{s.staffCount ?? '-'}</td>
              <td className="py-3 pr-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                  s.costMode === 'PER_HOUR' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                }`}>
                  {s.costMode === 'PER_HOUR' ? 'Por hora' : 'Por turno'}
                </span>
              </td>
              <td className="py-3 pr-4 text-right font-mono text-gray-300 text-sm">
                {s.markupAmount != null ? (
                  <span>
                    {formatCOP(s.markupAmount)}
                    {s.markupPercent != null && (
                      <span className="text-xs text-gray-500 ml-1">({Number(s.markupPercent).toFixed(1)}%)</span>
                    )}
                  </span>
                ) : '-'}
              </td>
              <td className="py-3 pr-4 text-right font-semibold text-orange-400 font-mono text-sm">
                {formatCOP(s.total)}
              </td>
              <td className="py-3 pr-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  s.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {s.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/catering/personal/empresa/${s.id}/editar`}>
                    <Button variant="ghost" size="sm" title="Editar">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas eliminar este registro?')) onDelete(s.id)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────

type Tab = 'freelance' | 'empresa'

export default function CateringPersonalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('freelance')
  const { staff: freelanceStaff, isLoading: loadingFreelance, fetchStaff: fetchFreelance, deleteStaff: deleteFreelance } =
    useCateringStaffFreelance()
  const { staff: companyStaff, isLoading: loadingCompany, fetchStaff: fetchCompany, deleteStaff: deleteCompany } =
    useCateringStaffCompany()

  useEffect(() => {
    fetchFreelance()
    fetchCompany()
  }, [fetchFreelance, fetchCompany])

  const handleDeleteFreelance = async (id: string) => {
    const ok = await deleteFreelance(id)
    if (ok) fetchFreelance()
  }

  const handleDeleteCompany = async (id: string) => {
    const ok = await deleteCompany(id)
    if (ok) fetchCompany()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Users className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Personal de Catering</h1>
            <p className="text-gray-400 mt-1">Gestiona el personal freelance y por empresa</p>
          </div>
        </div>

        {activeTab === 'freelance' ? (
          <Link href="/dashboard/catering/personal/freelance/nuevo">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Freelance
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard/catering/personal/empresa/nuevo">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo por Empresa
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <div className="border-b border-gray-700/50 px-4">
          <div className="flex gap-1">
            {(
              [
                { key: 'freelance' as Tab, label: 'Freelance', icon: <UserCheck className="w-4 h-4" />, count: freelanceStaff.length },
                { key: 'empresa' as Tab, label: 'Por Empresa', icon: <Building2 className="w-4 h-4" />, count: companyStaff.length },
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
                <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                  activeTab === tab.key ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700 text-gray-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Card.Content>
          {activeTab === 'freelance' && (
            loadingFreelance ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 mt-4">Cargando personal...</p>
              </div>
            ) : (
              <FreelanceList staff={freelanceStaff} onDelete={handleDeleteFreelance} />
            )
          )}

          {activeTab === 'empresa' && (
            loadingCompany ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 mt-4">Cargando personal...</p>
              </div>
            ) : (
              <CompanyList staff={companyStaff} onDelete={handleDeleteCompany} />
            )
          )}
        </Card.Content>
      </Card>
    </div>
  )
}
