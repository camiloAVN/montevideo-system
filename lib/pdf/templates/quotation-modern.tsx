import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PDFTemplateConfig } from '../types'
import { buildPdfSections, PdfSection, PdfSubcategory, PdfRow } from '../pdfSections'

function makeStyles(config: PDFTemplateConfig) {
  const { primaryColor, accentColor, baseFontSize, fontFamily } = config
  const fs = baseFontSize
  return StyleSheet.create({
    page: { fontSize: fs, fontFamily, backgroundColor: '#ffffff' },
    // Header band
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
      marginLeft: config.logoOffsetX ?? 0,
      marginTop: config.logoOffsetY ?? 0,
    },
    companyName: { fontSize: fs + 12, fontWeight: 'bold', color: '#ffffff', marginBottom: 2 },
    companyTagline: { fontSize: fs - 1, color: 'rgba(255,255,255,0.75)' },
    headerRight: { alignItems: 'flex-end' },
    quotationLabel: {
      fontSize: fs - 2,
      color: 'rgba(255,255,255,0.7)',
      letterSpacing: 1,
      marginBottom: 4,
    },
    quotationNumber: { fontSize: fs + 10, fontWeight: 'bold', color: '#ffffff', marginBottom: 6 },
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
    // Body
    body: { padding: '20 40 70 40' },
    // Meta strip
    metaStrip: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingBottom: 16,
      borderBottom: '1 solid #e5e7eb',
    },
    metaBlock: { flexDirection: 'column' },
    metaLabel: { fontSize: fs - 2, color: '#9ca3af', letterSpacing: 0.5, marginBottom: 3 },
    metaValue: { fontSize: fs - 1, color: '#1f2937', fontWeight: 'bold' },
    metaValueSub: { fontSize: fs - 2, color: '#6b7280', marginTop: 1 },
    // Client card
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
    // Section title
    sectionTitle: { fontSize: fs, fontWeight: 'bold', color: primaryColor, marginBottom: 4 },
    sectionDesc: { fontSize: fs - 1, color: '#6b7280', marginBottom: 14 },
    // Category sections
    categoryBlock: { marginBottom: 20 },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: '10 12',
    },
    categoryTitle: { fontSize: fs + 5, fontWeight: 'bold', color: '#ffffff', flexGrow: 1 },
    categoryTotalLabel: { fontSize: fs + 1, color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' },
    // Subcategory
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
      backgroundColor: '#1f2937',
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
    // Section subtotal
    sectionSubtotal: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: '5 10',
      borderTop: '1.5 solid #e2e8f0',
    },
    sectionSubtotalText: { fontSize: fs, fontWeight: 'bold', color: '#1e293b' },
    // Totals
    totalsWrapper: { alignItems: 'flex-end', marginTop: 8 },
    totalsBox: {
      width: '45%',
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
      borderLeft: `3 solid ${accentColor}`,
    },
    notesTitle: { fontSize: fs, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
    notesText: { fontSize: fs - 1, color: '#6b7280', lineHeight: 1.5 },
    // Footer
    footer: {
      position: 'absolute',
      bottom: 24,
      left: 40,
      right: 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 10,
      borderTop: '1 solid #e5e7eb',
    },
    footerText: { fontSize: fs - 2, color: '#9ca3af' },
    footerAccent: { fontSize: fs - 2, color: primaryColor, fontWeight: 'bold' },
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
          {row.badge && <Text style={styles.badge}>{row.badge}</Text>}
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
      <View style={[styles.categoryHeader, { backgroundColor: section.color }]}>
        <Text style={styles.categoryTitle}>{section.title.toUpperCase()}</Text>
        <Text style={styles.categoryTotalLabel}>{formatCurrency(section.total)}</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.col1}>#</Text>
        <Text style={styles.col2}>Descripción</Text>
        <Text style={styles.col3}>Cantidad</Text>
        <Text style={styles.col4}>P. Unit.</Text>
        <Text style={styles.col5}>Total</Text>
      </View>

      {section.subcategories.map((sc, i) => renderSubcategory(sc, i))}

      <View style={styles.sectionSubtotal}>
        <Text style={styles.sectionSubtotalText}>
          Total {section.title}: {formatCurrency(section.total)}
        </Text>
      </View>
    </View>
  )
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

  const sections = buildPdfSections(quotation)
  let rowCount = 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Band */}
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

          {/* Title / Description */}
          <Text style={styles.sectionTitle}>{quotation.title}</Text>
          {quotation.description && (
            <Text style={styles.sectionDesc}>{quotation.description}</Text>
          )}

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
