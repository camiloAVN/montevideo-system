'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useCateringSuppliers } from '@/hooks/useCateringSuppliers'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  ArrowLeft,
  Edit,
  ShoppingBasket,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Calendar,
  FileText,
  Building2,
} from 'lucide-react'

export default function ProveedorCateringDetailPage() {
  const params = useParams()
  const { currentSupplier: supplier, isLoading, fetchSupplier } = useCateringSuppliers()
  const supplierId = params.id as string

  useEffect(() => {
    if (supplierId) fetchSupplier(supplierId)
  }, [supplierId, fetchSupplier])

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Cargando proveedor...</p>
        </div>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="text-center py-12">
        <ShoppingBasket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Proveedor no encontrado</p>
        <Link href="/dashboard/catering/proveedores">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a proveedores
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/catering/proveedores">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <ShoppingBasket className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{supplier.name}</h1>
              {supplier.city && (
                <p className="text-gray-400 mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {[supplier.city, supplier.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
        <Link href={`/dashboard/catering/proveedores/${supplier.id}/editar`}>
          <Button variant="primary">
            <Edit className="w-4 h-4 mr-2" />
            Editar Proveedor
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold">Información de Contacto</h2>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-400">Persona de Contacto</label>
                  <p className="mt-1">{supplier.contactName || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="mt-1">
                    {supplier.email ? (
                      <a
                        href={`mailto:${supplier.email}`}
                        className="text-orange-400 hover:text-orange-300 flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        {supplier.email}
                      </a>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Teléfono</label>
                  <p className="mt-1">
                    {supplier.phone ? (
                      <a
                        href={`tel:${supplier.phone}`}
                        className="text-gray-200 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        {supplier.phone}
                      </a>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Sitio Web</label>
                  <p className="mt-1">
                    {supplier.website ? (
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 flex items-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        {supplier.website}
                      </a>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Address */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold">Dirección</h2>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400">Dirección</label>
                  <p className="mt-1">{supplier.address || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Ciudad</label>
                  <p className="mt-1">{supplier.city || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">País</label>
                  <p className="mt-1">{supplier.country || '-'}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notes */}
          {supplier.notes && (
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-400" />
                  <h2 className="text-lg font-semibold">Notas</h2>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-300 whitespace-pre-wrap">{supplier.notes}</p>
              </Card.Content>
            </Card>
          )}

          {/* Fiscal */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold">Información Fiscal</h2>
              </div>
            </Card.Header>
            <Card.Content>
              <div>
                <label className="text-sm text-gray-400">NIT / Documento</label>
                <p className="mt-1 font-mono">{supplier.nit || '-'}</p>
              </div>
            </Card.Content>
          </Card>

          {/* Metadata */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold">Detalles</h2>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado</span>
                  <span
                    className={`font-semibold ${supplier.isActive ? 'text-green-400' : 'text-gray-400'}`}
                  >
                    {supplier.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Creado</span>
                  <span>{formatDate(supplier.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Actualizado</span>
                  <span>{formatDate(supplier.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ID</span>
                  <span className="font-mono text-xs text-gray-500">{supplier.id}</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold">Acciones Rápidas</h2>
            </Card.Header>
            <Card.Content className="space-y-3">
              {supplier.email && (
                <a href={`mailto:${supplier.email}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Email
                  </Button>
                </a>
              )}
              {supplier.phone && (
                <a href={`tel:${supplier.phone}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                </a>
              )}
              {supplier.website && (
                <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    Visitar Sitio Web
                  </Button>
                </a>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}
