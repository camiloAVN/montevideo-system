import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { generateQuotationPDF } from '@/lib/pdf/generator'
import { PDFTemplateConfig, DEFAULT_PDF_CONFIG } from '@/lib/pdf/types'

function parseConfig(sp: URLSearchParams): PDFTemplateConfig {
  const template = sp.get('template')
  const baseFontSize = Number(sp.get('baseFontSize'))
  return {
    template: template === 'modern' ? 'modern' : 'classic',
    logoUrl: sp.get('logoUrl') || DEFAULT_PDF_CONFIG.logoUrl,
    primaryColor: sp.get('primaryColor') || DEFAULT_PDF_CONFIG.primaryColor,
    accentColor: sp.get('accentColor') || DEFAULT_PDF_CONFIG.accentColor,
    fontFamily:
      (sp.get('fontFamily') as PDFTemplateConfig['fontFamily']) ||
      DEFAULT_PDF_CONFIG.fontFamily,
    baseFontSize:
      baseFontSize >= 8 && baseFontSize <= 16
        ? baseFontSize
        : DEFAULT_PDF_CONFIG.baseFontSize,
    companyName: sp.get('companyName') || DEFAULT_PDF_CONFIG.companyName,
    companyTagline: sp.get('companyTagline') || DEFAULT_PDF_CONFIG.companyTagline,
    companyEmail: sp.get('companyEmail') || DEFAULT_PDF_CONFIG.companyEmail,
    companyWebsite: sp.get('companyWebsite') || DEFAULT_PDF_CONFIG.companyWebsite,
  }
}

// GET /api/quotations/[id]/pdf - Generate PDF for quotation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const config = parseConfig(request.nextUrl.searchParams)

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        client: true,
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          orderBy: { order: 'asc' },
          include: {
            inventoryItem: {
              select: {
                id: true,
                serialNumber: true,
                assetTag: true,
                product: {
                  select: {
                    id: true,
                    sku: true,
                    name: true,
                    brand: true,
                    model: true,
                  },
                },
              },
            },
          },
        },
        groups: {
          orderBy: { order: 'asc' },
          include: {
            group: {
              select: {
                id: true,
                name: true,
                description: true,
                items: {
                  include: {
                    inventoryItem: {
                      select: {
                        id: true,
                        serialNumber: true,
                        assetTag: true,
                        product: {
                          select: {
                            id: true,
                            sku: true,
                            name: true,
                            brand: true,
                            model: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!quotation) {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      )
    }

    const pdfBuffer = await generateQuotationPDF(quotation, config)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Cotizacion-${quotation.quotationNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    )
  }
}
