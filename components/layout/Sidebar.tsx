'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  LogOut,
  ChevronLeft,
  UserCog,
  Shield,
  Package,
  Boxes,
  Tags,
  FolderTree,
  Package2,
  UsersRound,
  Briefcase,
  UserCircle,
  ListTodo,
  History,
  Settings,
  CalendarDays,
  CalendarRange,
  UtensilsCrossed,
  ShoppingBasket,
  Layers,
  BookOpen,
  UserCheck,
  Archive,
  Users2,
  Tag,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/hooks/usePermissions'
import { SUPERADMIN_EMAIL, SystemModule } from '@/lib/validations/user'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  module: SystemModule
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { canView, isSuperAdmin, isAdmin, isLoading } = usePermissions()

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      module: 'dashboard',
    },
    {
      name: 'Proyectos',
      href: '/dashboard/proyectos',
      icon: FolderKanban,
      module: 'proyectos',
    },
    {
      name: 'Tareas',
      href: '/dashboard/tareas',
      icon: ListTodo,
      module: 'tareas',
    },
    {
      name: 'Clientes',
      href: '/dashboard/clientes',
      icon: Users,
      module: 'clientes',
    },
    {
      name: 'Cotizaciones',
      href: '/dashboard/cotizaciones',
      icon: FileText,
      module: 'cotizaciones',
    },
  ]

  const inventoryNavigation: NavItem[] = [
    {
      name: 'Inventario',
      href: '/dashboard/inventario',
      icon: Package,
      module: 'inventario',
    },
    {
      name: 'Productos',
      href: '/dashboard/inventario/productos',
      icon: Boxes,
      module: 'productos',
    },
    {
      name: 'Items',
      href: '/dashboard/inventario/items',
      icon: Tags,
      module: 'items',
    },
    {
      name: 'Grupos',
      href: '/dashboard/inventario/grupos',
      icon: Package2,
      module: 'grupos',
    },
    {
      name: 'Categorias',
      href: '/dashboard/categorias',
      icon: FolderTree,
      module: 'categorias',
    },
    {
      name: 'Historial',
      href: '/dashboard/historial',
      icon: History,
      module: 'historial',
    },
  ]

  const tercerosNavigation: NavItem[] = [
    {
      name: 'Contratistas',
      href: '/dashboard/terceros/contratistas',
      icon: UsersRound,
      module: 'contratistas',
    },
    {
      name: 'Conceptos',
      href: '/dashboard/terceros/conceptos',
      icon: Briefcase,
      module: 'conceptos',
    },
  ]

  const cateringNavigation: NavItem[] = [
    {
      name: 'Proveedores',
      href: '/dashboard/catering/proveedores',
      icon: ShoppingBasket,
      module: 'catering-proveedores',
    },
    {
      name: 'Items',
      href: '/dashboard/catering/items',
      icon: Layers,
      module: 'catering-items',
    },
    {
      name: 'Menaje',
      href: '/dashboard/catering/menaje',
      icon: UtensilsCrossed,
      module: 'catering-menaje',
    },
    {
      name: 'Menús',
      href: '/dashboard/catering/menus',
      icon: BookOpen,
      module: 'catering-menus',
    },
    {
      name: 'Personal',
      href: '/dashboard/catering/personal',
      icon: UserCheck,
      module: 'catering-personal',
    },
    {
      name: 'Paquetes',
      href: '/dashboard/catering/paquetes',
      icon: Archive,
      module: 'catering-paquetes',
    },
  ]

  const personalNavigation: NavItem[] = [
    {
      name: 'Personal',
      href: '/dashboard/personal',
      icon: Users2,
      module: 'personal',
    },
    {
      name: 'Categorías',
      href: '/dashboard/personal/categorias',
      icon: Tag,
      module: 'personal-categorias',
    },
  ]

  const configNavigation: NavItem[] = []

  const agendaNavigation: NavItem[] = [
    {
      name: 'Calendario',
      href: '/dashboard/calendario',
      icon: CalendarDays,
      module: 'calendario',
    },
    {
      name: 'Agenda',
      href: '/dashboard/agenda',
      icon: CalendarRange,
      module: 'agenda',
    },
  ]

  // Filtrar items según permisos
  const filterByPermission = (items: NavItem[]) => {
    return items.filter((item) => canView(item.module))
  }

  const filteredNavigation = filterByPermission(navigation)
  const filteredInventory = filterByPermission(inventoryNavigation)
  const filteredTerceros = filterByPermission(tercerosNavigation)
  const filteredCatering = filterByPermission(cateringNavigation)
  const filteredPersonal = filterByPermission(personalNavigation)
  const filteredConfig = filterByPermission(configNavigation)
  const filteredAgenda = filterByPermission(agendaNavigation)

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  // Renderizar lista de navegación
  const renderNavList = (
    items: NavItem[],
    activeColor: string,
    activeBorder: string
  ) => (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const active = isActive(item.href)
        return (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                active
                  ? `${activeColor} ${activeBorder}`
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 border-r border-white/5 bg-[#0F0F0F] transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image
                src="/images/logos/logo_motevideo.png"
                alt="Logo"
                width={0}
                height={0}
                sizes="100vw"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Close button (mobile only) */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-5">
            {/* Loading state */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Main Navigation */}
                {filteredNavigation.length > 0 &&
                  renderNavList(
                    filteredNavigation,
                    'bg-pink-600/10 text-pink-400',
                    'border border-pink-600/20'
                  )}

                {/* Inventory Section */}
                {filteredInventory.length > 0 && (
                  <>
                    <div className="mt-6 mb-2 px-4">
                      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <Package className="w-3 h-3" />
                        Inventario
                      </p>
                    </div>
                    {renderNavList(
                      filteredInventory,
                      'bg-emerald-500/10 text-emerald-400',
                      'border border-emerald-500/20'
                    )}
                  </>
                )}

                {/* Terceros Section */}
                {filteredTerceros.length > 0 && (
                  <>
                    <div className="mt-6 mb-2 px-4">
                      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <UsersRound className="w-3 h-3" />
                        Terceros
                      </p>
                    </div>
                    {renderNavList(
                      filteredTerceros,
                      'bg-violet-500/10 text-violet-400',
                      'border border-violet-500/20'
                    )}
                  </>
                )}

                {/* Catering Section */}
                {filteredCatering.length > 0 && (
                  <>
                    <div className="mt-6 mb-2 px-4">
                      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <UtensilsCrossed className="w-3 h-3" />
                        Catering
                      </p>
                    </div>
                    {renderNavList(
                      filteredCatering,
                      'bg-orange-500/10 text-orange-400',
                      'border border-orange-500/20'
                    )}
                  </>
                )}

                {/* Personal Section */}
                {filteredPersonal.length > 0 && (
                  <>
                    <div className="mt-6 mb-2 px-4">
                      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <Users2 className="w-3 h-3" />
                        Personal
                      </p>
                    </div>
                    {renderNavList(
                      filteredPersonal,
                      'bg-teal-500/10 text-teal-400',
                      'border border-teal-500/20'
                    )}
                  </>
                )}

                {/* Agenda Section */}
                {filteredAgenda.length > 0 && (
                  <>
                    <div className="mt-6 mb-2 px-4">
                      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <CalendarDays className="w-3 h-3" />
                        Agenda
                      </p>
                    </div>
                    {renderNavList(
                      filteredAgenda,
                      'bg-sky-500/10 text-sky-400',
                      'border border-sky-500/20'
                    )}
                  </>
                )}

                {/* Config Section */}
                {filteredConfig.length > 0 && (
                  <>
                    <div className="mt-6 mb-2 px-4">
                      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <FolderTree className="w-3 h-3" />
                        Configuracion
                      </p>
                    </div>
                    {renderNavList(
                      filteredConfig,
                      'bg-zinc-500/10 text-zinc-300',
                      'border border-zinc-500/20'
                    )}
                  </>
                )}

                {/* Admin Section */}
                {isAdmin && (
                  <>
                    <div className="mt-6 mb-2 px-4">
                      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Administracion
                      </p>
                    </div>
                    <ul className="space-y-0.5">
                      <li>
                        <Link
                          href="/dashboard/usuarios"
                          onClick={onClose}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                            isActive('/dashboard/usuarios')
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                          )}
                        >
                          <UserCog className="w-4 h-4" />
                          Usuarios
                        </Link>
                      </li>
                    </ul>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Settings button */}
          <div className="px-3 pb-2">
            <Link
              href="/dashboard/configuracion"
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive('/dashboard/configuracion')
                  ? 'bg-pink-600/10 text-pink-400 border border-pink-600/20'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              )}
            >
              <Settings className="w-4 h-4 shrink-0" />
              Configuración
            </Link>
          </div>

          {/* User Section */}
          <div className="border-t border-white/5 p-4">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
                isSuperAdmin
                  ? 'bg-gradient-to-br from-pink-600 to-rose-600'
                  : 'bg-gradient-to-br from-pink-600 to-pink-400'
              )}>
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate flex items-center gap-1">
                  {user?.name || 'Usuario'}
                  {isSuperAdmin && (
                    <Shield className="w-3 h-3 text-pink-400" />
                  )}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="space-y-0.5">
              <Link
                href="/dashboard/perfil"
                onClick={onClose}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === '/dashboard/perfil'
                    ? 'bg-pink-600/10 text-pink-400 border border-pink-600/20'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                )}
              >
                <UserCircle className="w-4 h-4" />
                Mi Perfil
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesion
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
