
import { HeroSequence } from '@/components/public/HeroSequence'
import { Metadata } from 'next'
import { Users, BookOpen, UtensilsCrossed, Music, Maximize2, ChevronRight, MapPin, Navigation } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Montevideo - Centro de Eventos',
  description: 'Centro de eventos con producción audiovisual profesional, shows de primer nivel y logística integral.',
}

const espacios = [
  {
    nombre: 'Salón A',
    area: '1.832',
    auditorio: '1.500',
    aula: '650',
    banquete: '550',
    concierto: '2.000',
    highlight: false,
  },
  {
    nombre: 'Salón B',
    area: '1.832',
    auditorio: '1.500',
    aula: '650',
    banquete: '550',
    concierto: '2.000',
    highlight: false,
  },
  {
    nombre: 'Gran Salón',
    area: '3.664',
    auditorio: '3.000',
    aula: '1.300',
    banquete: '1.100',
    concierto: '5.000',
    highlight: true,
  },
]

export default function InicioPage() {
  return (
    <div>
      <HeroSequence />

      {/* Stats Section */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '5.000+', label: 'Capacidad Máxima' },
              { number: '3.664', label: 'm² de Espacio' },
              { number: '3', label: 'Salones Disponibles' },
              { number: '360°', label: 'Servicio Integral' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Espacio Multiformato */}
      <section id="espacios" className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Espacio <span className="text-gradient">Multiformato</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Nuestros salones se adaptan a cualquier tipo de evento, desde conferencias
              y capacitaciones hasta grandes conciertos y celebraciones.
            </p>
          </div>

          {/* ── Móvil: cards apiladas ── */}
          <div className="md:hidden space-y-4">
            {espacios.map((espacio, index) => (
              <div
                key={index}
                className={`glass rounded-2xl overflow-hidden border ${
                  espacio.highlight ? 'border-pink-500/30' : 'border-gray-700/50'
                }`}
              >
                {/* Nombre del salón */}
                <div className={`px-5 py-4 border-b border-gray-700/40 flex items-center justify-between ${
                  espacio.highlight
                    ? 'bg-gradient-to-r from-pink-600/10 to-amber-500/10'
                    : 'bg-gray-800/30'
                }`}>
                  <div className="flex items-center gap-2">
                    {espacio.highlight && (
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 shrink-0" />
                    )}
                    <span className={`font-bold text-lg ${espacio.highlight ? 'text-gradient' : 'text-white'}`}>
                      {espacio.nombre}
                    </span>
                  </div>
                  {espacio.highlight && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink-600/20 text-pink-400 border border-pink-600/30 font-medium">
                      Completo
                    </span>
                  )}
                </div>

                {/* Filas de datos */}
                <div className="divide-y divide-gray-700/30">
                  {[
                    { icon: Maximize2,       label: 'Área',             value: espacio.area,      unit: 'm²'    },
                    { icon: Users,           label: 'Auditorio',        value: espacio.auditorio, unit: 'sillas' },
                    { icon: BookOpen,        label: 'Aula',             value: espacio.aula,      unit: 'sillas' },
                    { icon: UtensilsCrossed, label: 'Banquete',         value: espacio.banquete,  unit: 'pers.'  },
                    { icon: Music,           label: 'Concierto / Fiesta', value: espacio.concierto, unit: 'pers.' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
                      <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                        <row.icon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        {row.label}
                      </div>
                      <div>
                        <span className={`font-semibold ${
                          row.label === 'Concierto / Fiesta' && espacio.highlight
                            ? 'text-gradient'
                            : 'text-gray-200'
                        }`}>
                          {row.value}
                        </span>
                        <span className="text-gray-500 text-xs ml-1">{row.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop: tabla ── */}
          <div className="hidden md:block glass rounded-2xl overflow-hidden border border-gray-700/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50 bg-gradient-to-r from-pink-600/10 to-amber-500/10">
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-widest">
                      Espacio
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-semibold text-gray-300 uppercase tracking-widest">
                      <div className="flex flex-col items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-pink-400" />
                        <span>Área (m²)</span>
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-semibold text-gray-300 uppercase tracking-widest">
                      <div className="flex flex-col items-center gap-1.5">
                        <Users className="w-4 h-4 text-pink-400" />
                        <span>Auditorio</span>
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-semibold text-gray-300 uppercase tracking-widest">
                      <div className="flex flex-col items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-pink-400" />
                        <span>Aula</span>
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-semibold text-gray-300 uppercase tracking-widest">
                      <div className="flex flex-col items-center gap-1.5">
                        <UtensilsCrossed className="w-4 h-4 text-pink-400" />
                        <span>Banquete</span>
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-semibold text-gray-300 uppercase tracking-widest">
                      <div className="flex flex-col items-center gap-1.5">
                        <Music className="w-4 h-4 text-pink-400" />
                        <span>Concierto / Fiesta</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {espacios.map((espacio, index) => (
                    <tr
                      key={index}
                      className={`
                        transition-all duration-200 hover:bg-white/[0.02]
                        ${espacio.highlight
                          ? 'bg-gradient-to-r from-pink-600/[0.07] to-amber-500/[0.07]'
                          : ''}
                      `}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {espacio.highlight && (
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 shrink-0" />
                          )}
                          <span className={`font-semibold ${espacio.highlight ? 'text-gradient text-lg' : 'text-gray-200'}`}>
                            {espacio.nombre}
                          </span>
                          {espacio.highlight && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-600/20 text-pink-400 border border-pink-600/30 font-medium">
                              Completo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center font-mono text-sm text-gray-300">
                        {espacio.area}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-gray-200 font-semibold">{espacio.auditorio}</span>
                        <span className="text-gray-500 text-xs ml-1">sillas</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-gray-200 font-semibold">{espacio.aula}</span>
                        <span className="text-gray-500 text-xs ml-1">sillas</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-gray-200 font-semibold">{espacio.banquete}</span>
                        <span className="text-gray-500 text-xs ml-1">pers.</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`font-bold text-lg ${espacio.highlight ? 'text-gradient' : 'text-gray-200'}`}>
                          {espacio.concierto}
                        </span>
                        <span className="text-gray-500 text-xs ml-1">pers.</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      {/* Servicios */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros <span className="text-gradient">Servicios</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Una experiencia completa desde la ambientación y el montaje hasta el entretenimiento y la gastronomía.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[280px_280px_320px] gap-4">

            {/* 01 — Producción Audiovisual (2 cols × 2 rows) */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-auto md:col-span-2 md:row-span-2">
              <Image
                src="/images/servicios/produccion_audiovisual.png"
                alt="Producción Audiovisual"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <span className="absolute top-5 left-6 font-mono text-xs text-white/30 tracking-widest select-none">01</span>
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-8 h-px bg-pink-500 mb-3 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <h3 className="text-white font-bold text-3xl leading-tight">Producción Audiovisual</h3>
              </div>
            </div>

            {/* 02 — Shows y Talentos */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-auto">
              <Image
                src="/images/servicios/shows_y_talentos.png"
                alt="Shows y Talentos"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <span className="absolute top-4 left-5 font-mono text-xs text-white/30 tracking-widest select-none">02</span>
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-6 h-px bg-pink-500 mb-2.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <h3 className="text-white font-bold text-xl leading-tight">Shows y Talentos</h3>
              </div>
            </div>

            {/* 03 — Seguridad y Logística */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-auto">
              <Image
                src="/images/servicios/seguridad_y_logistica.png"
                alt="Seguridad y Logística"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <span className="absolute top-4 left-5 font-mono text-xs text-white/30 tracking-widest select-none">03</span>
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-6 h-px bg-pink-500 mb-2.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <h3 className="text-white font-bold text-xl leading-tight">Seguridad y Logística</h3>
              </div>
            </div>

            {/* 04 — Experiencias Gastronómicas */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-auto">
              <Image
                src="/images/servicios/experiencias_gastronomicas.png"
                alt="Experiencias Gastronómicas"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <span className="absolute top-4 left-5 font-mono text-xs text-white/30 tracking-widest select-none">04</span>
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-6 h-px bg-pink-500 mb-2.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <h3 className="text-white font-bold text-xl leading-tight">Experiencias Gastronómicas</h3>
              </div>
            </div>

            {/* 05 — Arquitectura Efímera (2 cols) */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-auto md:col-span-2">
              <Image
                src="/images/servicios/arquitectura_efimera.png"
                alt="Arquitectura Efímera"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <span className="absolute top-5 left-6 font-mono text-xs text-white/30 tracking-widest select-none">05</span>
              <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-7 h-px bg-pink-500 mb-3 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <h3 className="text-white font-bold text-2xl leading-tight">Arquitectura Efímera</h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tipos de Eventos */}
      <section className="py-20 border-t border-gray-800">

        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Tipos de <span className="text-gradient">Eventos</span>
              </h2>
              <p className="text-gray-400 max-w-xl text-sm md:text-base">
                Desde íntimas reuniones corporativas hasta grandes conciertos multitudinarios.
              </p>
            </div>
            <p className="md:hidden flex items-center gap-1 text-xs text-gray-500 shrink-0 pb-1">
              Desliza <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>

        {/* Scroll rail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="
            grid grid-flow-col auto-cols-[78vw] sm:auto-cols-[42vw]
            md:grid-flow-row md:grid-cols-5 md:auto-cols-auto
            gap-4 overflow-x-auto md:overflow-visible
            snap-x snap-mandatory md:snap-none
            pb-4 md:pb-0
            [&::-webkit-scrollbar]:hidden [scrollbar-width:none]
          ">
            {[
              { titulo: 'Tipo Aula',   src: '/images/eventos/tipo_aula.png'  },
              { titulo: 'Convención',  src: '/images/eventos/convencion.png' },
              { titulo: 'Auditorio',   src: '/images/eventos/auditorio.jpg'  },
              { titulo: 'Congreso',    src: '/images/eventos/congreso.jpg'   },
              { titulo: 'Concierto',   src: '/images/eventos/concierto.jpg'  },
            ].map((evento, index) => (
              <div
                key={index}
                className="
                  group relative overflow-hidden rounded-2xl aspect-[3/4] snap-center shrink-0
                  ring-1 ring-white/5 hover:ring-pink-500/40
                  transition-all duration-300
                "
              >
                <Image
                  src={evento.src}
                  alt={evento.titulo}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Vignette superior sutil */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

                {/* Franja glass en la parte inferior */}
                <div className="
                  absolute bottom-0 left-0 right-0
                  backdrop-blur-md bg-black/40
                  border-t border-white/[0.08]
                  px-4 py-4
                  translate-y-0 group-hover:-translate-y-0
                ">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0 opacity-80" />
                    <h3 className="text-white font-bold text-sm md:text-base tracking-wide text-center">
                      {evento.titulo}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Ubicación */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestra <span className="text-gradient">Ubicación</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Estratégicamente ubicados en el corazón de Bogotá, con fácil acceso
              desde los principales centros comerciales y puntos de la ciudad.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

            {/* Info card */}
            <div className="glass rounded-2xl p-8 flex flex-col gap-8">

              {/* Dirección */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-pink-600/20 border border-pink-600/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-200">Dirección</h3>
                </div>
                <p className="text-white font-bold text-2xl leading-snug">
                  Calle 19 # 65b – 67
                </p>
                <p className="text-gray-400 mt-2 text-sm tracking-wide uppercase">
                  Barrio Montevideo · Bogotá
                </p>
              </div>

              <div className="h-px bg-gray-700/40" />

              {/* Sitios estratégicos */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-200">Sitios Estratégicos</h3>
                </div>
                <ul className="grid grid-cols-2 gap-3">
                  {['Salitre Plaza', 'Plaza Central', 'Gran Estación', 'Plaza Claro'].map((lugar) => (
                    <li
                      key={lugar}
                      className="flex items-center gap-2.5 bg-gray-800/50 border border-gray-700/40 rounded-xl px-4 py-3 text-sm text-gray-300 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 shrink-0" />
                      {lugar}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Mapa */}
            <div className="glass rounded-2xl overflow-hidden min-h-[420px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.733756323297!2d-74.11448592524823!3d4.641511795333294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bee19114c83%3A0xe19b91af246e7857!2sCentro%20de%20Eventos%20Montevideo!5e0!3m2!1ses!2sco!4v1778038165845!5m2!1ses!2sco"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '420px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Centro de Eventos Montevideo"
                className="w-full h-full"
              />
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
