import React, { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import type { Socio, TipoGanado, Registro } from '../types'

interface RegistroFormProps {
  socios: Socio[]
  tiposGanado: TipoGanado[]
  onSubmit: (registro: Omit<Registro, 'id'>) => Promise<void>
  onOpenTipoModal: () => void
  loading: boolean
}

export const RegistroForm: React.FC<RegistroFormProps> = ({
  socios,
  tiposGanado,
  onSubmit,
  onOpenTipoModal,
  loading
}) => {
  const [formData, setFormData] = useState({
    socio_id: '',
    tipo_ganado_id: '',
    cantidad: '',
    precio_unitario: '',
    observaciones: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cantidad = parseInt(formData.cantidad)
    const precioUnitario = parseFloat(formData.precio_unitario) || 0
    
    await onSubmit({
      socio_id: formData.socio_id,
      tipo_ganado_id: formData.tipo_ganado_id,
      cantidad,
      precio_unitario: precioUnitario,
      total: cantidad * precioUnitario,
      fecha_registro: new Date().toISOString(),
      observaciones: formData.observaciones || undefined
    })
    
    setFormData({
      socio_id: '',
      tipo_ganado_id: '',
      cantidad: '',
      precio_unitario: '',
      observaciones: ''
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const calcularTotal = () => {
    const cantidad = parseInt(formData.cantidad) || 0
    const precio = parseFloat(formData.precio_unitario) || 0
    return cantidad * precio
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Nuevo Registro de Ganado
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Socio *
          </label>
          <select
            name="socio_id"
            value={formData.socio_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Seleccione un socio</option>
            {socios.map(socio => (
              <option key={socio.id} value={socio.id}>
                {socio.nombre} {socio.apellido} - {socio.cedula}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Ganado *
          </label>
          <div className="flex gap-2">
            <select
              name="tipo_ganado_id"
              value={formData.tipo_ganado_id}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccione un tipo</option>
              {tiposGanado.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onOpenTipoModal}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center gap-1"
              title="Agregar nuevo tipo"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad *
            </label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Número de animales"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Unitario (opcional)
            </label>
            <input
              type="number"
              name="precio_unitario"
              value={formData.precio_unitario}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {(formData.cantidad && formData.precio_unitario) && (
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-green-800">
              <strong>Total: ${calcularTotal().toFixed(2)}</strong>
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones (opcional)
          </label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Notas adicionales sobre el registro"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !formData.socio_id || !formData.tipo_ganado_id || !formData.cantidad}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registrando...' : 'Crear Registro'}
        </button>
      </form>
    </div>
  )
}