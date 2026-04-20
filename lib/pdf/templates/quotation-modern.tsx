import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PDFTemplateConfig } from '../types'

function makeStyles(config: PDFTemplateConfig) {
  const { primaryColor, accentColor, baseFontSize, fontFamily } = config
  const fs = baseFontSize
  return StyleSheet.create({
    page: {
      fontSize: fs,
      fontFamily,
      backgroundColor: '#ffffff',
    },
    // ── Header band ───────────────────────────────────────────────────────────
    headerBand: {
      backgroundColor: primaryColor,
      padding: '20 40 16 40',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: { flexDirection: 'column' },
    logoImage: {
      width: config.logoWidth ?? 120,
      height: Math.round((config.logoWidth ?? 120) * 0.3),
      objectFit: 'contain',
      marginBottom: 6,
    },
    companyName: {
      fontSize: fs + 12,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 2,
    },
    companyTagline: {
      fontSize: fs - 1,
      color: 'rgba(255,255,255,0.75)',
    },
    headerRight: { alignItems: 'flex-end' },
    quotationLabel: {
      fontSize: fs - 2,
      color: 'rgba(255,255,255,0.7)',
      letterSpacing: 1,
      marginBottom: 4,
    },
    quotationNumber: {
      fontSize: fs + 10,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 6,
    },
    quotationBadge: {
      fontSize: fs - 2,
      color: primaryColor,
      backgroundColor: '#ffffff',
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 3,
      paddingBottom: 3,
      borderRadius: 10,
      fontWeight: 'bold',
    },
    // ── Body ─────────────────────────────────────────────────────────────────
    body: { padding: '20 40 60 40' },
    // ── Meta strip ───────────────────────────────────────────────────────────
    metaStrip: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingBottom: 16,
      borderBottom: `1 solid #e5e7eb`,
    },
    metaBlock: { flexDirection: 'column' },
    metaLabel: {
      fontSize: fs - 2,
      color: '#9ca3af',
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    metaValue: { fontSize: fs - 1, color: '#1f2937', fontWeight: 'bold' },
    metaValueSub: { fontSize: fs - 2, color: '#6b7280', marginTop: 1 },
    // ── Client card ──────────────────────────────────────────────────────────
    clientCard: {
      backgroundColor: '#f9fafb',
      borderRadius: 6,
      padding: 14,
      marginBottom: 20,
      borderLeft: `3 solid ${accentColor}`,
    },
    clientCardTitle: {
      fontSize: fs - 1,
      fontWeight: 'bold',
      color: '#374151',
      marginBottom: 6,
      letterSpacing: 0.5,
    },
    clientInfo: { fontSize: fs - 1, color: '#4b5563', lineHeight: 1.6 },
    // ── Section ──────────────────────────────────────────────────────────────
    sectionTitle: {
      fontSize: fs,
      fontWeight: 'bold',
      color: primaryColor,
      marginBottom: 4,
    },
    sectionDesc: { fontSize: fs - 1, color: '#6b7280', marginBottom: 14 },
    // ── Table ────────────────────────────────────────────────────────────────
    table: { marginBottom: 20 },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#1f2937',
      padding: '7 8',
      fontSize: fs - 1,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    tableRow: {
      flexDirection: 'row',
      padding: '7 8',
      borderBottom: '1 solid #f3f4f6',
      fontSize: fs - 1,
    },
    tableRowAlt: {
      flexDirection: 'row',
      padding: '7 8',
      borderBottom: '1 solid #f3f4f6',
      fontSize: fs - 1,
      backgroundColor: '#fafafa',
    },
    tableCol1: { width: '8%' },
    tableCol2: { width: '42%' },
    tableCol3: { width: '15%', textAlign: 'right' },
    tableCol4: { width: '15%', textAlign: 'right' },
    tableCol5: { width: '20%', textAlign: 'right' },
    itemDescription: { fontSize: fs - 1, color: '#1f2937' },
    itemDetails: { fontSize: fs - 3, color: '#9ca3af', marginTop: 2 },
    inventoryBadge: {
      fontSize: fs - 4,
      color: primaryColor,
      backgroundColor: '#fce7f3',
      padding: '2 4',
      borderRadius: 2,
      marginTop: 2,
    },
    groupBadge: {
      fontSize: fs - 4,
      color: '#059669',
      backgroundColor: '#d1fae5',
      padding: '2 4',
      borderRadius: 2,
      marginTop: 2,
    },
    groupItemsList: {
      fontSize: fs - 3,
      color: '#9ca3af',
      marginTop: 4,
      paddingLeft: 8,
      lineHeight: 1.4,
    },
    conceptBadge: {
      fontSize: fs - 4,
      color: '#7c3aed',
      backgroundColor: '#ede9fe',
      padding: '2 4',
      borderRadius: 2,
      marginTop: 2,
    },
    // ── Totals ───────────────────────────────────────────────────────────────
    totalsWrapper: { alignItems: 'flex-end', marginTop: 8 },
    totalsBox: {
      width: '42%',
      borderRadius: 6,
      overflow: 'hidden',
      border: '1 solid #e5e7eb',
    },
    totalsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '6 12',
      fontSize: fs,
      color: '#374151',
      borderBottom: '1 solid #f3f4f6',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '10 12',
      backgroundColor: primaryColor,
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: fs + 2,
    },
    // ── Notes ────────────────────────────────────────────────────────────────
    notes: {
      marginTop: 24,
      padding: 14,
      backgroundColor: '#f9fafb',
      borderRadius: 4,
      borderLeft: `3 solid ${accentColor}`,
    },
    notesTitle: {
      fontSize: fs,
      fontWeight: 'bold',
      color: '#374151',
      marginBottom: 4,
    },
    notesText: { fontSize: fs - 1, color: '#6b7280', lineHeight: 1.5 },
    // ── Footer ───────────────────────────────────────────────────────────────
    footer: {
      position: 'absolute',
      bottom: 24,
      left: 40,
      right: 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 10,
      borderTop: `1 solid #e5e7eb`,
    },
    footerText: { fontSize: fs - 2, color: '#9ca3af' },
    footerAccent: { fontSize: fs - 2, color: primaryColor, fontWeight: 'bold' },
  })
}

interface Props {
  quotation: any
  config: PDFTemplateConfig
}

export function QuotationModernDocument({ quotation, config }: Props) {
  const styles = makeStyles(config)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const getItemInventoryDetails = (item: any) => {
    if (!item.inventoryItem) return null
    const inv = item.inventoryItem
    const parts = []
    if (inv.product?.sku) parts.push(`SKU: ${inv.product.sku}`)
    if (inv.serialNumber) parts.push(`S/N: ${inv.serialNumber}`)
    if (inv.assetTag) parts.push(`Activo: ${inv.assetTag}`)
    return parts.length > 0 ? parts.join(' | ') : null
  }

  const getGroupItemsList = (group: any) => {
    if (!group.group?.items || group.group.items.length === 0) return null
    return group.group.items
      .map((item: any) => item.inventoryItem?.product?.name || 'Item')
      .join(', ')
  }

  const allLineItems: { type: 'item' | 'group' | 'concept'; data: any; order: number }[] = []
  if (quotation.items) {
    quotation.items.forEach((item: any) => {
      allLineItems.push({ type: 'item', data: item, order: item.order || 0 })
    })
  }
  if (quotation.groups) {
    quotation.groups.forEach((group: any) => {
      allLineItems.push({ type: 'group', data: group, order: group.order || 0 })
    })
  }
  if (quotation.conceptItems) {
    quotation.conceptItems.forEach((concept: any) => {
      allLineItems.push({ type: 'concept', data: concept, order: concept.order || 0 })
    })
  }
  allLineItems.sort((a, b) => a.order - b.order)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── Header Band ── */}
        <View style={styles.headerBand}>
          <View style={styles.headerLeft}>
            {config.logoUrl ? (
              <Image src={config.logoUrl} style={styles.logoImage} />
            ) : (
              <Text style={styles.companyName}>{config.companyName}</Text>
            )}
            <Text style={styles.companyTagline}>{config.companyTagline}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.quotationLabel}>COTIZACIÓN</Text>
            <Text style={styles.quotationNumber}>{quotation.quotationNumber}</Text>
            <Text style={styles.quotationBadge}>{quotation.status}</Text>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          {/* Meta strip */}
          <View style={styles.metaStrip}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>FECHA DE EMISIÓN</Text>
              <Text style={styles.metaValue}>
                {format(new Date(quotation.createdAt), 'dd MMM yyyy', { locale: es })}
              </Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>VÁLIDA HASTA</Text>
              <Text style={styles.metaValue}>
                {format(new Date(quotation.validUntil), 'dd MMM yyyy', { locale: es })}
              </Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>EMPRESA EMISORA</Text>
              <Text style={styles.metaValue}>{config.companyName}</Text>
              {config.companyNit ? (
                <Text style={styles.metaValueSub}>NIT: {config.companyNit}</Text>
              ) : null}
              {config.companyPhone ? (
                <Text style={styles.metaValueSub}>Tel: {config.companyPhone}</Text>
              ) : null}
              <Text style={styles.metaValueSub}>{config.companyEmail}</Text>
            </View>
          </View>

          {/* Client card */}
          <View style={styles.clientCard}>
            <Text style={styles.clientCardTitle}>FACTURAR A</Text>
            <Text style={styles.clientInfo}>
              {quotation.client.name}{'\n'}
              {quotation.client.company && `${quotation.client.company}\n`}
              {quotation.client.email}{'\n'}
              {quotation.client.phone && `${quotation.client.phone}\n`}
              {quotation.client.address && `${quotation.client.address}\n`}
              {quotation.client.city && quotation.client.country &&
                `${quotation.client.city}, ${quotation.client.country}\n`}
              {quotation.client.taxId && `NIT: ${quotation.client.taxId}`}
            </Text>
          </View>

          {/* Title / Description */}
          <Text style={styles.sectionTitle}>{quotation.title}</Text>
          {quotation.description && (
            <Text style={styles.sectionDesc}>{quotation.description}</Text>
          )}

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCol1}>#</Text>
              <Text style={styles.tableCol2}>Descripción</Text>
              <Text style={styles.tableCol3}>Cant.</Text>
              <Text style={styles.tableCol4}>P. Unit.</Text>
              <Text style={styles.tableCol5}>Total</Text>
            </View>
            {allLineItems.map((lineItem, index) => {
              const rowStyle = index % 2 === 0 ? styles.tableRow : styles.tableRowAlt
              if (lineItem.type === 'item') {
                const item = lineItem.data
                const inventoryDetails = getItemInventoryDetails(item)
                return (
                  <View key={`item-${item.id}`} style={rowStyle}>
                    <Text style={styles.tableCol1}>{index + 1}</Text>
                    <View style={styles.tableCol2}>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                      {inventoryDetails && (
                        <Text style={styles.itemDetails}>{inventoryDetails}</Text>
                      )}
                      {item.inventoryItem && (
                        <Text style={styles.inventoryBadge}>INVENTARIO</Text>
                      )}
                    </View>
                    <Text style={styles.tableCol3}>{item.quantity}</Text>
                    <Text style={styles.tableCol4}>{formatCurrency(Number(item.unitPrice))}</Text>
                    <Text style={styles.tableCol5}>{formatCurrency(Number(item.total))}</Text>
                  </View>
                )
              } else if (lineItem.type === 'group') {
                const group = lineItem.data
                const groupItemsList = getGroupItemsList(group)
                return (
                  <View key={`group-${group.id}`} style={rowStyle}>
                    <Text style={styles.tableCol1}>{index + 1}</Text>
                    <View style={styles.tableCol2}>
                      <Text style={styles.itemDescription}>{group.name}</Text>
                      {group.description && (
                        <Text style={styles.itemDetails}>{group.description}</Text>
                      )}
                      <Text style={styles.groupBadge}>PAQUETE</Text>
                      {groupItemsList && (
                        <Text style={styles.groupItemsList}>Incluye: {groupItemsList}</Text>
                      )}
                    </View>
                    <Text style={styles.tableCol3}>{group.quantity}</Text>
                    <Text style={styles.tableCol4}>{formatCurrency(Number(group.unitPrice))}</Text>
                    <Text style={styles.tableCol5}>{formatCurrency(Number(group.total))}</Text>
                  </View>
                )
              } else {
                const concept = lineItem.data
                return (
                  <View key={`concept-${concept.id}`} style={rowStyle}>
                    <Text style={styles.tableCol1}>{index + 1}</Text>
                    <View style={styles.tableCol2}>
                      <Text style={styles.itemDescription}>{concept.name}</Text>
                      {concept.description && (
                        <Text style={styles.itemDetails}>{concept.description}</Text>
                      )}
                      <Text style={styles.conceptBadge}>SERVICIO</Text>
                    </View>
                    <Text style={styles.tableCol3}>{concept.quantity}</Text>
                    <Text style={styles.tableCol4}>{formatCurrency(Number(concept.unitPrice))}</Text>
                    <Text style={styles.tableCol5}>{formatCurrency(Number(concept.total))}</Text>
                  </View>
                )
              }
            })}
          </View>

          {/* Totals */}
          <View style={styles.totalsWrapper}>
            <View style={styles.totalsBox}>
              <View style={styles.totalsRow}>
                <Text>Subtotal</Text>
                <Text>{formatCurrency(Number(quotation.subtotal))}</Text>
              </View>
              {Number(quotation.discount) > 0 && (
                <View style={styles.totalsRow}>
                  <Text>Descuento</Text>
                  <Text>-{formatCurrency(Number(quotation.discount))}</Text>
                </View>
              )}
              <View style={styles.totalsRow}>
                <Text>IVA (19%)</Text>
                <Text>{formatCurrency(Number(quotation.tax))}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text>TOTAL</Text>
                <Text>{formatCurrency(Number(quotation.total))}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {quotation.notes && (
            <View style={styles.notes}>
              <Text style={styles.notesTitle}>Notas</Text>
              <Text style={styles.notesText}>{quotation.notes}</Text>
            </View>
          )}

          {quotation.terms && (
            <View style={styles.notes}>
              <Text style={styles.notesTitle}>Términos y Condiciones</Text>
              <Text style={styles.notesText}>{quotation.terms}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {config.companyEmail} · {config.companyWebsite}
          </Text>
          <Text style={styles.footerAccent}>{config.companyName}</Text>
        </View>
      </Page>
    </Document>
  )
}
