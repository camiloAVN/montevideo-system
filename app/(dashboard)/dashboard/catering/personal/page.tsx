'use client'

import { UserCheck, Plus } from 'lucide-react'

export default function CateringPersonalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Personal</h1>
          <p className="text-gray-400 text-sm mt-0.5">Chefs, meseros, bartenders y personal de apoyo</p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-orange-600/50 text-orange-300 text-sm font-medium rounded-lg cursor-not-allowed opacity-60"
        >
          <Plus className="w-4 h-4" />
          Nuevo personal
        </button>
      </div>

      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
          <UserCheck className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-200 mb-2">Personal de Catering</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Aquí podrás gestionar el personal disponible para eventos de catering: chefs, meseros, bartenders, coordinadores y auxiliares.
          Módulo en configuración.
        </p>
      </div>
    </div>
  )
}
