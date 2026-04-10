export interface PDFTemplateConfig {
  template: 'classic' | 'modern'
  logoUrl: string
  primaryColor: string
  accentColor: string
  fontFamily: 'Helvetica' | 'Times-Roman' | 'Courier'
  baseFontSize: number
  companyName: string
  companyTagline: string
  companyEmail: string
  companyWebsite: string
}

export const DEFAULT_PDF_CONFIG: PDFTemplateConfig = {
  template: 'classic',
  logoUrl: '/images/logo_motevideo.png',
  primaryColor: '#E91E63',
  accentColor: '#FF4FA3',
  fontFamily: 'Helvetica',
  baseFontSize: 10,
  companyName: 'Montevideo Convention Center',
  companyTagline: 'Centro de Eventos y Convenciones',
  companyEmail: 'info@montevideocc.com',
  companyWebsite: 'www.montevideocc.com',
}
