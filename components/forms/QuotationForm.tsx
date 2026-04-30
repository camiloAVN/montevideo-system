'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  quotationSchema,
  QuotationFormData,
  QuotationCateringLineFormData,
  Quotation,
  statusLabels,
  QuotationStatus,
} from '@/lib/validations/quotation'
import { InventoryItem } from '@/lib/validations/inventory'
import { ItemGroup } from '@/lib/validations/itemGroup'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  Plus, Trash2, Search, Package, Package2, X, ChevronDown, ChevronUp,
  Briefcase, UtensilsCrossed, Users2,
} from 'lucide-react'
import { format, addDays } from 'date-fns'

type ConceptWithSupplier = {
  id: string
  name: string
  description: string | null
  unitPrice: number | null
  markupPercentage: number | null
  category: string | null
  supplier?: { id: string; name: string; contactName?: string | null } | null
}

type CateringCatalogItem = {
  id: string
  name: string
  category: string | null
  total: number | string | null
  totalQuantity?: number | null
  description?: string | null
}

type CateringPackageCatalog = {
  id: string
  name: string
  description: string | null
  computedTotal: number | string | null
  customTotal: number | string | null
  useCustomTotal: boolean
}

type PersonalStaffCatalog = {
  id: string
  name: string
  shiftRate: number | string | null
  category?: { name: string } | null
}

type CateringStaffFreelanceCatalog = {
  id: string
  fullName: string
  role: string | null
  ratePerShift: number | string | null
}

type CateringStaffCompanyCatalog = {
  id: string
  name: string | null
  role: string | null
  staffCount: number | null
  costPerShift: number | string | null
  total: number | string | null
  supplier?: { id: string; name: string } | null
}

type CateringTab = 'items' | 'menaje' | 'paquetes' | 'personal'
type CateringPersonalSubTab = 'freelance' | 'empresa'

interface QuotationFormProps {
  quotation?: Quotation | null
  onSubmit: (data: QuotationFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

const typeLabel: Record<string, string> = {
  'catering-item': 'Item',
  'catering-menaje': 'Menaje',
  'catering-paquete': 'Paquete',
  'catering-staff': 'Personal Catering',
  'catering-staff-freelance': 'Personal Freelance',
  'catering-staff-company': 'Personal Empresa',
  personal: 'Personal',
}

const typeBadge: Record<string, string> = {
  'catering-item': 'bg-orange-500/20 text-orange-400',
  'catering-menaje': 'bg-amber-500/20 text-amber-400',
  'catering-paquete': 'bg-teal-500/20 text-teal-400',
  'catering-staff': 'bg-cyan-500/20 text-cyan-400',
  'catering-staff-freelance': 'bg-cyan-500/20 text-cyan-400',
  'catering-staff-company': 'bg-indigo-500/20 text-indigo-400',
  personal: 'bg-teal-500/20 text-teal-400',
}

export function QuotationForm({
  quotation,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: QuotationFormProps) {
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([])
  const [concepts, setConcepts] = useState<ConceptWithSupplier[]>([])

  // Catering catalog state
  const [cateringCatalogItems, setCateringCatalogItems] = useState<CateringCatalogItem[]>([])
  const [cateringCatalogMenaje, setCateringCatalogMenaje] = useState<CateringCatalogItem[]>([])
  const [cateringCatalogPackages, setCateringCatalogPackages] = useState<CateringPackageCatalog[]>([])
  const [cateringStaffFreelance, setCateringStaffFreelance] = useState<CateringStaffFreelanceCatalog[]>([])
  const [cateringStaffCompany, setCateringStaffCompany] = useState<CateringStaffCompanyCatalog[]>([])
  const [personalCatalog, setPersonalCatalog] = useState<PersonalStaffCatalog[]>([])

  const [loadingData, setLoadingData] = useState(true)
  const [showItemSearch, setShowItemSearch] = useState(false)
  const [showGroupSearch, setShowGroupSearch] = useState(false)
  const [showConceptSearch, setShowConceptSearch] = useState(false)
  const [showCateringModal, setShowCateringModal] = useState(false)
  const [showPersonalModal, setShowPersonalModal] = useState(false)
  const [cateringTab, setCateringTab] = useState<CateringTab>('items')
  const [cateringPersonalSubTab, setCateringPersonalSubTab] = useState<CateringPersonalSubTab>('freelance')
  const [cateringSearch, setCateringSearch] = useState('')
  const [personalSearch, setPersonalSearch] = useState('')
  const [itemSearch, setItemSearch] = useState('')
  const [groupSearch, setGroupSearch] = useState('')
  const [conceptSearch, setConceptSearch] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set())

  const defaultValidUntil = format(addDays(new Date(), 30), 'yyyy-MM-dd')

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: quotation
      ? {
          title: quotation.title,
          description: quotation.description || '',
          clientId: quotation.clientId,
          projectId: quotation.projectId || '',
          status: quotation.status,
          validUntil: format(new Date(quotation.validUntil), 'yyyy-MM-dd'),
          discount: quotation.discount?.toString() || '0',
          tax: '19',
          notes: quotation.notes || '',
          terms: quotation.terms || '',
          items: quotation.items.map((item) => ({
            inventoryItemId: item.inventoryItemId || null,
            description: item.description,
            category: item.category || '',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          groups: quotation.groups?.map((g) => ({
            groupId: g.groupId,
            name: g.name,
            description: g.description || '',
            unitPrice: Number(g.unitPrice),
            quantity: g.quantity,
          })) || [],
          conceptItems: quotation.conceptItems?.map((c) => ({
            conceptId: c.conceptId,
            name: c.name,
            description: c.description || '',
            basePrice: Number(c.basePrice),
            markupType: c.markupType,
            markupValue: Number(c.markupValue),
            unitPrice: Number(c.unitPrice),
            quantity: c.quantity,
          })) || [],
          cateringLines: quotation.cateringLines?.map((l) => ({
            type: l.type,
            refId: l.refId || null,
            description: l.description,
            category: l.category || null,
            people: l.people,
            shifts: l.shifts,
            quantity: l.quantity,
            unitPrice: Number(l.unitPrice),
            total: Number(l.total),
            order: l.order,
          })) || [],
        }
      : {
          status: 'DRAFT' as QuotationStatus,
          validUntil: defaultValidUntil,
          discount: '0',
          tax: '19',
          items: [],
          groups: [],
          conceptItems: [],
          cateringLines: [],
        },
  })

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items',
  })

  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: 'groups',
  })

  const { fields: conceptFields, append: appendConcept, remove: removeConcept } = useFieldArray({
    control,
    name: 'conceptItems',
  })

  const { fields: cateringFields, append: appendCateringLine, remove: removeCateringLine } = useFieldArray({
    control,
    name: 'cateringLines',
  })

  const watchedItems = watch('items')
  const watchedGroups = watch('groups')
  const watchedConceptItems = watch('conceptItems')
  const watchedCateringLines = watch('cateringLines')
  const watchedDiscount = watch('discount')
  const watchedTax = watch('tax')

  const itemsSubtotal = watchedItems?.reduce((acc, item) => {
    return acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
  }, 0) || 0

  const groupsSubtotal = watchedGroups?.reduce((acc, group) => {
    return acc + (Number(group.quantity) || 0) * (Number(group.unitPrice) || 0)
  }, 0) || 0

  const conceptsSubtotal = watchedConceptItems?.reduce((acc, concept) => {
    return acc + (Number(concept.quantity) || 0) * (Number(concept.unitPrice) || 0)
  }, 0) || 0

  const computeCateringLineTotal = (line: QuotationCateringLineFormData | null | undefined) => {
    if (!line) return 0
    const unitPrice = Number(line.unitPrice) || 0
    if (line.type === 'personal' || line.type === 'catering-staff' || line.type === 'catering-staff-freelance') {
      return unitPrice * (Number(line.people) || 1) * (Number(line.shifts) || 1)
    }
    if (line.type === 'catering-menaje' || line.type === 'catering-staff-company') {
      return unitPrice
    }
    return unitPrice * (Number(line.quantity) || 1)
  }

  const cateringSubtotal = watchedCateringLines?.reduce((acc, line) => {
    return acc + computeCateringLineTotal(line)
  }, 0) || 0

  const cateringItemsSubtotal = watchedCateringLines
    ?.filter(l => l?.type !== 'personal')
    .reduce((acc, line) => acc + computeCateringLineTotal(line), 0) || 0

  const personalSubtotal = watchedCateringLines
    ?.filter(l => l?.type === 'personal')
    .reduce((acc, line) => acc + computeCateringLineTotal(line), 0) || 0

  const cateringOnlyCount = cateringFields.filter((_, i) => watchedCateringLines?.[i]?.type !== 'personal').length
  const personalOnlyCount = cateringFields.filter((_, i) => watchedCateringLines?.[i]?.type === 'personal').length

  const subtotal = itemsSubtotal + groupsSubtotal + conceptsSubtotal + cateringSubtotal
  const discount = Number(watchedDiscount) || 0
  const taxRate = Number(watchedTax) || 19
  const subtotalAfterDiscount = subtotal - discount
  const taxAmount = subtotalAfterDiscount * (taxRate / 100)
  const total = subtotalAfterDiscount + taxAmount

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, projectsRes, inventoryRes, groupsRes, conceptsRes,
          cItemsRes, cMenajeRes, cPackagesRes, staffRes,
          cFreelanceRes, cCompanyRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/projects'),
          fetch('/api/inventory?status=IN'),
          fetch('/api/item-groups'),
          fetch('/api/concepts?isActive=true'),
          fetch('/api/catering/items'),
          fetch('/api/catering/menaje'),
          fetch('/api/catering/packages'),
          fetch('/api/personal/staff'),
          fetch('/api/catering/staff/freelance'),
          fetch('/api/catering/staff/company'),
        ])

        if (clientsRes.ok) setClients(await clientsRes.json())
        if (projectsRes.ok) setProjects(await projectsRes.json())
        if (inventoryRes.ok) setInventoryItems(await inventoryRes.json())
        if (groupsRes.ok) setItemGroups(await groupsRes.json())
        if (conceptsRes.ok) setConcepts(await conceptsRes.json())
        if (cItemsRes.ok) setCateringCatalogItems(await cItemsRes.json())
        if (cMenajeRes.ok) setCateringCatalogMenaje(await cMenajeRes.json())
        if (cPackagesRes.ok) setCateringCatalogPackages(await cPackagesRes.json())
        if (staffRes.ok) setPersonalCatalog(await staffRes.json())
        if (cFreelanceRes.ok) setCateringStaffFreelance(await cFreelanceRes.json())
        if (cCompanyRes.ok) setCateringStaffCompany(await cCompanyRes.json())
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

const handleAddInventoryItem = (item: InventoryItem) => {
    const rentalPrice = item.product?.rentalPrice
      ? Number(item.product.rentalPrice)
      : item.product?.unitPrice
        ? Number(item.product.unitPrice)
        : 0

    appendItem({
      inventoryItemId: item.id,
      description: item.product?.name || '',
      category: '',
      quantity: 1,
      unitPrice: rentalPrice,
    })

    setShowItemSearch(false)
    setItemSearch('')
  }

  const handleAddGroup = (group: ItemGroup) => {
    const defaultPrice = group.items?.reduce((acc, item) => {
      const price = item.inventoryItem?.product?.rentalPrice
        ? Number(item.inventoryItem.product.rentalPrice)
        : 0
      return acc + price * (item.quantity || 1)
    }, 0) || 0

    appendGroup({
      groupId: group.id,
      name: group.name,
      description: group.description || '',
      unitPrice: defaultPrice,
      quantity: 1,
    })

    setShowGroupSearch(false)
    setGroupSearch('')
  }

const handleAddConcept = (concept: ConceptWithSupplier) => {
    const basePrice = concept.unitPrice ? Number(concept.unitPrice) : 0
    const markupPct = concept.markupPercentage ? Number(concept.markupPercentage) : 0
    const finalPrice = Math.round(basePrice * (1 + markupPct / 100))
    appendConcept({
      conceptId: concept.id,
      name: concept.name,
      description: concept.description || '',
      basePrice,
      markupType: 'PERCENTAGE',
      markupValue: markupPct,
      unitPrice: finalPrice,
      quantity: 1,
    })
    setShowConceptSearch(false)
    setConceptSearch('')
  }

  const handleAddCateringItem = (item: CateringCatalogItem) => {
    const unitPrice = Number(item.total) || 0
    appendCateringLine({
      type: 'catering-item',
      refId: item.id,
      description: item.name,
      category: item.category || null,
      people: 1,
      shifts: 1,
      quantity: 1,
      unitPrice,
      total: unitPrice,
      order: 0,
    })
    setShowCateringModal(false)
    setCateringSearch('')
  }

  const handleAddCateringMenaje = (item: CateringCatalogItem) => {
    const dbTotal = Number(item.total) || 0
    const quantity = Number(item.totalQuantity) || 1
    appendCateringLine({
      type: 'catering-menaje',
      refId: item.id,
      description: item.name,
      category: item.category || null,
      people: 1,
      shifts: 1,
      quantity,
      unitPrice: dbTotal,
      total: dbTotal,
      order: 0,
    })
    setShowCateringModal(false)
    setCateringSearch('')
  }

  const handleAddCateringPackage = (pkg: CateringPackageCatalog) => {
    const custom = Number(pkg.customTotal) || 0
    const computed = Number(pkg.computedTotal) || 0
    const unitPrice = pkg.useCustomTotal ? (custom || computed) : (computed || custom)
    appendCateringLine({
      type: 'catering-paquete',
      refId: pkg.id,
      description: pkg.name,
      category: null,
      people: 1,
      shifts: 1,
      quantity: 1,
      unitPrice,
      total: unitPrice,
      order: 0,
    })
    setShowCateringModal(false)
    setCateringSearch('')
  }

  const handleAddPersonal = (staff: PersonalStaffCatalog) => {
    const unitPrice = Number(staff.shiftRate) || 0
    appendCateringLine({
      type: 'personal',
      refId: staff.id,
      description: staff.category?.name || staff.name,
      category: staff.category?.name || null,
      people: 1,
      shifts: 1,
      quantity: 1,
      unitPrice,
      total: unitPrice,
      order: 0,
    })
    setShowPersonalModal(false)
    setPersonalSearch('')
  }

  const handleAddCateringStaffFreelance = (staff: CateringStaffFreelanceCatalog) => {
    const unitPrice = Number(staff.ratePerShift) || 0
    appendCateringLine({
      type: 'catering-staff-freelance',
      refId: staff.id,
      description: staff.role || staff.fullName,
      category: staff.role || null,
      people: 1,
      shifts: 1,
      quantity: 1,
      unitPrice,
      total: unitPrice,
      order: 0,
    })
    setShowCateringModal(false)
    setCateringSearch('')
  }

  const handleAddCateringStaffCompany = (staff: CateringStaffCompanyCatalog) => {
    const dbTotal = Number(staff.total) || Number(staff.costPerShift) || 0
    const staffCount = Number(staff.staffCount) || 1
    appendCateringLine({
      type: 'catering-staff-company',
      refId: staff.id,
      description: staff.role || staff.name || 'Personal Empresa',
      category: staff.role || null,
      people: staffCount,
      shifts: 1,
      quantity: staffCount,
      unitPrice: dbTotal,
      total: dbTotal,
      order: 0,
    })
    setShowCateringModal(false)
    setCateringSearch('')
  }

  const toggleGroupExpanded = (index: number) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedGroups(newExpanded)
  }

  const filteredInventoryItems = inventoryItems.filter(item => {
    if (!itemSearch) return true
    const s = itemSearch.toLowerCase()
    return (
      item.product?.name?.toLowerCase().includes(s) ||
      item.product?.sku?.toLowerCase().includes(s) ||
      item.serialNumber?.toLowerCase().includes(s) ||
      item.assetTag?.toLowerCase().includes(s) ||
      item.product?.brand?.toLowerCase().includes(s)
    )
  })

  const filteredGroups = itemGroups.filter(group => {
    if (!groupSearch) return true
    const s = groupSearch.toLowerCase()
    return (
      group.name?.toLowerCase().includes(s) ||
      group.description?.toLowerCase().includes(s)
    )
  })

  const addedItemIds = watchedItems?.filter(item => item.inventoryItemId).map(item => item.inventoryItemId) || []
  const addedGroupIds = watchedGroups?.map(g => g.groupId) || []

  const availableItems = filteredInventoryItems.filter(item => !addedItemIds.includes(item.id))
  const availableGroups = filteredGroups.filter(group => !addedGroupIds.includes(group.id))

  const filteredConcepts = concepts.filter(concept => {
    if (!conceptSearch) return true
    const s = conceptSearch.toLowerCase()
    return (
      concept.name?.toLowerCase().includes(s) ||
      concept.description?.toLowerCase().includes(s) ||
      concept.supplier?.name?.toLowerCase().includes(s) ||
      concept.category?.toLowerCase().includes(s)
    )
  })

  const getFilteredCatalog = () => {
    const s = cateringSearch.toLowerCase()
    if (cateringTab === 'items') {
      return cateringCatalogItems.filter(i =>
        !s || i.name.toLowerCase().includes(s) || (i.category || '').toLowerCase().includes(s)
      )
    }
    if (cateringTab === 'menaje') {
      return cateringCatalogMenaje.filter(i =>
        !s || i.name.toLowerCase().includes(s) || (i.category || '').toLowerCase().includes(s)
      )
    }
    if (cateringTab === 'paquetes') {
      return cateringCatalogPackages.filter(i =>
        !s || i.name.toLowerCase().includes(s) || (i.description || '').toLowerCase().includes(s)
      )
    }
    return []
  }

  const getFilteredCateringStaffFreelance = () => {
    const s = cateringSearch.toLowerCase()
    return cateringStaffFreelance.filter(i =>
      !s || i.fullName.toLowerCase().includes(s) || (i.role || '').toLowerCase().includes(s)
    )
  }

  const getFilteredCateringStaffCompany = () => {
    const s = cateringSearch.toLowerCase()
    return cateringStaffCompany.filter(i =>
      !s || (i.name || '').toLowerCase().includes(s) || (i.role || '').toLowerCase().includes(s) ||
      (i.supplier?.name || '').toLowerCase().includes(s)
    )
  }

  const getFilteredPersonal = () => {
    const s = personalSearch.toLowerCase()
    return personalCatalog.filter(i =>
      !s || i.name.toLowerCase().includes(s) || (i.category?.name || '').toLowerCase().includes(s)
    )
  }

  const getGroupDetails = (groupId: string) => itemGroups.find(g => g.id === groupId)

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))

  const clientOptions = [
    { value: '', label: 'Selecciona un cliente' },
    ...clients.map((client) => ({
      value: client.id,
      label: `${client.name}${client.company ? ` - ${client.company}` : ''}`,
    })),
  ]

  const projectOptions = [
    { value: '', label: 'Sin proyecto asociado' },
    ...projects.map((project) => ({ value: project.id, label: project.title })),
  ]

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Informacion General</h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Titulo de la Cotizacion *"
                  placeholder="Alquiler de equipos para evento corporativo"
                  error={errors.title?.message}
                  {...register('title')}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Descripcion"
                  placeholder="Describe el alcance de la cotizacion..."
                  rows={3}
                  error={errors.description?.message}
                  {...register('description')}
                />
              </div>

              <Select
                label="Cliente *"
                options={clientOptions}
                error={errors.clientId?.message}
                {...register('clientId')}
              />

              <Select
                label="Proyecto Asociado"
                options={projectOptions}
                error={errors.projectId?.message}
                {...register('projectId')}
              />

              <Select
                label="Estado *"
                options={statusOptions}
                error={errors.status?.message}
                {...register('status')}
              />

              <Input
                label="Valida hasta *"
                type="date"
                error={errors.validUntil?.message}
                {...register('validUntil')}
              />
            </div>
          </Card.Content>
        </Card>

        {/* Groups Section */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package2 className="w-5 h-5 text-cyan-400" />
                  Grupos / Paquetes
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Agrega paquetes de equipos predefinidos
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowGroupSearch(true)}
              >
                <Package2 className="w-4 h-4 mr-2" />
                Agregar Grupo
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            {groupFields.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Package2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No hay grupos agregados</p>
                <p className="text-sm mt-1">Haz clic en &quot;Agregar Grupo&quot; para incluir un paquete</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groupFields.map((field, index) => {
                  const groupQty = Number(watchedGroups?.[index]?.quantity) || 0
                  const groupPrice = Number(watchedGroups?.[index]?.unitPrice) || 0
                  const groupTotal = groupQty * groupPrice
                  const groupDetails = getGroupDetails(watchedGroups?.[index]?.groupId || '')
                  const isExpanded = expandedGroups.has(index)

                  return (
                    <div key={field.id} className="rounded-lg border bg-cyan-500/5 border-cyan-500/20">
                      <div className="p-4">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-12 md:col-span-5">
                            <div className="flex items-center gap-2 mb-1">
                              <label className="block text-sm font-medium text-gray-300">Nombre del Grupo</label>
                              <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-400">Paquete</span>
                            </div>
                            <Input placeholder="Nombre del grupo" {...register(`groups.${index}.name`)} />
                            <input type="hidden" {...register(`groups.${index}.groupId`)} />
                            <input type="hidden" {...register(`groups.${index}.description`)} />
                          </div>
                          <div className="col-span-4 md:col-span-2">
                            <Input label="Cantidad" type="number" min="1" step="1"
                              {...register(`groups.${index}.quantity`, { valueAsNumber: true })} />
                          </div>
                          <div className="col-span-4 md:col-span-2">
                            <Input label="Precio" type="number" min="0" step="1" placeholder="0"
                              {...register(`groups.${index}.unitPrice`, { valueAsNumber: true })} />
                          </div>
                          <div className="col-span-3 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Total</label>
                            <div className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-green-400 font-medium">
                              {formatCurrency(groupTotal)}
                            </div>
                          </div>
                          <div className="col-span-1 flex items-end justify-center pb-1 gap-1">
                            <Button type="button" variant="ghost" size="sm"
                              onClick={() => toggleGroupExpanded(index)}>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                            <Button type="button" variant="ghost" size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => removeGroup(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && groupDetails?.items && (
                        <div className="px-4 pb-4">
                          <div className="bg-gray-900/50 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-2 font-medium">Items incluidos en este paquete:</p>
                            <div className="space-y-1">
                              {groupDetails.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm py-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-300">{item.inventoryItem?.product?.name || 'Item'}</span>
                                    {item.inventoryItem?.product?.category && (
                                      <span className="px-1.5 py-0.5 rounded text-xs"
                                        style={{
                                          backgroundColor: item.inventoryItem.product.category.color
                                            ? `${item.inventoryItem.product.category.color}20` : undefined,
                                          color: item.inventoryItem.product.category.color || undefined,
                                        }}>
                                        {item.inventoryItem.product.category.name}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-gray-500 font-mono text-xs">
                                    {item.inventoryItem?.assetTag || item.inventoryItem?.serialNumber || ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Contractor Concepts Section */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-violet-400" />
                  Conceptos de Contratistas
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Agrega servicios de contratistas con margen de ganancia
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowConceptSearch(true)}>
                <Briefcase className="w-4 h-4 mr-2" />
                Agregar Concepto
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            {conceptFields.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No hay conceptos de contratistas agregados</p>
                <p className="text-sm mt-1">Haz clic en &quot;Agregar Concepto&quot; para incluir un servicio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conceptFields.map((field, index) => {
                  const basePrice = Number(watchedConceptItems?.[index]?.basePrice) || 0
                  const markupValue = Number(watchedConceptItems?.[index]?.markupValue) || 0
                  const unitPrice = Number(watchedConceptItems?.[index]?.unitPrice) || 0
                  const qty = Number(watchedConceptItems?.[index]?.quantity) || 1
                  const conceptTotal = qty * unitPrice

                  return (
                    <div key={field.id} className="rounded-lg border bg-violet-500/5 border-violet-500/20 p-4">
                      {/* Hidden fields for backend */}
                      <input type="hidden" {...register(`conceptItems.${index}.conceptId`)} />
                      <input type="hidden" {...register(`conceptItems.${index}.description`)} />
                      <input type="hidden" {...register(`conceptItems.${index}.basePrice`, { valueAsNumber: true })} />
                      <input type="hidden" {...register(`conceptItems.${index}.markupType`)} />
                      <input type="hidden" {...register(`conceptItems.${index}.markupValue`, { valueAsNumber: true })} />
                      <input type="hidden" {...register(`conceptItems.${index}.unitPrice`, { valueAsNumber: true })} />

                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-8">
                          <div className="flex items-center gap-2 mb-1">
                            <label className="block text-sm font-medium text-gray-300">Concepto</label>
                            <span className="px-2 py-0.5 rounded text-xs bg-violet-500/20 text-violet-400">Servicio</span>
                          </div>
                          <Input placeholder="Nombre del concepto" {...register(`conceptItems.${index}.name`)} />
                        </div>

                        <div className="col-span-4 md:col-span-2">
                          <Input label="Cant." type="number" min="1" step="1"
                            {...register(`conceptItems.${index}.quantity`, { valueAsNumber: true })} />
                        </div>

                        <div className="col-span-8 md:col-span-2 flex items-end justify-end">
                          <Button type="button" variant="ghost" size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mb-0.5"
                            onClick={() => removeConcept(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="col-span-12 pt-2 border-t border-violet-500/10">
                          <div className="grid grid-cols-3 gap-4 text-sm text-center">
                            <div>
                              <span className="text-gray-500 block text-xs">Precio base</span>
                              <span className="text-gray-300">{formatCurrency(basePrice)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-xs">Ganancia ({markupValue}%)</span>
                              <span className="text-emerald-400">+{formatCurrency(unitPrice - basePrice)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-xs">Precio final × {qty}</span>
                              <span className="text-violet-300 font-bold">{formatCurrency(conceptTotal)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* ── Catering Section ─────────────────────────────────────────────── */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-orange-400" />
                  Catering
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Items, menaje, paquetes y personal de catering
                </p>
              </div>
              <Button type="button" variant="outline" size="sm"
                onClick={() => { setShowCateringModal(true); setCateringTab('items'); setCateringSearch('') }}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Catering
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            {(() => {
              const cateringOnly = cateringFields
                .map((f, i) => ({ field: f, index: i }))
                .filter(({ index: i }) => watchedCateringLines?.[i]?.type !== 'personal')
              if (cateringOnly.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-400">
                    <UtensilsCrossed className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>No hay items de catering</p>
                    <p className="text-sm mt-1">Haz clic en &quot;Agregar Catering&quot; para incluir items, menaje, paquetes o personal</p>
                  </div>
                )
              }
              return (
                <div className="space-y-3">
                  {cateringOnly.map(({ field, index }) => {
                    const line = watchedCateringLines?.[index]
                    const lineUnitPrice = Number(line?.unitPrice) || 0
                    const lineQty = Number(line?.quantity) || 1
                    const linePeople = Number(line?.people) || 1
                    const lineShifts = Number(line?.shifts) || 1
                    const isMenaje = line?.type === 'catering-menaje'
                    const isCompanyStaff = line?.type === 'catering-staff-company'
                    const isEditableStaff = line?.type === 'catering-staff' || line?.type === 'catering-staff-freelance'
                    const isFixed = isMenaje || isCompanyStaff
                    const lineTotal = computeCateringLineTotal(line)
                    return (
                      <div key={field.id}
                        className="rounded-lg border bg-orange-500/5 border-orange-500/20 p-4">
                        <input type="hidden" {...register(`cateringLines.${index}.type`)} />
                        <input type="hidden" {...register(`cateringLines.${index}.refId`)} />
                        <input type="hidden" {...register(`cateringLines.${index}.order`)} />
                        <input type="hidden" {...register(`cateringLines.${index}.total`, { valueAsNumber: true })} />

                        {isEditableStaff ? (
                          // Freelance / legacy catering-staff: editable people × shifts × rate
                          <>
                            <input type="hidden" {...register(`cateringLines.${index}.quantity`, { valueAsNumber: true })} />
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-12 md:col-span-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <label className="block text-sm font-medium text-gray-300">Categoría</label>
                                  <span className={`px-2 py-0.5 rounded text-xs ${typeBadge[line?.type || 'catering-staff-freelance']}`}>
                                    {typeLabel[line?.type || 'catering-staff-freelance']}
                                  </span>
                                </div>
                                <Input placeholder="Categoría / Rol"
                                  {...register(`cateringLines.${index}.description`)} />
                                <input type="hidden" {...register(`cateringLines.${index}.category`)} />
                              </div>
                              <div className="col-span-4 md:col-span-2">
                                <Input label="Personas" type="number" min="1" step="1"
                                  {...register(`cateringLines.${index}.people`, {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                      const people = Number(e.target.value) || 1
                                      const shifts = Number(watchedCateringLines?.[index]?.shifts) || 1
                                      const price = Number(watchedCateringLines?.[index]?.unitPrice) || 0
                                      setValue(`cateringLines.${index}.total`, people * shifts * price)
                                    },
                                  })} />
                              </div>
                              <div className="col-span-4 md:col-span-2">
                                <Input label="Turnos" type="number" min="1" step="1"
                                  {...register(`cateringLines.${index}.shifts`, {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                      const shifts = Number(e.target.value) || 1
                                      const people = Number(watchedCateringLines?.[index]?.people) || 1
                                      const price = Number(watchedCateringLines?.[index]?.unitPrice) || 0
                                      setValue(`cateringLines.${index}.total`, people * shifts * price)
                                    },
                                  })} />
                              </div>
                              <div className="col-span-4 md:col-span-2">
                                <Input label="Valor/turno" type="number" min="0" step="1" placeholder="0"
                                  {...register(`cateringLines.${index}.unitPrice`, {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                      const price = Number(e.target.value) || 0
                                      const people = Number(watchedCateringLines?.[index]?.people) || 1
                                      const shifts = Number(watchedCateringLines?.[index]?.shifts) || 1
                                      setValue(`cateringLines.${index}.total`, people * shifts * price)
                                    },
                                  })} />
                              </div>
                              <div className="col-span-3 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Total</label>
                                <div className="px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-green-400 font-medium text-sm whitespace-nowrap">
                                  {formatCurrency(lineTotal)}
                                </div>
                              </div>
                              <div className="col-span-1 flex items-end justify-center pb-1">
                                <Button type="button" variant="ghost" size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  onClick={() => removeCateringLine(index)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {formatCurrency(lineUnitPrice)} × {linePeople} pers. × {lineShifts} turno{lineShifts !== 1 ? 's' : ''} = {formatCurrency(lineTotal)}
                            </div>
                          </>
                        ) : (
                          // Items, menaje, paquetes
                          <>
                            <input type="hidden" {...register(`cateringLines.${index}.people`, { valueAsNumber: true })} />
                            <input type="hidden" {...register(`cateringLines.${index}.shifts`, { valueAsNumber: true })} />
                            <div className="grid grid-cols-12 gap-3">
                              <div className={`col-span-12 ${isFixed ? 'md:col-span-7' : 'md:col-span-5'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <label className="block text-sm font-medium text-gray-300">Descripción</label>
                                  <span className={`px-2 py-0.5 rounded text-xs ${typeBadge[line?.type || 'catering-item']}`}>
                                    {typeLabel[line?.type || 'catering-item']}
                                  </span>
                                </div>
                                <Input placeholder="Descripción"
                                  {...register(`cateringLines.${index}.description`)} />
                                <input type="hidden" {...register(`cateringLines.${index}.category`)} />
                              </div>
                              <div className="col-span-4 md:col-span-2">
                                {isFixed ? (
                                  <>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                      {isCompanyStaff ? 'Personas' : 'Cantidad'}
                                    </label>
                                    <div className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 font-medium text-sm">
                                      {isCompanyStaff ? linePeople : lineQty}
                                    </div>
                                    <input type="hidden" {...register(`cateringLines.${index}.quantity`, { valueAsNumber: true })} />
                                    <input type="hidden" {...register(`cateringLines.${index}.unitPrice`, { valueAsNumber: true })} />
                                  </>
                                ) : (
                                  <Input label="Cantidad" type="number" min="1" step="1"
                                    {...register(`cateringLines.${index}.quantity`, {
                                      valueAsNumber: true,
                                      onChange: (e) => {
                                        const qty = Number(e.target.value) || 1
                                        const price = Number(watchedCateringLines?.[index]?.unitPrice) || 0
                                        setValue(`cateringLines.${index}.total`, qty * price)
                                      },
                                    })} />
                                )}
                              </div>
                              {!isFixed && (
                                <div className="col-span-4 md:col-span-2">
                                  <Input label="Precio unit." type="number" min="0" step="1" placeholder="0"
                                    {...register(`cateringLines.${index}.unitPrice`, {
                                      valueAsNumber: true,
                                      onChange: (e) => {
                                        const price = Number(e.target.value) || 0
                                        const qty = Number(watchedCateringLines?.[index]?.quantity) || 1
                                        setValue(`cateringLines.${index}.total`, price * qty)
                                      },
                                    })} />
                                </div>
                              )}
                              <div className="col-span-3 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Total</label>
                                <div className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-green-400 font-medium text-sm">
                                  {formatCurrency(lineTotal)}
                                </div>
                              </div>
                              <div className="col-span-1 flex items-end justify-center pb-1">
                                <Button type="button" variant="ghost" size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  onClick={() => removeCateringLine(index)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </Card.Content>
        </Card>

        {/* ── Personal Section ─────────────────────────────────────────────── */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-teal-400" />
                  Personal
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Staff por turnos — total = valor/turno × personas × turnos
                </p>
              </div>
              <Button type="button" variant="outline" size="sm"
                onClick={() => { setShowPersonalModal(true); setPersonalSearch('') }}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Personal
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            {(() => {
              const personalOnly = cateringFields
                .map((f, i) => ({ field: f, index: i }))
                .filter(({ index: i }) => watchedCateringLines?.[i]?.type === 'personal')
              if (personalOnly.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-400">
                    <Users2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>No hay personal agregado</p>
                    <p className="text-sm mt-1">Haz clic en &quot;Agregar Personal&quot; para añadir staff</p>
                  </div>
                )
              }
              return (
                <div className="space-y-3">
                  {personalOnly.map(({ field, index }) => {
                    const line = watchedCateringLines?.[index]
                    const lineUnitPrice = Number(line?.unitPrice) || 0
                    const linePeople = Number(line?.people) || 1
                    const lineShifts = Number(line?.shifts) || 1
                    const lineTotal = lineUnitPrice * linePeople * lineShifts
                    return (
                      <div key={field.id}
                        className="rounded-lg border bg-teal-500/5 border-teal-500/20 p-4">
                        <input type="hidden" {...register(`cateringLines.${index}.type`)} />
                        <input type="hidden" {...register(`cateringLines.${index}.refId`)} />
                        <input type="hidden" {...register(`cateringLines.${index}.order`)} />
                        <input type="hidden" {...register(`cateringLines.${index}.total`, { valueAsNumber: true })} />
                        <input type="hidden" {...register(`cateringLines.${index}.quantity`, { valueAsNumber: true })} />

                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-12 md:col-span-4">
                            <div className="flex items-center gap-2 mb-1">
                              <label className="block text-sm font-medium text-gray-300">Nombre</label>
                              <span className="px-2 py-0.5 rounded text-xs bg-teal-500/20 text-teal-400">Personal</span>
                              {line?.category && (
                                <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-400">{line.category}</span>
                              )}
                            </div>
                            <Input placeholder="Nombre del personal"
                              {...register(`cateringLines.${index}.description`)} />
                            <input type="hidden" {...register(`cateringLines.${index}.category`)} />
                          </div>
                          <div className="col-span-4 md:col-span-2">
                            <Input label="Personas" type="number" min="1" step="1"
                              {...register(`cateringLines.${index}.people`, {
                                valueAsNumber: true,
                                onChange: (e) => {
                                  const people = Number(e.target.value) || 1
                                  const shifts = Number(watchedCateringLines?.[index]?.shifts) || 1
                                  const price = Number(watchedCateringLines?.[index]?.unitPrice) || 0
                                  setValue(`cateringLines.${index}.total`, people * shifts * price)
                                },
                              })} />
                          </div>
                          <div className="col-span-4 md:col-span-2">
                            <Input label="Turnos" type="number" min="1" step="1"
                              {...register(`cateringLines.${index}.shifts`, {
                                valueAsNumber: true,
                                onChange: (e) => {
                                  const shifts = Number(e.target.value) || 1
                                  const people = Number(watchedCateringLines?.[index]?.people) || 1
                                  const price = Number(watchedCateringLines?.[index]?.unitPrice) || 0
                                  setValue(`cateringLines.${index}.total`, people * shifts * price)
                                },
                              })} />
                          </div>
                          <div className="col-span-4 md:col-span-2">
                            <Input label="Valor/turno" type="number" min="0" step="1" placeholder="0"
                              {...register(`cateringLines.${index}.unitPrice`, {
                                valueAsNumber: true,
                                onChange: (e) => {
                                  const price = Number(e.target.value) || 0
                                  const people = Number(watchedCateringLines?.[index]?.people) || 1
                                  const shifts = Number(watchedCateringLines?.[index]?.shifts) || 1
                                  setValue(`cateringLines.${index}.total`, people * shifts * price)
                                },
                              })} />
                          </div>
                          <div className="col-span-3 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Total</label>
                            <div className="px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-green-400 font-medium text-sm whitespace-nowrap">
                              {formatCurrency(lineTotal)}
                            </div>
                          </div>
                          <div className="col-span-1 flex items-end justify-center pb-1">
                            <Button type="button" variant="ghost" size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => removeCateringLine(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {formatCurrency(lineUnitPrice)} × {linePeople} pers. × {lineShifts} turno{lineShifts !== 1 ? 's' : ''} = {formatCurrency(lineTotal)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </Card.Content>
        </Card>

        {/* Items del Inventario */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-pink-400" />
                  Items del Inventario
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Equipos registrados en el inventario
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowItemSearch(true)}>
                <Package className="w-4 h-4 mr-2" />
                Del Inventario
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            {(() => {
              const inventoryItems = itemFields
                .map((f, i) => ({ field: f, index: i }))
                .filter(({ index: i }) => !!watchedItems?.[i]?.inventoryItemId)
              if (inventoryItems.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-400">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>No hay items del inventario agregados</p>
                    <p className="text-sm mt-1">Haz clic en &quot;Del Inventario&quot; para agregar equipos</p>
                  </div>
                )
              }
              return (
                <div className="space-y-4">
                  {inventoryItems.map(({ field, index }) => {
                    const itemQty = Number(watchedItems?.[index]?.quantity) || 0
                    const itemPrice = Number(watchedItems?.[index]?.unitPrice) || 0
                    const itemTotal = itemQty * itemPrice
                    return (
                      <div key={field.id}
                        className="grid grid-cols-12 gap-4 p-4 rounded-lg border bg-pink-600/5 border-pink-600/20">
                        <div className="col-span-12 md:col-span-6">
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre del Item</label>
                          <Input placeholder="Nombre del item"
                            error={errors.items?.[index]?.description?.message}
                            {...register(`items.${index}.description`)} />
                          <input type="hidden" {...register(`items.${index}.inventoryItemId`)} />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <Input label="Cantidad *" type="number" min="1" step="1"
                            error={errors.items?.[index]?.quantity?.message}
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <Input label="Precio Unit. *" type="number" min="0" step="1" placeholder="0"
                            error={errors.items?.[index]?.unitPrice?.message}
                            {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} />
                        </div>
                        <div className="col-span-3 md:col-span-1">
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Total</label>
                          <div className="px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-green-400 font-medium text-sm">
                            {formatCurrency(itemTotal)}
                          </div>
                        </div>
                        <div className="col-span-1 flex items-end justify-center pb-1">
                          <Button type="button" variant="ghost" size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => removeItem(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </Card.Content>
        </Card>

        {/* Items Personalizados */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-gray-400" />
                  Items Personalizados
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Conceptos manuales no vinculados al inventario
                </p>
              </div>
              <Button type="button" variant="outline" size="sm"
                onClick={() => appendItem({ inventoryItemId: null, description: '', category: '', quantity: 1, unitPrice: 0 })}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Item
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            {(() => {
              const customItems = itemFields
                .map((f, i) => ({ field: f, index: i }))
                .filter(({ index: i }) => !watchedItems?.[i]?.inventoryItemId)
              if (customItems.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-400">
                    <Plus className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>No hay items personalizados</p>
                    <p className="text-sm mt-1">Haz clic en &quot;Agregar Item&quot; para crear un concepto manual</p>
                  </div>
                )
              }
              return (
                <div className="space-y-4">
                  {customItems.map(({ field, index }) => {
                    const itemQty = Number(watchedItems?.[index]?.quantity) || 0
                    const itemPrice = Number(watchedItems?.[index]?.unitPrice) || 0
                    const itemTotal = itemQty * itemPrice
                    return (
                      <div key={field.id}
                        className="grid grid-cols-12 gap-4 p-4 rounded-lg border bg-gray-900/30 border-gray-800">
                        <div className="col-span-12 md:col-span-4">
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Descripción *</label>
                          <Input placeholder="Descripción del item"
                            error={errors.items?.[index]?.description?.message}
                            {...register(`items.${index}.description`)} />
                          <input type="hidden" {...register(`items.${index}.inventoryItemId`)} />
                        </div>
                        <div className="col-span-12 md:col-span-3">
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Categoría</label>
                          <Input placeholder="Ej: Sonido, Video, Staging…"
                            {...register(`items.${index}.category`)} />
                        </div>
                        <div className="col-span-4 md:col-span-1">
                          <Input label="Cant." type="number" min="1" step="1"
                            error={errors.items?.[index]?.quantity?.message}
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <Input label="Precio Unit." type="number" min="0" step="1" placeholder="0"
                            error={errors.items?.[index]?.unitPrice?.message}
                            {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} />
                        </div>
                        <div className="col-span-3 md:col-span-1">
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Total</label>
                          <div className="px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-green-400 font-medium text-sm">
                            {formatCurrency(itemTotal)}
                          </div>
                        </div>
                        <div className="col-span-1 flex items-end justify-center pb-1">
                          <Button type="button" variant="ghost" size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => removeItem(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            {errors.items?.message && (
              <p className="text-sm text-red-400 mt-4">{errors.items.message}</p>
            )}
          </Card.Content>
        </Card>

        {/* Totals and Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Informacion Adicional</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <Textarea label="Notas" placeholder="Notas adicionales para el cliente..."
                  rows={3} error={errors.notes?.message} {...register('notes')} />
                <Textarea label="Terminos y Condiciones" placeholder="Terminos de pago, garantias, etc..."
                  rows={3} error={errors.terms?.message} {...register('terms')} />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Resumen</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {groupsSubtotal > 0 && (
                  <div className="flex justify-between items-center py-2 text-sm">
                    <span className="text-gray-400">Grupos ({groupFields.length})</span>
                    <span className="text-cyan-400">{formatCurrency(groupsSubtotal)}</span>
                  </div>
                )}
                {conceptsSubtotal > 0 && (
                  <div className="flex justify-between items-center py-2 text-sm">
                    <span className="text-gray-400">Servicios ({conceptFields.length})</span>
                    <span className="text-violet-400">{formatCurrency(conceptsSubtotal)}</span>
                  </div>
                )}
                {cateringItemsSubtotal > 0 && (
                  <div className="flex justify-between items-center py-2 text-sm">
                    <span className="text-gray-400">Catering ({cateringOnlyCount})</span>
                    <span className="text-orange-400">{formatCurrency(cateringItemsSubtotal)}</span>
                  </div>
                )}
                {personalSubtotal > 0 && (
                  <div className="flex justify-between items-center py-2 text-sm">
                    <span className="text-gray-400">Personal ({personalOnlyCount})</span>
                    <span className="text-teal-400">{formatCurrency(personalSubtotal)}</span>
                  </div>
                )}
                {itemsSubtotal > 0 && (
                  <div className="flex justify-between items-center py-2 text-sm">
                    <span className="text-gray-400">Items ({itemFields.length})</span>
                    <span className="text-pink-400">{formatCurrency(itemsSubtotal)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input label="Descuento" type="number" min="0" step="1" placeholder="0"
                      error={errors.discount?.message} {...register('discount')} />
                  </div>
                  <div className="pt-6 text-gray-400">-{formatCurrency(discount)}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input label="IVA (%)" type="number" min="0" max="100" step="1"
                      error={errors.tax?.message} {...register('tax')} />
                  </div>
                  <div className="pt-6 text-gray-400">+{formatCurrency(taxAmount)}</div>
                </div>

                <div className="flex justify-between items-center py-3 border-t-2 border-pink-600/50">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-green-400">{formatCurrency(total)}</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {quotation ? 'Actualizar Cotizacion' : 'Crear Cotizacion'}
          </Button>
        </div>
      </form>

      {/* Catering Modal */}
      {showCateringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCateringModal(false)} />
          <div className="relative bg-gray-900 rounded-xl border border-gray-800 w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <UtensilsCrossed className="w-6 h-6 text-orange-400" />
                  Agregar Catering
                </h3>
                <p className="text-gray-400 text-sm mt-1">Selecciona del catálogo de catering</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowCateringModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs principales */}
            <div className="flex border-b border-gray-800 shrink-0 overflow-x-auto">
              {([
                { key: 'items', label: 'Items', icon: UtensilsCrossed },
                { key: 'menaje', label: 'Menaje', icon: Package },
                { key: 'paquetes', label: 'Paquetes', icon: Package2 },
                { key: 'personal', label: 'Personal', icon: Users2 },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setCateringTab(key); setCateringSearch('') }}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    cateringTab === key
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Sub-tabs solo para personal */}
            {cateringTab === 'personal' && (
              <div className="flex border-b border-gray-800 shrink-0 px-4">
                {([
                  { key: 'freelance', label: 'Freelance' },
                  { key: 'empresa', label: 'Por Empresa' },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setCateringPersonalSubTab(key); setCateringSearch('') }}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      cateringPersonalSubTab === key
                        ? 'border-cyan-500 text-cyan-400'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 border-b border-gray-800 shrink-0">
              <Input
                placeholder="Buscar..."
                value={cateringSearch}
                onChange={(e) => setCateringSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                autoFocus
              />
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {cateringTab === 'personal' ? (
                // Personal de catering
                (() => {
                  const staffList = cateringPersonalSubTab === 'freelance'
                    ? getFilteredCateringStaffFreelance()
                    : getFilteredCateringStaffCompany()
                  if (staffList.length === 0) {
                    return (
                      <div className="text-center py-12 text-gray-400">
                        <Users2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No hay personal disponible</p>
                      </div>
                    )
                  }
                  return (
                    <div className="space-y-2">
                      {staffList.map((staff: any) => {
                        const isFreelance = cateringPersonalSubTab === 'freelance'
                        const name = isFreelance ? staff.fullName : (staff.name || staff.supplier?.name || 'Empresa')
                        const role = staff.role || null
                        const rate = isFreelance
                          ? (Number(staff.ratePerShift) || 0)
                          : (Number(staff.costPerShift) || Number(staff.total) || 0)
                        return (
                          <div
                            key={staff.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-cyan-500/30"
                            onClick={() => isFreelance
                              ? handleAddCateringStaffFreelance(staff)
                              : handleAddCateringStaffCompany(staff)
                            }
                          >
                            <div className="flex-1">
                              <p className="font-medium">{name}</p>
                              {role && <p className="text-sm text-gray-400 mt-0.5">{role}</p>}
                              {!isFreelance && staff.supplier && (
                                <p className="text-xs text-gray-500 mt-0.5">{staff.supplier.name}</p>
                              )}
                            </div>
                            <div className="text-right ml-4 shrink-0">
                              <p className="font-semibold text-green-400">{formatCurrency(rate)}</p>
                              <p className="text-xs text-gray-500">{isFreelance ? 'valor/turno' : 'costo/turno'}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()
              ) : (
                // Items, menaje, paquetes
                (() => {
                  const catalog = getFilteredCatalog() as any[]
                  if (catalog.length === 0) {
                    return (
                      <div className="text-center py-12 text-gray-400">
                        <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No hay elementos disponibles</p>
                      </div>
                    )
                  }
                  return (
                    <div className="space-y-2">
                      {catalog.map((item: any) => {
                        const price = cateringTab === 'paquetes'
                          ? (item.useCustomTotal ? Number(item.customTotal) : Number(item.computedTotal)) || 0
                          : Number(item.total) || 0
                        const categoryName = item.category?.name ?? item.category ?? null
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-orange-500/30"
                            onClick={() => {
                              if (cateringTab === 'items') handleAddCateringItem(item)
                              else if (cateringTab === 'menaje') handleAddCateringMenaje(item)
                              else handleAddCateringPackage(item)
                            }}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium">{item.name}</p>
                                {categoryName && (
                                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-400">
                                    {categoryName}
                                  </span>
                                )}
                                {item.description && (
                                  <p className="text-gray-400 text-sm w-full mt-0.5 line-clamp-1">{item.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-4 shrink-0">
                              <p className="font-semibold text-green-400">{formatCurrency(price)}</p>
                              <p className="text-xs text-gray-500">
                                {cateringTab === 'menaje' ? 'total' : 'precio base'}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()
              )}
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-end shrink-0">
              <Button variant="outline" onClick={() => setShowCateringModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Personal Modal */}
      {showPersonalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPersonalModal(false)} />
          <div className="relative bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Users2 className="w-6 h-6 text-teal-400" />
                  Agregar Personal
                </h3>
                <p className="text-gray-400 text-sm mt-1">Selecciona staff del catálogo</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPersonalModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 border-b border-gray-800 shrink-0">
              <Input
                placeholder="Buscar por nombre o categoría..."
                value={personalSearch}
                onChange={(e) => setPersonalSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                autoFocus
              />
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {(() => {
                const staff = getFilteredPersonal()
                if (staff.length === 0) {
                  return (
                    <div className="text-center py-12 text-gray-400">
                      <Users2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay personal disponible</p>
                    </div>
                  )
                }
                return (
                  <div className="space-y-2">
                    {staff.map((member) => {
                      const rate = Number(member.shiftRate) || 0
                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-teal-500/30"
                          onClick={() => handleAddPersonal(member)}
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">{member.name}</p>
                              {member.category?.name && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-teal-500/20 text-teal-400 mt-1 inline-block">
                                  {member.category.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <p className="font-semibold text-green-400">{formatCurrency(rate)}</p>
                            <p className="text-xs text-gray-500">valor/turno</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-end shrink-0">
              <Button variant="outline" onClick={() => setShowPersonalModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Item Search Modal */}
      {showItemSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowItemSearch(false)} />
          <div className="relative bg-gray-900 rounded-xl border border-gray-800 w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Agregar Item del Inventario</h3>
                <p className="text-gray-400 text-sm mt-1">Selecciona los equipos disponibles para agregar a la cotizacion</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowItemSearch(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 border-b border-gray-800">
              <Input
                placeholder="Buscar por nombre, SKU, serial, marca..."
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {availableItems.length > 0 ? (
                <div className="space-y-2">
                  {availableItems.slice(0, 30).map((item) => (
                    <div key={item.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => handleAddInventoryItem(item)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.product?.name}</p>
                          {item.product?.brand && (
                            <span className="text-xs text-gray-500">{item.product.brand} {item.product.model}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                          <span className="font-mono">{item.product?.sku}</span>
                          {item.serialNumber && <span>S/N: {item.serialNumber}</span>}
                          {item.assetTag && <span>Tag: {item.assetTag}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">
                          {item.product?.rentalPrice
                            ? formatCurrency(Number(item.product.rentalPrice))
                            : item.product?.unitPrice
                              ? formatCurrency(Number(item.product.unitPrice))
                              : '-'}
                        </p>
                        <p className="text-xs text-gray-500">por dia</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No hay items disponibles</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {itemSearch ? 'No se encontraron items con ese criterio' : 'Todos los items disponibles ya fueron agregados'}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-end">
              <Button variant="outline" onClick={() => setShowItemSearch(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Group Search Modal */}
      {showGroupSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGroupSearch(false)} />
          <div className="relative bg-gray-900 rounded-xl border border-gray-800 w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Package2 className="w-6 h-6 text-cyan-400" />
                  Agregar Grupo de Equipos
                </h3>
                <p className="text-gray-400 text-sm mt-1">Selecciona un paquete predefinido para agregar a la cotizacion</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowGroupSearch(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 border-b border-gray-800">
              <Input
                placeholder="Buscar grupo por nombre..."
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {availableGroups.length > 0 ? (
                <div className="space-y-2">
                  {availableGroups.map((group) => {
                    const groupPrice = group.items?.reduce((acc, item) => {
                      const price = item.inventoryItem?.product?.rentalPrice
                        ? Number(item.inventoryItem.product.rentalPrice) : 0
                      return acc + price * (item.quantity || 1)
                    }, 0) || 0

                    return (
                      <div key={group.id}
                        className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-cyan-500/30"
                        onClick={() => handleAddGroup(group)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-lg">{group.name}</p>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-400">
                                {group._count?.items || group.items?.length || 0} items
                              </span>
                            </div>
                            {group.description && <p className="text-gray-400 text-sm mt-1">{group.description}</p>}
                            {group.items && group.items.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {group.items.slice(0, 5).map((item) => (
                                  <span key={item.id} className="px-2 py-0.5 rounded bg-gray-700 text-xs text-gray-300">
                                    {item.inventoryItem?.product?.name || 'Item'}
                                  </span>
                                ))}
                                {group.items.length > 5 && (
                                  <span className="px-2 py-0.5 rounded bg-gray-700 text-xs text-gray-400">
                                    +{group.items.length - 5} mas
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-green-400 text-lg">{formatCurrency(groupPrice)}</p>
                            <p className="text-xs text-gray-500">precio sugerido</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No hay grupos disponibles</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {groupSearch ? 'No se encontraron grupos con ese criterio' : 'Todos los grupos ya fueron agregados o no hay grupos creados'}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-end">
              <Button variant="outline" onClick={() => setShowGroupSearch(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Concept Search Modal */}
      {showConceptSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConceptSearch(false)} />
          <div className="relative bg-gray-900 rounded-xl border border-gray-800 w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-violet-400" />
                  Agregar Concepto de Contratista
                </h3>
                <p className="text-gray-400 text-sm mt-1">Busca por nombre del concepto o por contratista</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowConceptSearch(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 border-b border-gray-800">
              <Input
                placeholder="Buscar por concepto o por contratista..."
                value={conceptSearch}
                onChange={(e) => setConceptSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                autoFocus
              />
            </div>

            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {filteredConcepts.length > 0 ? (
                <div className="space-y-2">
                  {filteredConcepts.map((concept) => (
                    <div key={concept.id}
                      className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-violet-500/30"
                      onClick={() => handleAddConcept(concept)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{concept.name}</p>
                            {concept.supplier && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-violet-500/20 text-violet-400">
                                {concept.supplier.name}
                              </span>
                            )}
                            {concept.category && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-400">
                                {concept.category}
                              </span>
                            )}
                          </div>
                          {concept.description && (
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{concept.description}</p>
                          )}
                        </div>
                        <div className="text-right ml-4 shrink-0">
                          {concept.unitPrice != null ? (
                            <>
                              <p className="font-semibold text-violet-300">{formatCurrency(Number(concept.unitPrice))}</p>
                              <p className="text-xs text-gray-500">precio base</p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-500">sin precio</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No hay conceptos disponibles</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {conceptSearch ? 'No se encontraron conceptos con ese criterio' : 'No hay conceptos activos creados'}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-end">
              <Button variant="outline" onClick={() => setShowConceptSearch(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
