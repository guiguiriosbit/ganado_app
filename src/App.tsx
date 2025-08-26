import React, { useState } from 'react'
import { Header } from './components/Header'
import { ConnectionStatus } from './components/ConnectionStatus'
import { NavigationButtons } from './components/NavigationButtons'
import { SocioForm } from './components/SocioForm'
import { TipoGanadoModal } from './components/TipoGanadoModal'
import { RegistroForm } from './components/RegistroForm'
import { useSupabase } from './hooks/useSupabase'
import { Users, Beef, FileText, Calendar, DollarSign, AlertCircle } from 'lucide-react'

function App() {
  const [activeView, setActiveView] = useState('socios')
  const [showTipoModal, setShowTipoModal] = useState(false)
  
  const {
    loading,
    error,
    socios,
    tiposGanado,
    registros,
    crearSocio,
    crearTipoGanado,
    crearRegistro,
    setError
  } = useSupabase()

  const handleCreateSocio = async (socioData: any) => {
    const result = await crearSocio(socioData)
    if (result) {
      alert('Socio registrado exitosamente')
    }
  }

  const handleCreateTipoGanado = async (tipoData: any) => {
    const result = await crearTipoGanado(tipoData)
    if (result) {
      alert('Tipo de ganado creado exitosamente')
    }
  }

  const handleCreateRegistro = async (registroData: any) => {
    const result = await crearRegistro(registroData)
    if (result) {
      alert('Registro creado exitosamente')
      setActiveView('registros')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const renderContent = () => {
    switch (activeView) {
      case 'socios':
        return (
          <div className="space-y-6">
            <SocioForm onSubmit={handleCreateSocio} loading={loading} />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lista de Socios ({socios.length})
              </h3>
              
              {socios.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay socios registrados</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Nombre</th>
                        <th className="text-left py-2">Cédula</th>
                        <th className="text-left py-2">Teléfono</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Fecha Registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {socios.map(socio => (
                        <tr key={socio.id} className="border-b hover:bg-gray-50">
                          <td className="py-2">{socio.nombre} {socio.apellido}</td>
                          <td className="py-2">{socio.cedula}</td>
                          <td className="py-2">{socio.telefono}</td>
                          <td className="py-2">{socio.email || '-'}</td>
                          <td className="py-2">
                            {socio.fecha_registro ? formatDate(socio.fecha_registro) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )

      case 'tipos':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Beef className="w-5 h-5" />
                Tipos de Ganado ({tiposGanado.length})
              </h3>
              <button
                onClick={() => setShowTipoModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Beef className="w-4 h-4" />
                Agregar Tipo
              </button>
            </div>
            
            {tiposGanado.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay tipos de ganado registrados</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tiposGanado.map(tipo => (
                  <div key={tipo.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800">{tipo.nombre}</h4>
                    {tipo.descripcion && (
                      <p className="text-gray-600 text-sm mt-1">{tipo.descripcion}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'registros':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Registros de Ganado ({registros.length})
            </h3>
            
            {registros.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay registros de ganado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Fecha</th>
                      <th className="text-left py-2">Socio</th>
                      <th className="text-left py-2">Tipo</th>
                      <th className="text-left py-2">Cantidad</th>
                      <th className="text-left py-2">Precio Unit.</th>
                      <th className="text-left py-2">Total</th>
                      <th className="text-left py-2">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.map(registro => (
                      <tr key={registro.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(registro.fecha_registro)}
                        </td>
                        <td className="py-2">
                          {registro.socio ? 
                            `${registro.socio.nombre} ${registro.socio.apellido}` : 
                            'N/A'
                          }
                        </td>
                        <td className="py-2">
                          {registro.tipo_ganado?.nombre || 'N/A'}
                        </td>
                        <td className="py-2">{registro.cantidad}</td>
                        <td className="py-2">
                          {registro.precio_unitario ? 
                            formatCurrency(registro.precio_unitario) : 
                            '-'
                          }
                        </td>
                        <td className="py-2 flex items-center gap-1">
                          {registro.total ? (
                            <>
                              <DollarSign className="w-4 h-4 text-green-600" />
                              {formatCurrency(registro.total)}
                            </>
                          ) : '-'}
                        </td>
                        <td className="py-2">
                          {registro.observaciones || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )

      case 'nuevo-registro':
        return (
          <RegistroForm
            socios={socios}
            tiposGanado={tiposGanado}
            onSubmit={handleCreateRegistro}
            onOpenTipoModal={() => setShowTipoModal(true)}
            loading={loading}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Sistema de Gestión de Ganado" />
      <NavigationButtons activeView={activeView} onViewChange={setActiveView} />
      
      <main className="container mx-auto px-4 py-8">
        <ConnectionStatus />
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}
        
        {renderContent()}
      </main>

      <TipoGanadoModal
        isOpen={showTipoModal}
        onClose={() => setShowTipoModal(false)}
        onSubmit={handleCreateTipoGanado}
        loading={loading}
      />
    </div>
  )
}

export default App