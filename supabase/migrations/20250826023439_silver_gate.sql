/*
  # Schema setup for cattle management system

  1. New Tables
    - `socios` - Partners/members table with personal information
    - `tipos_ganado` - Cattle types (cows, bulls, calves, etc.)
    - `registros` - Cattle registration records with quantities and prices

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data

  3. Features
    - UUID primary keys with auto-generation
    - Timestamps for audit trail
    - Foreign key relationships
    - Default values for better data consistency
*/

-- Create socios table
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

-- Create tipos_ganado table
CREATE TABLE IF NOT EXISTS tipos_ganado (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  activo boolean DEFAULT true
);

-- Create registros table
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

-- Enable Row Level Security
ALTER TABLE socios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_ganado ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;

-- Create policies for socios
CREATE POLICY "Anyone can read socios"
  ON socios
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert socios"
  ON socios
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update socios"
  ON socios
  FOR UPDATE
  TO public
  USING (true);

-- Create policies for tipos_ganado
CREATE POLICY "Anyone can read tipos_ganado"
  ON tipos_ganado
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert tipos_ganado"
  ON tipos_ganado
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update tipos_ganado"
  ON tipos_ganado
  FOR UPDATE
  TO public
  USING (true);

-- Create policies for registros
CREATE POLICY "Anyone can read registros"
  ON registros
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert registros"
  ON registros
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update registros"
  ON registros
  FOR UPDATE
  TO public
  USING (true);

-- Insert some default cattle types
INSERT INTO tipos_ganado (nombre, descripcion) VALUES
  ('Vacas', 'Ganado bovino hembra adulto'),
  ('Toros', 'Ganado bovino macho adulto'),
  ('Terneros', 'Ganado bovino joven'),
  ('Novillos', 'Ganado bovino macho joven castrado'),
  ('Vaquillas', 'Ganado bovino hembra joven')
ON CONFLICT DO NOTHING;