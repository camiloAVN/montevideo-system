'use client'

import { UtensilsCrossed, Plus } from 'lucide-react'

export default function CateringMenajePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Menaje</h1>
          <p className="text-gray-400 text-sm mt-0.5">Vajilla, cristalería, cubertería y mantelería</p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-orange-600/50 text-orange-300 text-sm font-medium rounded-lg cursor-not-allowed opacity-60"
        >
          <Plus className="w-4 h-4" />
          Nuevo item
        </button>
      </div>

      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
          <UtensilsCrossed className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-200 mb-2">Menaje de Catering</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Aquí podrás gestionar el inventario de vajilla, cristalería, cubertería, mantelería y demás utensilios.
          Módulo en configuración.
        </p>
      </div>
    </div>
  )
}
