import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Plus, FileText, Users, FolderKanban } from 'lucide-react'

const quickActions = [
  {
    title: 'Nuevo Proyecto',
    description: 'Crear un nuevo proyecto',
    href: '/dashboard/proyectos/nuevo',
    icon: FolderKanban,
    color: 'from-pink-600 to-rose-500',
  },
  {
    title: 'Nuevo Cliente',
    description: 'Agregar un nuevo cliente',
    href: '/dashboard/clientes/nuevo',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Nueva Cotización',
    description: 'Generar una cotización',
    href: '/dashboard/cotizaciones/nuevo',
    icon: FileText,
    color: 'from-violet-500 to-purple-600',
  },
]

export function QuickActions() {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 p-4 rounded-lg glass border border-white/5 hover:border-pink-600/30 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-pink-400 transition-colors">
                    {action.title}
                  </p>
                  <p className="text-xs text-zinc-500">{action.description}</p>
                </div>

                <Plus className="w-5 h-5 text-zinc-600 group-hover:text-pink-400 transition-colors" />
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
