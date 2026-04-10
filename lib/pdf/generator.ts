import fs from 'fs'
import path from 'path'
import ReactPDF from '@react-pdf/renderer'
import { PDFTemplateConfig, DEFAULT_PDF_CONFIG } from './types'
import { QuotationClassicDocument } from './templates/quotation-classic'
import { QuotationModernDocument } from './templates/quotation-modern'

function resolveLogoUrl(logoUrl: string): string {
  if (!logoUrl) return ''

  // Local path → read file and return as base64 data URL
  // (avoids Windows path issues with @react-pdf/renderer's image loader)
  if (logoUrl.startsWith('/')) {
    const filePath = path.join(process.cwd(), 'public', logoUrl)
    try {
      const data = fs.readFileSync(filePath)
      const ext = path.extname(filePath).toLowerCase()
      const mime =
        ext === '.png' ? 'image/png' :
        ext === '.webp' ? 'image/webp' : 'image/jpeg'
      return `data:${mime};base64,${data.toString('base64')}`
    } catch {
      return ''
    }
  }

  // External URL (e.g. R2) — pass through directly
  return logoUrl
}

export async function generateQuotationPDF(
  quotation: any,
  config: PDFTemplateConfig = DEFAULT_PDF_CONFIG
): Promise<Buffer> {
  const resolvedConfig = {
    ...config,
    logoUrl: resolveLogoUrl(config.logoUrl),
  }

  const doc =
    resolvedConfig.template === 'modern'
      ? QuotationModernDocument({ quotation, config: resolvedConfig })
      : QuotationClassicDocument({ quotation, config: resolvedConfig })

  const pdfStream = await ReactPDF.renderToStream(doc)

  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    pdfStream.on('data', (chunk: Buffer) => chunks.push(chunk))
    pdfStream.on('end', () => resolve(Buffer.concat(chunks)))
    pdfStream.on('error', reject)
  })
}
