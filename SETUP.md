# Integración con tu proyecto Supabase existente

## 🔧 Configuración Rápida

### Paso 1: Obtener las credenciales de tu proyecto

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. En el dashboard, ve a **Settings** → **API**
3. Copia los siguientes valores:
   - **Project URL** (algo como: `https://abcdefgh.supabase.co`)
   - **anon public key** (una clave larga que empieza con `eyJ...`)

### Paso 2: Configurar variables de entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza los valores con los de tu proyecto:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
   ```

### Paso 3: Verificar las tablas (si no las tienes)

Si tu proyecto no tiene las tablas necesarias, ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- Crear tabla socios
CREATE TABLE IF NOT EXISTS socios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  apellido text NOT NULL,
  cedula text UNIQUE NOT NULL,
  telefono text NOT NULL,
  direccion text NOT NULL,
  email text,
  fecha_registro timestamptz DEFAULT now(),
  activo boolean DEFAULT true
);

-- Crear tabla tipos_ganado
CREATE TABLE IF NOT EXISTS tipos_ganado (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  activo boolean DEFAULT true
);

-- Crear tabla registros
CREATE TABLE IF NOT EXISTS registros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid REFERENCES socios(id) ON DELETE CASCADE,
  tipo_ganado_id uuid REFERENCES tipos_ganado(id) ON DELETE CASCADE,
  cantidad integer NOT NULL CHECK (cantidad > 0),
  precio_unitario decimal(10,2) DEFAULT 0,
  total decimal(10,2) DEFAULT 0,
  fecha_registro timestamptz DEFAULT now(),
  observaciones text
);

-- Habilitar Row Level Security
ALTER TABLE socios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_ganado ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;

-- Políticas para acceso público (desarrollo)
CREATE POLICY "Public access" ON socios FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON tipos_ganado FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON registros FOR ALL TO public USING (true) WITH CHECK (true);

-- Insertar tipos de ganado por defecto
INSERT INTO tipos_ganado (nombre, descripcion) VALUES
  ('Vacas', 'Ganado bovino hembra adulto'),
  ('Toros', 'Ganado bovino macho adulto'),
  ('Terneros', 'Ganado bovino joven'),
  ('Novillos', 'Ganado bovino macho joven castrado'),
  ('Vaquillas', 'Ganado bovino hembra joven')
ON CONFLICT DO NOTHING;
```

### Paso 4: Reiniciar la aplicación

1. Guarda los cambios en el archivo `.env`
2. La aplicación se recargará automáticamente
3. Verifica el indicador de conexión en la parte superior

## ✅ Verificación

- El indicador de conexión debe mostrar "Conectado a Supabase" en verde
- Deberías poder registrar socios y crear registros
- Los datos se guardarán en tu base de datos de Supabase

## 🔍 Solución de Problemas

### Error de conexión
- Verifica que las URLs y claves sean correctas
- Asegúrate de que no haya espacios extra en las variables de entorno
- Revisa que el proyecto esté activo en Supabase

### Error de permisos
- Verifica que las políticas RLS estén configuradas
- Asegúrate de que las tablas existan en tu base de datos

### Tablas no encontradas
- Ejecuta el script SQL proporcionado arriba
- Verifica en **Table Editor** que las tablas se crearon correctamente

## 📊 Estructura de Datos

La aplicación espera estas tablas:

- **socios**: Información de los miembros/socios
- **tipos_ganado**: Tipos de ganado disponibles
- **registros**: Registros de ganado por socio con cantidades y precios

¡Una vez configurado, tendrás un sistema completo de gestión de ganado funcionando!