# Ganado App React

Sistema de gestión de ganado desarrollado con React, TypeScript, Tailwind CSS y Supabase.

## Características

- ✅ Gestión de socios (registro, listado)
- ✅ Gestión de tipos de ganado
- ✅ Registro de ganado con precios y cantidades
- ✅ Interfaz moderna y responsiva
- ✅ Base de datos en tiempo real con Supabase
- ✅ TypeScript para mayor seguridad de tipos

## Tecnologías

- **React 18** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Supabase** - Base de datos y backend
- **Vite** - Herramienta de desarrollo
- **Lucide React** - Iconos

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/ganado-app-react.git
cd ganado-app-react
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

4. Edita el archivo `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Header.tsx
│   ├── NavigationButtons.tsx
│   ├── SocioForm.tsx
│   ├── TipoGanadoModal.tsx
│   └── RegistroForm.tsx
├── config/             # Configuración
│   └── supabase.ts
├── hooks/              # Custom hooks
│   └── useSupabase.ts
├── types/              # Definiciones de tipos
│   └── index.ts
├── App.tsx             # Componente principal
└── main.tsx           # Punto de entrada
```

## Base de Datos

El proyecto requiere las siguientes tablas en Supabase:

### Tabla `socios`
```sql
CREATE TABLE socios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  cedula TEXT UNIQUE NOT NULL,
  telefono TEXT NOT NULL,
  direccion TEXT NOT NULL,
  email TEXT,
  fecha_registro TIMESTAMPTZ DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);
```

### Tabla `tipos_ganado`
```sql
CREATE TABLE tipos_ganado (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE
);
```

### Tabla `registros`
```sql
CREATE TABLE registros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  socio_id UUID REFERENCES socios(id),
  tipo_ganado_id UUID REFERENCES tipos_ganado(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2),
  total DECIMAL(10,2),
  fecha_registro TIMESTAMPTZ DEFAULT NOW(),
  observaciones TEXT
);
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.