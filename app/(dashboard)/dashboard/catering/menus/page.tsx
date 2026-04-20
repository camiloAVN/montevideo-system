'use client'

import { BookOpen, Plus } from 'lucide-react'

export default function CateringMenusPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Menús</h1>
          <p className="text-gray-400 text-sm mt-0.5">Catálogo de menús disponibles para eventos</p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-orange-600/50 text-orange-300 text-sm font-medium rounded-lg cursor-not-allowed opacity-60"
        >
          <Plus className="w-4 h-4" />
          Nuevo menú
        </button>
      </div>

      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-200 mb-2">Menús de Catering</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Aquí podrás gestionar los menús disponibles para eventos: desayunos, almuerzos, cenas, cócteles, coffee breaks y más.
          Módulo en configuración.
        </p>
      </div>
    </div>
  )
}
