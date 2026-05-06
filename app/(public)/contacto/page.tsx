import { ContactForm } from '@/components/forms/ContactForm'
import { Card } from '@/components/ui/Card'
import { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto - Montevideo Convention Center',
  description: 'Contáctanos para cotizar tu evento. Estamos listos para hacer realidad tu próxima experiencia.',
}

export default function ContactoPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@Montevideoconventioncenter.com',
      link: 'mailto:info@Montevideoconventioncenter.com',
    },
    {
      icon: Phone,
      title: 'Teléfono',
      value: '+57 311 455 7229',
      link: 'tel:+573114557229',
    },
    {
      icon: MapPin,
      title: 'Dirección',
      value: 'Calle 19 # 65b – 67, Barrio Montevideo, Bogotá',
      link: null,
    },
    {
      icon: Clock,
      title: 'Horario de Atención',
      value: 'Lun – Vie: 8:00 am – 5:00 pm',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen py-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hablemos de tu <span className="text-gradient">Evento</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            ¿Tienes un evento en mente? Estamos aquí para hacerlo realidad.
            Completa el formulario y uno de nuestros asesores se pondrá en contacto contigo.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card variant="glass">
              <h2 className="text-2xl font-bold mb-6">
                Información de <span className="text-gradient">Contacto</span>
              </h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pink-600/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-200 hover:text-pink-400 transition-colors break-all"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-200">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Por qué elegirnos */}
            <Card variant="gradient" className="border-pink-600/20">
              <h3 className="text-lg font-bold mb-3">¿Por qué elegirnos?</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                  <span>Asesoría personalizada para tu evento</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                  <span>Espacios para hasta 5.000 personas</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                  <span>Producción audiovisual profesional incluida</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                  <span>Equipo con amplia experiencia en eventos</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card variant="glass">
              <h2 className="text-2xl font-bold mb-6">
                Envíanos un <span className="text-gradient">Mensaje</span>
              </h2>
              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
