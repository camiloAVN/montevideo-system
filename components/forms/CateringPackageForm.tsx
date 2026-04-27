'use client'

import { useState, useEffect, useMemo } from 'react'
import { CateringPackageFormData, PACKAGE_TYPES } from '@/lib/validations/catering-package'
import { CateringItem } from '@/lib/validations/catering-item'
import { CateringMenaje } from '@/lib/validations/catering-menaje'
import { CateringMenuCustom } from '@/lib/validations/catering-menu-custom'
import { CateringMenuFromItems } from '@/lib/validations/catering-menu-items'
import { CateringStaffFreelance } from '@/lib/validations/catering-staff-freelance'
import { CateringStaffCompany } from '@/lib/validations/catering-staff-company'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Search, Plus, Trash2, ChevronDown, ChevronUp,
  ShoppingBasket, UtensilsCrossed, BookOpen, UserCheck, Calculator, Tag,
  CheckCircle2, Lock
} from 'lucide-react'

// ---- Helper: safely parse any Prisma Decimal / number / string to number ----
const n = (val: unknown): number => {
  if (val === null || val === undefined) return 0
  const parsed = typeof val === 'string' ? parseFloat(val) : Number(val)
  return isNaN(parsed) ? 0 : parsed
}

const formatCOP = (val: unknown) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n(val))

// ---- Row types exported so the edit page can build the initialData shape ----
// isFixed = true means the value comes pre-calculated from the catalog (menaje, custom menus, company staff)
// and cannot be multiplied by quantity — the stored total IS the final price.
export type ItemRow   = { itemId: string;   name: string; category: string | null; quantity: number; unitCost: number; subtotal: number; isFixed?: false }
export type MenajeRow = { menajeId: string; name: string; category: string | null; quantity: number; unitCost: number; subtotal: number; isFixed: true }
export type MenuRow   = { menuType: 'CUSTOM' | 'FROM_ITEMS'; menuId: string; menuName: string; quantity: number; unitCost: number; subtotal: number; isFixed: boolean }
export type StaffRow  = { staffType: 'FREELANCE' | 'COMPANY'; staffId: string; staffName: string; quantity: number; unitCost: number; subtotal: number; isFixed: boolean }

// ---- initialData uses its own type (not the Zod-inferred one) to avoid conflicts ----
export type PackageFormInitialData = {
  name?: string | null
  description?: string | null
  type?: string | null
  notes?: string | null
  computedTotal?: number | string | null
  customTotal?: number | string | null
  useCustomTotal?: boolean
  isActive?: boolean
  items?: ItemRow[]
  menaje?: MenajeRow[]
  menus?: MenuRow[]
  staff?: StaffRow[]
}

interface Props {
  initialData?: PackageFormInitialData
  onSubmit: (data: CateringPackageFormData) => void
  onCancel: () => void
  isSubmitting: boolean
}

// ---- Section header with collapse ----
function SectionHeader({ icon, title, selected, total, open, onToggle }: {
  icon: React.ReactNode; title: string; selected: number; total: number; open: boolean; onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-orange-500/10">{icon}</div>
        <span className="font-semibold text-gray-100">{title}</span>
        <span className="text-xs text-gray-500">{selected} seleccionado{selected !== 1 ? 's' : ''} / {total} disponible{total !== 1 ? 's' : ''}</span>
      </div>
      {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </button>
  )
}

// ---- Selected items table ----
// isFixed rows: total comes pre-calculated from the catalog, cannot be edited
function SelectedTable({ rows, colLabel, onQtyChange, onRemove }: {
  rows: Array<{ id: string; name: string; badge?: string; badgeColor?: string; quantity: number; unitCost: number; subtotal: number; isFixed?: boolean; qtyLabel?: string }>
  colLabel: string
  onQtyChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  if (rows.length === 0) return null
  return (
    <div className="rounded-xl border border-orange-500/20 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-orange-500/5 text-gray-400 text-xs">
            <th className="text-left px-3 py-2">{colLabel}</th>
            <th className="text-left px-3 py-2 hidden sm:table-cell">Categoría / Tipo</th>
            <th className="text-center px-3 py-2 w-28">Cantidad</th>
            <th className="text-right px-3 py-2 hidden md:table-cell">Costo unit.</th>
            <th className="text-right px-3 py-2">Total</th>
            <th className="px-2 py-2 w-8" />
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className={`border-t border-white/5 ${r.isFixed ? 'bg-white/2' : ''}`}>
              <td className="px-3 py-2 text-gray-200 font-medium">{r.name}</td>
              <td className="px-3 py-2 hidden sm:table-cell">
                {r.badge ? (
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${r.badgeColor}`}>{r.badge}</span>
                ) : <span className="text-gray-500 text-xs">-</span>}
              </td>
              <td className="px-3 py-2 text-center">
                {r.isFixed ? (
                  // Fixed: quantity is informational only (e.g. totalQuantity, staffCount, plateCount)
                  <div className="flex items-center justify-center gap-1 text-gray-500">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs">{r.quantity}{r.qtyLabel ? ` ${r.qtyLabel}` : ''}</span>
                  </div>
                ) : (
                  <input
                    type="number"
                    min={1}
                    value={r.quantity}
                    onChange={e => onQtyChange(r.id, Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-600 text-gray-100 text-center text-sm focus:outline-none focus:border-orange-500"
                  />
                )}
              </td>
              <td className="px-3 py-2 text-right hidden md:table-cell">
                {r.isFixed ? (
                  <span className="text-xs text-gray-600 italic flex items-center justify-end gap-1">
                    <Lock className="w-2.5 h-2.5" />total fijo
                  </span>
                ) : (
                  <span className="text-gray-400 font-mono text-xs">{formatCOP(r.unitCost)}</span>
                )}
              </td>
              <td className="px-3 py-2 text-right">
                <span className={`font-semibold font-mono ${r.isFixed ? 'text-amber-400' : 'text-orange-400'}`}>
                  {formatCOP(r.subtotal)}
                </span>
                {r.isFixed && (
                  <span className="block text-xs text-gray-600">fijo</span>
                )}
              </td>
              <td className="px-2 py-2">
                <button type="button" onClick={() => onRemove(r.id)} className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---- Available item list ----
function AvailableList({ items, onAdd, emptyMsg }: {
  items: Array<{ id: string; name: string; sub?: string; cost: string }>
  onAdd: (id: string) => void
  emptyMsg: string
}) {
  if (items.length === 0) return <p className="text-center text-gray-600 text-sm py-6">{emptyMsg}</p>
  return (
    <div className="rounded-xl border border-white/5 max-h-52 overflow-y-auto">
      {items.map(item => (
        <button
          key={item.id}
          type="button"
          onClick={() => onAdd(item.id)}
          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-orange-500/5 transition-colors border-b border-white/5 last:border-0 text-left group"
        >
          <div className="min-w-0">
            <span className="text-sm text-gray-200 truncate block">{item.name}</span>
            {item.sub && <span className="text-xs text-gray-500">{item.sub}</span>}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="text-xs font-mono text-orange-400">{item.cost}</span>
            <Plus className="w-4 h-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
      ))}
    </div>
  )
}

export function CateringPackageForm({ initialData, onSubmit, onCancel, isSubmitting }: Props) {
  // ---- Basic fields ----
  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [type, setType] = useState(initialData?.type ?? '')
  const [notes, setNotes] = useState(initialData?.notes ?? '')
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [useCustomTotal, setUseCustomTotal] = useState(initialData?.useCustomTotal ?? false)
  const [customTotalInput, setCustomTotalInput] = useState(initialData?.customTotal != null ? String(Math.round(n(initialData.customTotal))) : '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ---- Selected rows (always numbers, never strings) ----
  const [selectedItems, setSelectedItems] = useState<ItemRow[]>(
    (initialData?.items ?? []).map(r => ({ ...r, unitCost: n(r.unitCost), subtotal: n(r.subtotal), isFixed: false as const }))
  )
  const [selectedMenaje, setSelectedMenaje] = useState<MenajeRow[]>(
    (initialData?.menaje ?? []).map(r => {
      const unitCost = n(r.unitCost)
      return { ...r, unitCost, subtotal: unitCost, isFixed: true as const }
    })
  )
  const [selectedMenus, setSelectedMenus] = useState<MenuRow[]>(
    (initialData?.menus ?? []).map(r => {
      const unitCost = n(r.unitCost)
      const isFixed = r.menuType === 'CUSTOM'
      return { ...r, unitCost, subtotal: isFixed ? unitCost : n(r.subtotal), isFixed }
    })
  )
  const [selectedStaff, setSelectedStaff] = useState<StaffRow[]>(
    (initialData?.staff ?? []).map(r => {
      const unitCost = n(r.unitCost)
      const isFixed = r.staffType === 'COMPANY'
      return { ...r, unitCost, subtotal: isFixed ? unitCost : n(r.subtotal), isFixed }
    })
  )

  // ---- Catalog data ----
  const [allItems, setAllItems]                 = useState<CateringItem[]>([])
  const [allMenaje, setAllMenaje]               = useState<CateringMenaje[]>([])
  const [allMenusCustom, setAllMenusCustom]     = useState<CateringMenuCustom[]>([])
  const [allMenusFromItems, setAllMenusFromItems] = useState<CateringMenuFromItems[]>([])
  const [allStaffFree, setAllStaffFree]         = useState<CateringStaffFreelance[]>([])
  const [allStaffCompany, setAllStaffCompany]   = useState<CateringStaffCompany[]>([])
  const [catalogLoading, setCatalogLoading]     = useState(true)

  // ---- Search ----
  const [searchItems, setSearchItems]   = useState('')
  const [searchMenaje, setSearchMenaje] = useState('')
  const [searchMenus, setSearchMenus]   = useState('')
  const [searchStaff, setSearchStaff]   = useState('')
  const [menuTab, setMenuTab]           = useState<'CUSTOM' | 'FROM_ITEMS'>('CUSTOM')
  const [staffTab, setStaffTab]         = useState<'FREELANCE' | 'COMPANY'>('FREELANCE')

  // ---- Section open state ----
  const [openItems, setOpenItems]   = useState(true)
  const [openMenaje, setOpenMenaje] = useState(true)
  const [openMenus, setOpenMenus]   = useState(true)
  const [openStaff, setOpenStaff]   = useState(true)

  // ---- Load catalog ----
  useEffect(() => {
    setCatalogLoading(true)
    Promise.all([
      fetch('/api/catering/items').then(r => r.ok ? r.json() : []),
      fetch('/api/catering/menaje').then(r => r.ok ? r.json() : []),
      fetch('/api/catering/menus/custom').then(r => r.ok ? r.json() : []),
      fetch('/api/catering/menus/from-items').then(r => r.ok ? r.json() : []),
      fetch('/api/catering/staff/freelance').then(r => r.ok ? r.json() : []),
      fetch('/api/catering/staff/company').then(r => r.ok ? r.json() : []),
    ]).then(([items, menaje, menuCustom, menuFromItems, staffFree, staffCompany]) => {
      setAllItems(items)
      setAllMenaje(menaje)
      setAllMenusCustom(menuCustom)
      setAllMenusFromItems(menuFromItems)
      setAllStaffFree(staffFree)
      setAllStaffCompany(staffCompany)
    }).catch(() => {}).finally(() => setCatalogLoading(false))
  }, [])

  // ---- Reconcile custom menu quantities from catalog once it loads ----
  // Needed for packages saved before plateCount was used as quantity
  useEffect(() => {
    if (!allMenusCustom.length) return
    setSelectedMenus(prev => prev.map(r => {
      if (r.menuType !== 'CUSTOM') return r
      const catalog = allMenusCustom.find(m => m.id === r.menuId)
      if (!catalog || !catalog.plateCount) return r
      return { ...r, quantity: catalog.plateCount! }
    }))
  }, [allMenusCustom])

  // ---- Computed total (always real arithmetic) ----
  const computedTotal = useMemo(() => {
    return (
      selectedItems.reduce((s, r)  => s + n(r.subtotal), 0) +
      selectedMenaje.reduce((s, r) => s + n(r.subtotal), 0) +
      selectedMenus.reduce((s, r)  => s + n(r.subtotal), 0) +
      selectedStaff.reduce((s, r)  => s + n(r.subtotal), 0)
    )
  }, [selectedItems, selectedMenaje, selectedMenus, selectedStaff])

  const customTotalNum = parseFloat(customTotalInput.replace(/[^0-9.]/g, '')) || 0
  const displayTotal = useCustomTotal ? customTotalNum : computedTotal

  // ==============================
  // Items handlers
  // ==============================
  const filteredItems = allItems.filter(i =>
    i.isActive &&
    !selectedItems.find(s => s.itemId === i.id) &&
    (i.name.toLowerCase().includes(searchItems.toLowerCase()) ||
     (i.category ?? '').toLowerCase().includes(searchItems.toLowerCase()))
  )

  const addItem = (id: string) => {
    const item = allItems.find(i => i.id === id)
    if (!item) return
    const unitCost = n(item.total)
    setSelectedItems(prev => [...prev, { itemId: item.id, name: item.name, category: item.category, quantity: 1, unitCost, subtotal: unitCost }])
  }

  const updateItemQty = (itemId: string, qty: number) => {
    setSelectedItems(prev => prev.map(r => r.itemId === itemId ? { ...r, quantity: qty, subtotal: n(r.unitCost) * qty } : r))
  }

  const removeItem = (itemId: string) => setSelectedItems(prev => prev.filter(r => r.itemId !== itemId))

  // ==============================
  // Menaje handlers
  // ==============================
  const filteredMenaje = allMenaje.filter(m =>
    m.isActive &&
    !selectedMenaje.find(s => s.menajeId === m.id) &&
    (m.name.toLowerCase().includes(searchMenaje.toLowerCase()) ||
     (m.category ?? '').toLowerCase().includes(searchMenaje.toLowerCase()))
  )

  const addMenaje = (id: string) => {
    const m = allMenaje.find(x => x.id === id)
    if (!m) return
    const unitCost = n(m.total)
    // Default quantity = totalQuantity registered in menaje
    const qty = m.totalQuantity > 0 ? m.totalQuantity : 1
    setSelectedMenaje(prev => [...prev, { menajeId: m.id, name: m.name, category: m.category, quantity: qty, unitCost, subtotal: unitCost, isFixed: true as const }])
  }

  const updateMenajeQty = (menajeId: string, qty: number) => {
    setSelectedMenaje(prev => prev.map(r => r.menajeId === menajeId ? { ...r, quantity: qty, subtotal: n(r.unitCost) * qty } : r))
  }

  const removeMenaje = (menajeId: string) => setSelectedMenaje(prev => prev.filter(r => r.menajeId !== menajeId))

  // ==============================
  // Menus handlers
  // ==============================
  const availableMenusCustom = allMenusCustom.filter(m =>
    m.isActive &&
    !selectedMenus.find(s => s.menuId === m.id && s.menuType === 'CUSTOM') &&
    m.name.toLowerCase().includes(searchMenus.toLowerCase())
  )
  const availableMenusFromItems = allMenusFromItems.filter(m =>
    m.isActive &&
    !selectedMenus.find(s => s.menuId === m.id && s.menuType === 'FROM_ITEMS') &&
    m.name.toLowerCase().includes(searchMenus.toLowerCase())
  )

  const addMenuCustom = (id: string) => {
    const m = allMenusCustom.find(x => x.id === id)
    if (!m) return
    const unitCost = n(m.total)
    const qty = m.plateCount && m.plateCount > 0 ? m.plateCount : 1
    setSelectedMenus(prev => [...prev, { menuType: 'CUSTOM', menuId: m.id, menuName: m.name, quantity: qty, unitCost, subtotal: unitCost, isFixed: true }])
  }

  const addMenuFromItems = (id: string) => {
    const m = allMenusFromItems.find(x => x.id === id)
    if (!m) return
    const unitCost = m.useCustomTotal ? n(m.customTotal) : n(m.computedTotal)
    setSelectedMenus(prev => [...prev, { menuType: 'FROM_ITEMS', menuId: m.id, menuName: m.name, quantity: 1, unitCost, subtotal: unitCost, isFixed: false }])
  }

  const updateMenuQty = (menuId: string, menuType: string, qty: number) => {
    setSelectedMenus(prev => prev.map(r => r.menuId === menuId && r.menuType === menuType ? { ...r, quantity: qty, subtotal: n(r.unitCost) * qty } : r))
  }

  const removeMenu = (menuId: string, menuType: string) =>
    setSelectedMenus(prev => prev.filter(r => !(r.menuId === menuId && r.menuType === menuType)))

  // ==============================
  // Staff handlers
  // ==============================
  const availableStaffFree = allStaffFree.filter(s =>
    s.isActive &&
    !selectedStaff.find(r => r.staffId === s.id && r.staffType === 'FREELANCE') &&
    (s.fullName.toLowerCase().includes(searchStaff.toLowerCase()) ||
     (s.role ?? '').toLowerCase().includes(searchStaff.toLowerCase()))
  )
  const availableStaffCompany = allStaffCompany.filter(s =>
    s.isActive &&
    !selectedStaff.find(r => r.staffId === s.id && r.staffType === 'COMPANY') &&
    ((s.name ?? '').toLowerCase().includes(searchStaff.toLowerCase()) ||
     (s.role ?? '').toLowerCase().includes(searchStaff.toLowerCase()))
  )

  const addStaffFree = (id: string) => {
    const s = allStaffFree.find(x => x.id === id)
    if (!s) return
    const unitCost = n(s.ratePerShift) || n(s.ratePerHour)
    setSelectedStaff(prev => [...prev, { staffType: 'FREELANCE', staffId: s.id, staffName: s.fullName, quantity: 1, unitCost, subtotal: unitCost, isFixed: false }])
  }

  const addStaffCompany = (id: string) => {
    const s = allStaffCompany.find(x => x.id === id)
    if (!s) return
    const unitCost = n(s.total)
    // Default quantity = staffCount registered for this company staff
    const qty = (s.staffCount && s.staffCount > 0) ? s.staffCount : 1
    setSelectedStaff(prev => [...prev, { staffType: 'COMPANY', staffId: s.id, staffName: s.name ?? 'Sin nombre', quantity: qty, unitCost, subtotal: unitCost, isFixed: true }])
  }

  const updateStaffQty = (staffId: string, staffType: string, qty: number) => {
    setSelectedStaff(prev => prev.map(r => r.staffId === staffId && r.staffType === staffType ? { ...r, quantity: qty, subtotal: n(r.unitCost) * qty } : r))
  }

  const removeStaff = (staffId: string, staffType: string) =>
    setSelectedStaff(prev => prev.filter(r => !(r.staffId === staffId && r.staffType === staffType)))

  // ==============================
  // Submit
  // ==============================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) newErrors.name = 'El nombre debe tener al menos 2 caracteres'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})

    onSubmit({
      name: name.trim(),
      description: description.trim() || null,
      type: type || null,
      notes: notes.trim() || null,
      computedTotal,
      customTotal: useCustomTotal ? customTotalNum : null,
      useCustomTotal,
      isActive,
      items:  selectedItems.map(r => ({ itemId: r.itemId,   quantity: r.quantity, unitCost: r.unitCost, subtotal: r.subtotal })),
      menaje: selectedMenaje.map(r => ({ menajeId: r.menajeId, quantity: r.quantity, unitCost: r.unitCost, subtotal: r.subtotal })),
      menus:  selectedMenus.map(r => ({ menuType: r.menuType, menuId: r.menuId, menuName: r.menuName, quantity: r.quantity, unitCost: r.unitCost, subtotal: r.subtotal })),
      staff:  selectedStaff.map(r => ({ staffType: r.staffType, staffId: r.staffId, staffName: r.staffName, quantity: r.quantity, unitCost: r.unitCost, subtotal: r.subtotal })),
    })
  }

  // ==============================
  // Render
  // ==============================
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Basic info ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Nombre <span className="text-red-400">*</span>
          </label>
          <Input
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
            placeholder="Ej: Paquete Empresarial Premium"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Descripción</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descripción del paquete..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-300 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Sin clasificar</option>
            {PACKAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-300">Paquete activo</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Notas internas</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notas adicionales..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
          />
        </div>
      </div>

      <div className="border-t border-white/5" />

      {/* ── Loading state ── */}
      {catalogLoading && (
        <div className="flex items-center justify-center gap-3 py-6 text-gray-400 text-sm">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Cargando catálogos...
        </div>
      )}

      {/* ── ITEMS ── */}
      <div className="space-y-3">
        <SectionHeader
          icon={<ShoppingBasket className="w-4 h-4 text-orange-400" />}
          title="Items de catering"
          selected={selectedItems.length}
          total={allItems.filter(i => i.isActive).length}
          open={openItems}
          onToggle={() => setOpenItems(v => !v)}
        />
        {openItems && (
          <div className="pl-2 space-y-3">
            <SelectedTable
              rows={selectedItems.map(r => ({ id: r.itemId, name: r.name, badge: r.category ?? undefined, badgeColor: 'bg-blue-500/10 text-blue-400', quantity: r.quantity, unitCost: r.unitCost, subtotal: r.subtotal, isFixed: r.isFixed }))}
              colLabel="Item"
              onQtyChange={(id, qty) => updateItemQty(id, qty)}
              onRemove={id => removeItem(id)}
            />
            <div className="space-y-2">
              <Input
                placeholder="Filtrar items disponibles..."
                value={searchItems}
                onChange={e => setSearchItems(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              />
              <AvailableList
                items={filteredItems.map(i => ({
                  id: i.id,
                  name: i.name,
                  sub: [i.category, i.supplier?.name].filter(Boolean).join(' · '),
                  cost: formatCOP(i.total),
                }))}
                onAdd={addItem}
                emptyMsg={searchItems ? 'Sin resultados' : 'No hay items disponibles'}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── MENAJE ── */}
      <div className="space-y-3">
        <SectionHeader
          icon={<UtensilsCrossed className="w-4 h-4 text-orange-400" />}
          title="Menaje"
          selected={selectedMenaje.length}
          total={allMenaje.filter(m => m.isActive).length}
          open={openMenaje}
          onToggle={() => setOpenMenaje(v => !v)}
        />
        {openMenaje && (
          <div className="pl-2 space-y-3">
            <SelectedTable
              rows={selectedMenaje.map(r => ({ id: r.menajeId, name: r.name, badge: r.category ?? undefined, badgeColor: 'bg-purple-500/10 text-purple-400', quantity: r.quantity, unitCost: r.unitCost, subtotal: r.subtotal, isFixed: r.isFixed }))}
              colLabel="Menaje"
              onQtyChange={(id, qty) => updateMenajeQty(id, qty)}
              onRemove={id => removeMenaje(id)}
            />
            <div className="space-y-2">
              <p className="text-xs text-gray-500 pl-1">La cantidad y el total se toman del registro en menaje y no son editables.</p>
              <Input
                placeholder="Filtrar menaje disponible..."
                value={searchMenaje}
                onChange={e => setSearchMenaje(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              />
              <AvailableList
                items={filteredMenaje.map(m => ({
                  id: m.id,
                  name: m.name,
                  sub: [m.category, `Stock: ${m.totalQuantity}`].filter(Boolean).join(' · '),
                  cost: formatCOP(m.total),
                }))}
                onAdd={addMenaje}
                emptyMsg={searchMenaje ? 'Sin resultados' : 'No hay menaje disponible'}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── MENUS ── */}
      <div className="space-y-3">
        <SectionHeader
          icon={<BookOpen className="w-4 h-4 text-orange-400" />}
          title="Menús"
          selected={selectedMenus.length}
          total={allMenusCustom.filter(m => m.isActive).length + allMenusFromItems.filter(m => m.isActive).length}
          open={openMenus}
          onToggle={() => setOpenMenus(v => !v)}
        />
        {openMenus && (
          <div className="pl-2 space-y-3">
            <SelectedTable
              rows={selectedMenus.map(r => ({
                id: `${r.menuType}-${r.menuId}`,
                name: r.menuName,
                badge: r.menuType === 'CUSTOM' ? 'Personalizado' : 'Por Items',
                badgeColor: r.menuType === 'CUSTOM' ? 'bg-violet-500/10 text-violet-400' : 'bg-blue-500/10 text-blue-400',
                quantity: r.quantity,
                unitCost: r.unitCost,
                subtotal: r.subtotal,
                isFixed: r.isFixed,
                qtyLabel: r.menuType === 'CUSTOM' ? 'platos' : undefined,
              }))}
              colLabel="Menú"
              onQtyChange={(id, qty) => {
                const [menuType, ...rest] = id.split('-')
                updateMenuQty(rest.join('-'), menuType, qty)
              }}
              onRemove={id => {
                const [menuType, ...rest] = id.split('-')
                removeMenu(rest.join('-'), menuType)
              }}
            />
            <div className="space-y-2">
              <div className="flex gap-2">
                {(['CUSTOM', 'FROM_ITEMS'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setMenuTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${menuTab === tab ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
                  >
                    {tab === 'CUSTOM' ? `Personalizados (${allMenusCustom.filter(m => m.isActive).length})` : `Por Items (${allMenusFromItems.filter(m => m.isActive).length})`}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Filtrar menús..."
                value={searchMenus}
                onChange={e => setSearchMenus(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              />
              {menuTab === 'CUSTOM' ? (
                <AvailableList
                  items={availableMenusCustom.map(m => ({ id: m.id, name: m.name, sub: m.menuType ?? undefined, cost: formatCOP(m.total) }))}
                  onAdd={addMenuCustom}
                  emptyMsg={searchMenus ? 'Sin resultados' : 'No hay menús personalizados'}
                />
              ) : (
                <AvailableList
                  items={availableMenusFromItems.map(m => ({ id: m.id, name: m.name, sub: m.menuType ?? undefined, cost: formatCOP(m.useCustomTotal ? m.customTotal : m.computedTotal) }))}
                  onAdd={addMenuFromItems}
                  emptyMsg={searchMenus ? 'Sin resultados' : 'No hay menús por items'}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── PERSONAL ── */}
      <div className="space-y-3">
        <SectionHeader
          icon={<UserCheck className="w-4 h-4 text-orange-400" />}
          title="Personal"
          selected={selectedStaff.length}
          total={allStaffFree.filter(s => s.isActive).length + allStaffCompany.filter(s => s.isActive).length}
          open={openStaff}
          onToggle={() => setOpenStaff(v => !v)}
        />
        {openStaff && (
          <div className="pl-2 space-y-3">
            <SelectedTable
              rows={selectedStaff.map(r => ({
                id: `${r.staffType}-${r.staffId}`,
                name: r.staffName,
                badge: r.staffType === 'FREELANCE' ? 'Freelance' : 'Empresa',
                badgeColor: r.staffType === 'FREELANCE' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400',
                quantity: r.quantity,
                unitCost: r.unitCost,
                subtotal: r.subtotal,
                isFixed: r.isFixed,
              }))}
              colLabel="Personal"
              onQtyChange={(id, qty) => {
                const [staffType, ...rest] = id.split('-')
                updateStaffQty(rest.join('-'), staffType, qty)
              }}
              onRemove={id => {
                const [staffType, ...rest] = id.split('-')
                removeStaff(rest.join('-'), staffType)
              }}
            />
            <div className="space-y-2">
              <div className="flex gap-2">
                {(['FREELANCE', 'COMPANY'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStaffTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${staffTab === tab ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
                  >
                    {tab === 'FREELANCE' ? `Freelance (${allStaffFree.filter(s => s.isActive).length})` : `Por Empresa (${allStaffCompany.filter(s => s.isActive).length})`}
                  </button>
                ))}
              </div>
              {staffTab === 'COMPANY' && (
                <p className="text-xs text-gray-500 pl-1">La cantidad se toma del número de personas registrado en el personal de empresa.</p>
              )}
              <Input
                placeholder="Filtrar personal..."
                value={searchStaff}
                onChange={e => setSearchStaff(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              />
              {staffTab === 'FREELANCE' ? (
                <AvailableList
                  items={availableStaffFree.map(s => ({
                    id: s.id,
                    name: s.fullName,
                    sub: [s.role, s.city].filter(Boolean).join(' · '),
                    cost: formatCOP(n(s.ratePerShift) || n(s.ratePerHour)),
                  }))}
                  onAdd={addStaffFree}
                  emptyMsg={searchStaff ? 'Sin resultados' : 'No hay personal freelance'}
                />
              ) : (
                <AvailableList
                  items={availableStaffCompany.map(s => ({
                    id: s.id,
                    name: s.name ?? 'Sin nombre',
                    sub: [s.role, s.staffCount ? `${s.staffCount} personas` : null].filter(Boolean).join(' · '),
                    cost: formatCOP(s.total),
                  }))}
                  onAdd={addStaffCompany}
                  emptyMsg={searchStaff ? 'Sin resultados' : 'No hay personal de empresa'}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Resumen de costos ── */}
      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-orange-400" />
          <span className="font-semibold text-gray-200">Resumen de costos</span>
        </div>

        <div className="space-y-1.5 text-sm">
          {[
            { label: `Items (${selectedItems.length})`,   val: selectedItems.reduce((s, r)  => s + n(r.subtotal), 0) },
            { label: `Menaje (${selectedMenaje.length})`, val: selectedMenaje.reduce((s, r) => s + n(r.subtotal), 0) },
            { label: `Menús (${selectedMenus.length})`,   val: selectedMenus.reduce((s, r)  => s + n(r.subtotal), 0) },
            { label: `Personal (${selectedStaff.length})`,val: selectedStaff.reduce((s, r)  => s + n(r.subtotal), 0) },
          ].map(({ label, val }) => (
            <div key={label} className="flex justify-between text-gray-400">
              <span>{label}</span>
              <span className="font-mono">{formatCOP(val)}</span>
            </div>
          ))}
          <div className="border-t border-orange-500/20 pt-1.5 flex justify-between text-gray-300 font-medium">
            <span className="flex items-center gap-1"><Calculator className="w-3.5 h-3.5" /> Total calculado</span>
            <span className="font-mono text-orange-300">{formatCOP(computedTotal)}</span>
          </div>
        </div>

        <div className="border-t border-orange-500/20 pt-3 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomTotal}
              onChange={e => setUseCustomTotal(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500"
            />
            <Tag className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-sm text-gray-300">Usar valor total personalizado</span>
          </label>

          {useCustomTotal && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 shrink-0">Total personalizado:</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={customTotalInput}
                onChange={e => setCustomTotalInput(e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-1.5 rounded-lg bg-gray-900/50 border border-orange-500/30 text-gray-100 text-sm focus:outline-none focus:border-orange-500 transition-colors font-mono"
              />
            </div>
          )}

          <div className="flex justify-between items-center pt-1">
            <span className="text-sm font-semibold text-gray-200">
              Total del paquete {useCustomTotal && <span className="text-xs text-orange-400">(personalizado)</span>}
            </span>
            <span className="text-xl font-bold text-orange-400 font-mono">{formatCOP(displayTotal)}</span>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : (
            <><CheckCircle2 className="w-4 h-4 mr-2" />Guardar paquete</>
          )}
        </Button>
      </div>
    </form>
  )
}
