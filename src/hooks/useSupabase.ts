import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import type { Socio, TipoGanado, Registro, RegistroCompleto } from '../types'

export const useSupabase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Socios
  const [socios, setSocios] = useState<Socio[]>([])
  const [tiposGanado, setTiposGanado] = useState<TipoGanado[]>([])
  const [registros, setRegistros] = useState<RegistroCompleto[]>([])

  const handleError = (error: any, message: string) => {
    console.error(message, error)
    setError(error.message || message)
    setLoading(false)
  }

  // Cargar socios
  const cargarSocios = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('socios')
        .select('*')
        .eq('activo', true)
        .order('nombre')
      
      if (error) throw error
      setSocios(data || [])
    } catch (error) {
      handleError(error, 'Error al cargar socios')
    } finally {
      setLoading(false)
    }
  }

  // Crear socio
  const crearSocio = async (socio: Omit<Socio, 'id'>) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('socios')
        .insert([socio])
        .select()
        .single()
      
      if (error) throw error
      setSocios(prev => [...prev, data])
      return data
    } catch (error) {
      handleError(error, 'Error al crear socio')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Cargar tipos de ganado
  const cargarTiposGanado = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('tipos_ganado')
        .select('*')
        .eq('activo', true)
        .order('nombre')
      
      if (error) throw error
      setTiposGanado(data || [])
    } catch (error) {
      handleError(error, 'Error al cargar tipos de ganado')
    } finally {
      setLoading(false)
    }
  }

  // Crear tipo de ganado
  const crearTipoGanado = async (tipo: Omit<TipoGanado, 'id'>) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('tipos_ganado')
        .insert([tipo])
        .select()
        .single()
      
      if (error) throw error
      setTiposGanado(prev => [...prev, data])
      return data
    } catch (error) {
      handleError(error, 'Error al crear tipo de ganado')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Cargar registros
  const cargarRegistros = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('registros')
        .select(`
          *,
          socio:socios(*),
          tipo_ganado:tipos_ganado(*)
        `)
        .order('fecha_registro', { ascending: false })
      
      if (error) throw error
      setRegistros(data || [])
    } catch (error) {
      handleError(error, 'Error al cargar registros')
    } finally {
      setLoading(false)
    }
  }

  // Crear registro
  const crearRegistro = async (registro: Omit<Registro, 'id'>) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('registros')
        .insert([registro])
        .select(`
          *,
          socio:socios(*),
          tipo_ganado:tipos_ganado(*)
        `)
        .single()
      
      if (error) throw error
      setRegistros(prev => [data, ...prev])
      return data
    } catch (error) {
      handleError(error, 'Error al crear registro')
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarSocios()
    cargarTiposGanado()
    cargarRegistros()
  }, [])

  return {
    loading,
    error,
    socios,
    tiposGanado,
    registros,
    cargarSocios,
    crearSocio,
    cargarTiposGanado,
    crearTipoGanado,
    cargarRegistros,
    crearRegistro,
    setError
  }
}