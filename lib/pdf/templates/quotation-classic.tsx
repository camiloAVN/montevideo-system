import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PDFTemplateConfig } from '../types'
import { buildPdfSections, PdfSection, PdfSubcategory, PdfRow } from '../pdfSections'

function makeStyles(config: PDFTemplateConfig) {
  const { primaryColor, baseFontSize, fontFamily } = config
  const fs = baseFontSize
  return StyleSheet.create({
    page: { padding: 40, fontSize: fs, fontFamily, backgroundColor: '#ffffff' },
    // Header
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
    companyName: { fontSize: fs + 14, fontWeight: 'bold', color: primaryColor, marginBottom: 4 },
    companyInfo: { fontSize: fs - 1, color: '#666666', lineHeight: 1.4 },
    quotationInfo: { alignItems: 'flex-end' },
    quotationNumber: { fontSize: fs + 8, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
    quotationMeta: { fontSize: fs - 1, color: '#666666', lineHeight: 1.4, textAlign: 'right' },
    // Sections
    section: { marginBottom: 10 },
    sectionTitle: {
      fontSize: fs + 2,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 10,
      paddingBottom: 5,
      borderBottom: '1 solid #e5e7eb',
    },
    clientInfo: { fontSize: fs, lineHeight: 1.6, color: '#374151' },
    // Category sections
    categoryBlock: { marginBottom: 18 },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: '9 10',
      marginBottom: 0,
    },
    categoryTitle: { fontSize: fs + 4, fontWeight: 'bold', color: '#ffffff', flexGrow: 1 },
    categoryTotalLabel: { fontSize: fs + 1, color: 'rgba(255,255,255,0.85)', fontWeight: 'bold' },
    // Subcategory header
    subcategoryHeader: {
      flexDirection: 'row',
      padding: '5 10',
      backgroundColor: '#f0f4f8',
      borderBottom: '1 solid #e2e8f0',
    },
    subcategoryTitle: { fontSize: fs, fontWeight: 'bold', color: '#334155' },
    subcategoryTotal: { fontSize: fs - 1, color: '#64748b', marginLeft: 'auto' },
    // Table
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#374151',
      padding: '6 8',
      fontSize: fs - 1,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    tableRow: {
      flexDirection: 'row',
      padding: '7 8',
      borderBottom: '1 solid #f1f5f9',
      fontSize: fs - 1,
      backgroundColor: '#ffffff',
    },
    tableRowAlt: {
      flexDirection: 'row',
      padding: '7 8',
      borderBottom: '1 solid #f1f5f9',
      fontSize: fs - 1,
      backgroundColor: '#f8fafc',
    },
    col1: { width: '7%' },
    col2: { width: '43%' },
    col3: { width: '16%', textAlign: 'right' },
    col4: { width: '16%', textAlign: 'right' },
    col5: { width: '18%', textAlign: 'right' },
    itemDescription: { fontSize: fs - 1, color: '#1e293b' },
    itemDetails: { fontSize: fs - 3, color: '#94a3b8', marginTop: 2 },
    badge: {
      fontSize: fs - 4,
      color: '#ffffff',
      backgroundColor: '#64748b',
      padding: '1 4',
      borderRadius: 2,
      marginTop: 2,
    },
    // Section subtotal row
    sectionSubtotal: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: '5 10',
      borderTop: '1.5 solid #e2e8f0',
    },
    sectionSubtotalText: { fontSize: fs, fontWeight: 'bold', color: '#1e293b' },
    // Totals
    totalsWrapper: { marginTop: 16, alignItems: 'flex-end' },
    totalsBox: {
      width: '45%',
      border: '1 solid #e2e8f0',
      borderRadius: 4,
      overflow: 'hidden',
    },
    totalsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '6 12',
      fontSize: fs,
      color: '#374151',
      borderBottom: '1 solid #f1f5f9',
    },
    grandTotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '10 12',
      backgroundColor: primaryColor,
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: fs + 3,
    },
    // Notes
    notes: {
      marginTop: 20,
      padding: 14,
      backgroundColor: '#f9fafb',
      borderRadius: 4,
      borderLeft: `4 solid ${primaryColor}`,
    },
    notesTitle: { fontSize: fs, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
    notesText: { fontSize: fs - 1, color: '#4b5563', lineHeight: 1.5 },
    // Footer
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: 'center',
      fontSize: fs - 2,
      color: '#9ca3af',
      paddingTop: 12,
      borderTop: '1 solid #e5e7eb',
    },
  })
}

interface Props {
  quotation: any
  config: PDFTemplateConfig
}

function SectionBlock({
  section,
  styles,
  formatCurrency,
  rowOffset,
}: {
  section: PdfSection
  styles: any
  formatCurrency: (v: number) => string
  rowOffset: number
}) {
  let globalRowNum = rowOffset

  const renderRow = (row: PdfRow, idx: number) => {
    globalRowNum++
    const num = globalRowNum
    const style = idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt
    return (
      <View key={row.key} style={style}>
        <Text style={styles.col1}>{num}</Text>
        <View style={styles.col2}>
          <Text style={styles.itemDescription}>{row.description}</Text>
          {row.details && <Text style={styles.itemDetails}>{row.details}</Text>}
        </View>
        <Text style={styles.col3}>{row.qtyDisplay}</Text>
        <Text style={styles.col4}>{formatCurrency(row.unitPrice)}</Text>
        <Text style={styles.col5}>{formatCurrency(row.total)}</Text>
      </View>
    )
  }

  const renderSubcategory = (sc: PdfSubcategory, scIdx: number) => (
    <View key={`sc-${scIdx}`}>
      {sc.name && (
        <View style={styles.subcategoryHeader}>
          <Text style={styles.subcategoryTitle}>{sc.name}</Text>
          <Text style={styles.subcategoryTotal}>{formatCurrency(sc.subtotal)}</Text>
        </View>
      )}
      {sc.rows.map((row, i) => renderRow(row, i))}
    </View>
  )

  return (
    <View style={styles.categoryBlock}>
      {/* Section header */}
      <View style={[styles.categoryHeader, { backgroundColor: section.color }]}>
        <Text style={styles.categoryTitle}>{section.title.toUpperCase()}</Text>
        <Text style={styles.categoryTotalLabel}>{formatCurrency(section.total)}</Text>
      </View>

      {/* Column headers */}
      <View style={styles.tableHeader}>
        <Text style={styles.col1}>#</Text>
        <Text style={styles.col2}>Descripción</Text>
        <Text style={styles.col3}>Cantidad</Text>
        <Text style={styles.col4}>P. Unit.</Text>
        <Text style={styles.col5}>Total</Text>
      </View>

      {/* Subcategories + rows */}
      {section.subcategories.map((sc, i) => renderSubcategory(sc, i))}

      {/* Section subtotal */}
      <View style={styles.sectionSubtotal}>
        <Text style={styles.sectionSubtotalText}>
          Total {section.title}: {formatCurrency(section.total)}
        </Text>
      </View>
    </View>
  )
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

  const sections = buildPdfSections(quotation)
  let rowCount = 0

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
            {quotation.client.company ? `${quotation.client.company}\n` : ''}
            {quotation.client.email}{'\n'}
            {quotation.client.phone ? `${quotation.client.phone}\n` : ''}
            {quotation.client.address ? `${quotation.client.address}\n` : ''}
            {quotation.client.city && quotation.client.country
              ? `${quotation.client.city}, ${quotation.client.country}\n`
              : ''}
            {quotation.client.taxId ? `NIT: ${quotation.client.taxId}` : ''}
          </Text>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{quotation.title}</Text>
          {quotation.description && (
            <Text style={styles.clientInfo}>{quotation.description}</Text>
          )}
        </View>

        {/* Category sections */}
        {sections.map((section) => {
          const sectionRowCount = section.subcategories.reduce(
            (s, sc) => s + sc.rows.length, 0
          )
          const offset = rowCount
          rowCount += sectionRowCount
          return (
            <SectionBlock
              key={section.id}
              section={section}
              styles={styles}
              formatCurrency={formatCurrency}
              rowOffset={offset}
            />
          )
        })}

        {/* Grand totals */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totalsBox}>
            {sections.map((s) => (
              <View key={`tot-${s.id}`} style={styles.totalsRow}>
                <Text>{s.title}</Text>
                <Text>{formatCurrency(s.total)}</Text>
              </View>
            ))}
            {Number(quotation.discount) > 0 && (
              <View style={styles.totalsRow}>
                <Text>Descuento</Text>
                <Text>-{formatCurrency(Number(quotation.discount))}</Text>
              </View>
            )}
            <View style={styles.totalsRow}>
              <Text>IVA</Text>
              <Text>{formatCurrency(Number(quotation.tax))}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text>GRAN TOTAL</Text>
              <Text>{formatCurrency(Number(quotation.total))}</Text>
            </View>
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
