export type PdfRow = {
  key: string
  description: string
  badge?: string
  details?: string
  qtyDisplay: string
  unitPrice: number
  total: number
}

export type PdfSubcategory = {
  name: string | null
  rows: PdfRow[]
  subtotal: number
}

export type PdfSection = {
  id: string
  title: string
  color: string
  subcategories: PdfSubcategory[]
  total: number
}

// Fixed section colors
export const SECTION_COLORS = {
  produccion: '#1e3a5f',
  catering: '#92400e',
  personal: '#064e3b',
  concept: '#3b0764',
} as const

export function buildPdfSections(quotation: any): PdfSection[] {
  const sections: PdfSection[] = []

  // ─── 1. Producción Técnica ────────────────────────────────────────────────
  const itemsByCategory = new Map<string, PdfRow[]>()
  const groupRows: PdfRow[] = []

  if (quotation.items?.length) {
    for (const item of quotation.items) {
      const catName: string =
        item.inventoryItem?.product?.category?.name || 'Equipos Varios'
      if (!itemsByCategory.has(catName)) itemsByCategory.set(catName, [])

      itemsByCategory.get(catName)!.push({
        key: `item-${item.id}`,
        description: item.description,
        qtyDisplay: String(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
      })
    }
  }

  if (quotation.groups?.length) {
    for (const group of quotation.groups) {
      const itemsList: string | undefined = group.group?.items?.length
        ? group.group.items
            .map((i: any) => i.inventoryItem?.product?.name || 'Item')
            .join(', ')
        : undefined

      groupRows.push({
        key: `group-${group.id}`,
        description: group.name,
        badge: 'PAQUETE',
        details: itemsList ? `Incluye: ${itemsList}` : undefined,
        qtyDisplay: String(group.quantity),
        unitPrice: Number(group.unitPrice),
        total: Number(group.total),
      })
    }
  }

  if (itemsByCategory.size > 0 || groupRows.length > 0) {
    const subcategories: PdfSubcategory[] = []

    for (const [catName, rows] of itemsByCategory) {
      subcategories.push({
        name: catName,
        rows,
        subtotal: rows.reduce((s, r) => s + r.total, 0),
      })
    }

    if (groupRows.length > 0) {
      subcategories.push({
        name: 'Paquetes',
        rows: groupRows,
        subtotal: groupRows.reduce((s, r) => s + r.total, 0),
      })
    }

    sections.push({
      id: 'produccion-tecnica',
      title: 'Producción Técnica',
      color: SECTION_COLORS.produccion,
      subcategories,
      total: subcategories.reduce((s, sc) => s + sc.subtotal, 0),
    })
  }

  // ─── 2. Catering ─────────────────────────────────────────────────────────
  const cateringLines = (quotation.cateringLines ?? []).filter(
    (l: any) => l.type !== 'personal'
  )
  if (cateringLines.length > 0) {
    const rows: PdfRow[] = cateringLines.map((line: any) => {
      const isEditableStaff = line.type === 'catering-staff' || line.type === 'catering-staff-freelance'
      const isCompanyStaff = line.type === 'catering-staff-company'
      const isMenaje = line.type === 'catering-menaje'
      const isFixed = isMenaje || isCompanyStaff
      const lineTotal = isEditableStaff
        ? Number(line.unitPrice) * (Number(line.people) || 1) * (Number(line.shifts) || 1)
        : isFixed
        ? Number(line.unitPrice)
        : Number(line.unitPrice) * (Number(line.quantity) || 1)
      const packageDetails: string | undefined =
        line.type === 'catering-paquete' && Array.isArray(line.packageItems) && line.packageItems.length > 0
          ? line.packageItems.join(', ')
          : undefined
      return {
        key: `catering-${line.id}`,
        description: line.description,
        details: packageDetails,
        qtyDisplay: isEditableStaff
          ? `${line.people ?? 1} pers. × ${line.shifts ?? 1} turno${(line.shifts ?? 1) !== 1 ? 's' : ''}`
          : isCompanyStaff
          ? `${line.people ?? 1} pers.`
          : String(line.quantity),
        unitPrice: isFixed ? 0 : Number(line.unitPrice),
        total: lineTotal,
      }
    })

    sections.push({
      id: 'catering',
      title: 'Catering',
      color: SECTION_COLORS.catering,
      subcategories: [{ name: null, rows, subtotal: rows.reduce((s, r) => s + r.total, 0) }],
      total: rows.reduce((s, r) => s + r.total, 0),
    })
  }

  // ─── 3. Personal ─────────────────────────────────────────────────────────
  const personalLines = (quotation.cateringLines ?? []).filter(
    (l: any) => l.type === 'personal'
  )
  if (personalLines.length > 0) {
    const byCategory = new Map<string, PdfRow[]>()
    for (const line of personalLines) {
      const catName: string = line.category || 'General'
      if (!byCategory.has(catName)) byCategory.set(catName, [])
      byCategory.get(catName)!.push({
        key: `personal-${line.id}`,
        description: line.description,
        badge: 'PERSONAL',
        qtyDisplay: `${line.people} pers. × ${line.shifts} turno${line.shifts !== 1 ? 's' : ''}`,
        unitPrice: Number(line.unitPrice),
        total: Number(line.total),
      })
    }

    const subcategories: PdfSubcategory[] = []
    for (const [catName, rows] of byCategory) {
      subcategories.push({
        name: byCategory.size > 1 ? catName : null,
        rows,
        subtotal: rows.reduce((s, r) => s + r.total, 0),
      })
    }

    sections.push({
      id: 'personal',
      title: 'Personal',
      color: SECTION_COLORS.personal,
      subcategories,
      total: subcategories.reduce((s, sc) => s + sc.subtotal, 0),
    })
  }

  // ─── 4. Concept sections (one per category) ───────────────────────────────
  if (quotation.conceptItems?.length) {
    const byCategory = new Map<string, any[]>()
    for (const concept of quotation.conceptItems) {
      const catName: string = concept.concept?.category || 'Servicios'
      if (!byCategory.has(catName)) byCategory.set(catName, [])
      byCategory.get(catName)!.push(concept)
    }

    for (const [catName, concepts] of byCategory) {
      const rows: PdfRow[] = concepts.map((c: any) => ({
        key: `concept-${c.id}`,
        description: c.name,
        badge: 'SERVICIO',
        details: c.description || undefined,
        qtyDisplay: String(c.quantity),
        unitPrice: Number(c.unitPrice),
        total: Number(c.total),
      }))

      sections.push({
        id: `concept-${catName}`,
        title: catName,
        color: SECTION_COLORS.concept,
        subcategories: [{ name: null, rows, subtotal: rows.reduce((s, r) => s + r.total, 0) }],
        total: rows.reduce((s, r) => s + r.total, 0),
      })
    }
  }

  return sections
}
