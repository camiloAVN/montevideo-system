import { ImageMosaic } from '@/components/public/ImageMosaic'
import { Button } from '@/components/ui/Button'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Galería - Montevideo Centro de Eventos',
  description: 'Galería de momentos únicos e inolvidables en nuestro centro de eventos.',
}

export default function GaleriaPage() {
  return (
    <div className="min-h-screen py-20">

      {/* Image Mosaic */}
      <section className="border-t border-gray-800">
        <ImageMosaic
          title="Nuestra Galería"
          subtitle="Momentos únicos e inolvidables que se han vivido en nuestro recinto"
        />
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Listo para hacer realidad{' '}
            <span className="text-gradient">tu siguiente evento</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Contáctanos hoy y déjanos ayudarte a crear una experiencia
            que tus invitados recordarán para siempre.
          </p>
          <Link href="/contacto">
            <Button size="lg" variant="primary" className="hover-glow group">
              Solicitar Cotización
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
