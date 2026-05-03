/*
  # Alinear tabla ordenes_trabajo con el flujo de recepción

  1. Cambios en tabla `ordenes_trabajo`
     - Renombrar columna `numero` → `numero_ot`
     - Agregar columna `sucursal_id` (uuid, nullable)
     - Agregar columna `recepcion_id` (uuid, nullable, FK → recepciones)
     - Agregar columna `prioridad` (text, default 'normal')
     - Agregar columna `asesor` (text, nullable)
     - Agregar columna `fecha_recepcion` (timestamptz, nullable)
     - Actualizar constraint de estado para incluir 'recepcion'

  2. Sin pérdida de datos — todas las operaciones son aditivas o renombrados seguros
*/

DO $$
BEGIN
  -- Renombrar numero → numero_ot si aún se llama numero
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ordenes_trabajo' AND column_name = 'numero'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ordenes_trabajo' AND column_name = 'numero_ot'
  ) THEN
    ALTER TABLE ordenes_trabajo RENAME COLUMN numero TO numero_ot;
  END IF;

  -- Agregar sucursal_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ordenes_trabajo' AND column_name = 'sucursal_id'
  ) THEN
    ALTER TABLE ordenes_trabajo ADD COLUMN sucursal_id uuid;
  END IF;

  -- Agregar recepcion_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ordenes_trabajo' AND column_name = 'recepcion_id'
  ) THEN
    ALTER TABLE ordenes_trabajo ADD COLUMN recepcion_id uuid REFERENCES recepciones(id);
  END IF;

  -- Agregar prioridad
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ordenes_trabajo' AND column_name = 'prioridad'
  ) THEN
    ALTER TABLE ordenes_trabajo ADD COLUMN prioridad text NOT NULL DEFAULT 'normal';
  END IF;

  -- Agregar asesor
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ordenes_trabajo' AND column_name = 'asesor'
  ) THEN
    ALTER TABLE ordenes_trabajo ADD COLUMN asesor text;
  END IF;

  -- Agregar fecha_recepcion
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ordenes_trabajo' AND column_name = 'fecha_recepcion'
  ) THEN
    ALTER TABLE ordenes_trabajo ADD COLUMN fecha_recepcion timestamptz;
  END IF;
END $$;

-- Eliminar constraint de estado anterior y crear uno nuevo que incluya 'recepcion'
DO $$
BEGIN
  ALTER TABLE ordenes_trabajo DROP CONSTRAINT IF EXISTS ordenes_trabajo_estado_check;
  ALTER TABLE ordenes_trabajo ADD CONSTRAINT ordenes_trabajo_estado_check CHECK (
    estado IN (
      'recepcion','abierta','en_diagnostico','pendiente_aprobacion','aprobada',
      'en_proceso','control_calidad','lista_entrega','facturada',
      'entregada','espera_repuestos','pausada','cancelada'
    )
  );
EXCEPTION WHEN others THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS ordenes_trabajo_numero_ot_idx    ON ordenes_trabajo(numero_ot);
CREATE INDEX IF NOT EXISTS ordenes_trabajo_recepcion_id_idx ON ordenes_trabajo(recepcion_id);
