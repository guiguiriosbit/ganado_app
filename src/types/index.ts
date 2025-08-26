export interface Socio {
  id?: string
  nombre: string
  apellido: string
  cedula: string
  telefono: string
  direccion: string
  email?: string
  fecha_registro?: string
  activo?: boolean
}

export interface TipoGanado {
  id?: string
  nombre: string
  descripcion?: string
  activo?: boolean
}

export interface Registro {
  id?: string
  socio_id: string
  tipo_ganado_id: string
  cantidad: number
  fecha_registro: string
  observaciones?: string
  precio_unitario?: number
  total?: number
}

export interface RegistroCompleto extends Registro {
  socio?: Socio
  tipo_ganado?: TipoGanado
}