import Image from 'next/image'
import Link from 'next/link'
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">

          {/* Brand + motivational text */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/inicio" className="inline-block mb-5">
              <Image
                src="/images/logos/logo_motevideo.png"
                alt="Montevideo Convention Center"
                width={0}
                height={0}
                sizes="100vw"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Cada evento merece ser inolvidable. En Montevideo Convention Center
              convertimos tu visión en una experiencia que tus invitados
              recordarán para siempre.
            </p>
          </div>

          {/* Dirección y horario */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-5">
              Encuéntranos
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span>Calle 19 # 65b – 67<br />Barrio Montevideo, Bogotá</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                <a href="tel:+573114557229" className="hover:text-pink-400 transition-colors">
                  +57 311 455 7229
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                <a
                  href="mailto:info@Montevideoconventioncenter.com"
                  className="hover:text-pink-400 transition-colors break-all"
                >
                  info@Montevideoconventioncenter.com
                </a>
              </li>
            </ul>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-5">
              Navegación
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Inicio',    href: '/inicio'    },
                { label: 'Galería',   href: '/galeria'   },
                { label: 'Contacto',  href: '/contacto'  },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-pink-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Horario */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-5">
              Atención al Cliente
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Lunes a viernes<br />
              <span className="text-gray-200 font-medium">8:00 am – 5:00 pm</span>
            </p>
            <p className="text-sm text-gray-500">
              ¿Listo para reservar?{' '}
              <Link href="/contacto" className="text-pink-400 hover:text-pink-300 transition-colors font-medium">
                Escríbenos
              </Link>
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">
            © {currentYear} Montevideo Convention Center. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:info@Montevideoconventioncenter.com"
              className="text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
