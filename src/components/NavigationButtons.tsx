import React from 'react'
import { Users, Beef, FileText, Plus } from 'lucide-react'

interface NavigationButtonsProps {
  activeView: string
  onViewChange: (view: string) => void
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  activeView, 
  onViewChange 
}) => {
  const buttons = [
    { id: 'socios', label: 'Socios', icon: Users },
    { id: 'tipos', label: 'Tipos de Ganado', icon: Beef },
    { id: 'registros', label: 'Registros', icon: FileText },
    { id: 'nuevo-registro', label: 'Nuevo Registro', icon: Plus }
  ]

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 py-4">
          {buttons.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}