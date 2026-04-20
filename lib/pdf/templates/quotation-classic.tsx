import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PDFTemplateConfig } from '../types'

function makeStyles(config: PDFTemplateConfig) {
  const { primaryColor, baseFontSize, fontFamily } = config
  const fs = baseFontSize
  return StyleSheet.create({
    page: {
      padding: 40,
      fontSize: fs,
      fontFamily,
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      paddingBottom: 20,
      borderBottom: `2 solid ${primaryColor}`,
    },
    logoBlock: { flexDirection: 'column' },
    logoImage: {
      width: config.logoWidth ?? 120,
      height: Math.round((config.logoWidth ?? 120) * 0.3),
      objectFit: 'contain',
      marginBottom: 6,
      marginLeft: config.logoOffsetX ?? 0,
      marginTop: config.logoOffsetY ?? 0,
    },
    companyName: {
      fontSize: fs + 14,
      fontWeight: 'bold',
      color: primaryColor,
      marginBottom: 4,
    },
    companyInfo: {
      fontSize: fs - 1,
      color: '#666666',
      lineHeight: 1.4,
    },
    quotationInfo: { alignItems: 'flex-end' },
    quotationNumber: {
      fontSize: fs + 8,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 4,
    },
    quotationMeta: {
      fontSize: fs - 1,
      color: '#666666',
      lineHeight: 1.4,
      textAlign: 'right',
    },
    section: { marginBottom: 20 },
    sectionTitle: {
      fontSize: fs + 2,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 10,
      paddingBottom: 5,
      borderBottom: '1 solid #e5e7eb',
    },
    clientInfo: {
      fontSize: fs,
      lineHeight: 1.6,
      color: '#374151',
    },
    table: { marginTop: 10, marginBottom: 20 },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f3f4f6',
      padding: 8,
      fontWeight: 'bold',
      fontSize: fs - 1,
      borderBottom: `2 solid ${primaryColor}`,
    },
    tableRow: {
      flexDirection: 'row',
      padding: 8,
      borderBottom: '1 solid #e5e7eb',
      fontSize: fs - 1,
    },
    tableRowInventory: {
      flexDirection: 'row',
      padding: 8,
      borderBottom: '1 solid #e5e7eb',
      fontSize: fs - 1,
      backgroundColor: '#fdf2f8',
    },
    tableRowGroup: {
      flexDirection: 'row',
      padding: 8,
      borderBottom: '1 solid #e5e7eb',
      fontSize: fs - 1,
      backgroundColor: '#f0fdf4',
    },
    tableRowConcept: {
      flexDirection: 'row',
      padding: 8,
      borderBottom: '1 solid #e5e7eb',
      fontSize: fs - 1,
      backgroundColor: '#faf5ff',
    },
    conceptBadge: {
      fontSize: fs - 4,
      color: '#7c3aed',
      backgroundColor: '#ede9fe',
      padding: '2 4',
      borderRadius: 2,
      marginTop: 2,
    },
    tableCol1: { width: '8%' },
    tableCol2: { width: '42%' },
    tableCol3: { width: '15%', textAlign: 'right' },
    tableCol4: { width: '15%', textAlign: 'right' },
    tableCol5: { width: '20%', textAlign: 'right' },
    itemDescription: { fontSize: fs - 1, color: '#1f2937' },
    itemDetails: { fontSize: fs - 3, color: '#6b7280', marginTop: 2 },
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
      color: '#0891b2',
      backgroundColor: '#cffafe',
      padding: '2 4',
      borderRadius: 2,
      marginTop: 2,
    },
    groupItemsList: {
      fontSize: fs - 3,
      color: '#6b7280',
      marginTop: 4,
      paddingLeft: 8,
      lineHeight: 1.4,
    },
    totals: { marginTop: 20, alignItems: 'flex-end' },
    totalsRow: {
      flexDirection: 'row',
      width: '40%',
      justifyContent: 'space-between',
      padding: 5,
      fontSize: fs,
    },
    totalRow: {
      flexDirection: 'row',
      width: '40%',
      justifyContent: 'space-between',
      padding: 8,
      backgroundColor: primaryColor,
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: fs + 2,
      borderRadius: 4,
      marginTop: 5,
    },
    notes: {
      marginTop: 30,
      padding: 15,
      backgroundColor: '#f9fafb',
      borderRadius: 4,
      borderLeft: `4 solid ${primaryColor}`,
    },
    notesTitle: {
      fontSize: fs,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 5,
    },
    notesText: {
      fontSize: fs - 1,
      color: '#4b5563',
      lineHeight: 1.5,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: 'center',
      fontSize: fs - 2,
      color: '#9ca3af',
      paddingTop: 15,
      borderTop: '1 solid #e5e7eb',
    },
  })
}

interface Props {
  quotation: any
  config: PDFTemplateConfig
}

export function QuotationClassicDocument({ quotation, config }: Props) {
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBlock}>
            {config.logoUrl ? (
              <Image src={config.logoUrl} style={styles.logoImage} />
            ) : (
              <Text style={styles.companyName}>{config.companyName}</Text>
            )}
            <Text style={styles.companyInfo}>
              {[
                config.companyTagline,
                config.companyNit ? `NIT: ${config.companyNit}` : null,
                config.companyPhone ? `Tel: ${config.companyPhone}` : null,
                config.companyEmail,
                config.companyWebsite,
              ].filter(Boolean).join('\n')}
            </Text>
          </View>
          <View style={styles.quotationInfo}>
            <Text style={styles.quotationNumber}>{quotation.quotationNumber}</Text>
            <Text style={styles.quotationMeta}>
              Fecha: {format(new Date(quotation.createdAt), 'dd MMMM yyyy', { locale: es })}{'\n'}
              Válida hasta: {format(new Date(quotation.validUntil), 'dd MMMM yyyy', { locale: es })}{'\n'}
              Estado: {quotation.status}
            </Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
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

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{quotation.title}</Text>
          {quotation.description && (
            <Text style={styles.clientInfo}>{quotation.description}</Text>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>#</Text>
            <Text style={styles.tableCol2}>Descripción</Text>
            <Text style={styles.tableCol3}>Cantidad</Text>
            <Text style={styles.tableCol4}>Precio Unit.</Text>
            <Text style={styles.tableCol5}>Total</Text>
          </View>
          {allLineItems.map((lineItem, index) => {
            if (lineItem.type === 'item') {
              const item = lineItem.data
              const inventoryDetails = getItemInventoryDetails(item)
              return (
                <View
                  key={`item-${item.id}`}
                  style={item.inventoryItem ? styles.tableRowInventory : styles.tableRow}
                >
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
                <View key={`group-${group.id}`} style={styles.tableRowGroup}>
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
                <View key={`concept-${concept.id}`} style={styles.tableRowConcept}>
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
        <View style={styles.totals}>
          <View style={styles.totalsRow}>
            <Text>Subtotal:</Text>
            <Text>{formatCurrency(Number(quotation.subtotal))}</Text>
          </View>
          {Number(quotation.discount) > 0 && (
            <View style={styles.totalsRow}>
              <Text>Descuento:</Text>
              <Text>-{formatCurrency(Number(quotation.discount))}</Text>
            </View>
          )}
          <View style={styles.totalsRow}>
            <Text>IVA (19%):</Text>
            <Text>{formatCurrency(Number(quotation.tax))}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>TOTAL:</Text>
            <Text>{formatCurrency(Number(quotation.total))}</Text>
          </View>
        </View>

        {/* Notes */}
        {quotation.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notas:</Text>
            <Text style={styles.notesText}>{quotation.notes}</Text>
          </View>
        )}

        {quotation.terms && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Términos y Condiciones:</Text>
            <Text style={styles.notesText}>{quotation.terms}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {config.companyName} · {config.companyWebsite}
        </Text>
      </Page>
    </Document>
  )
}
