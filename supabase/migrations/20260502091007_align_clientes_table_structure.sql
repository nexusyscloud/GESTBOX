/*
  # Alinear tabla clientes con estructura real del sistema

  1. Cambios en tabla `clientes`
     - Renombrar columna `cedula_ruc` → `identificacion`
     - Agregar columna `direccion` (text, nullable)
     - Agregar columna `estado` (text, default 'activo')

  2. Sin cambios en RLS ni en otras tablas
  3. Los datos existentes se preservan (cedula_ruc migra a identificacion)
*/

DO $$
BEGIN
  -- Renombrar cedula_ruc → identificacion si aún existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'cedula_ruc'
  ) THEN
    ALTER TABLE clientes RENAME COLUMN cedula_ruc TO identificacion;
  END IF;

  -- Agregar columna direccion si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'direccion'
  ) THEN
    ALTER TABLE clientes ADD COLUMN direccion text;
  END IF;

  -- Agregar columna estado si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'estado'
  ) THEN
    ALTER TABLE clientes ADD COLUMN estado text NOT NULL DEFAULT 'activo';
  END IF;
END $$;
