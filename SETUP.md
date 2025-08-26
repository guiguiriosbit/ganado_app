# Configuración de Supabase para Ganado App

## Paso 1: Crear cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto

## Paso 2: Obtener las credenciales

1. En tu dashboard de Supabase, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** (algo como: `https://abcdefgh.supabase.co`)
   - **anon public key** (una clave larga que empieza con `eyJ...`)

## Paso 3: Configurar variables de entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza los valores:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
   ```

## Paso 4: Crear las tablas en Supabase

1. En tu dashboard de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido del archivo `supabase/migrations/create_ganado_schema.sql`
3. Ejecuta el script haciendo clic en **Run**

## Paso 5: Verificar la instalación

1. Reinicia el servidor de desarrollo: `npm run dev`
2. La aplicación debería conectarse automáticamente
3. Prueba registrando un socio para verificar que funciona

## Estructura de la Base de Datos

### Tabla `socios`
- Información de los socios/miembros
- Campos: nombre, apellido, cédula, teléfono, dirección, email

### Tabla `tipos_ganado`
- Tipos de ganado disponibles
- Campos: nombre, descripción
- Incluye tipos predeterminados: Vacas, Toros, Terneros, etc.

### Tabla `registros`
- Registros de ganado por socio
- Campos: socio, tipo de ganado, cantidad, precio, total, observaciones

## Solución de Problemas

### Error de conexión
- Verifica que las URLs y claves sean correctas
- Asegúrate de que no haya espacios extra en las variables de entorno

### Error de permisos
- Verifica que las políticas RLS estén configuradas correctamente
- El script de migración incluye políticas públicas para facilitar el desarrollo

### Tablas no encontradas
- Ejecuta nuevamente el script SQL en el SQL Editor de Supabase
- Verifica que todas las tablas se hayan creado correctamente en la sección **Table Editor**