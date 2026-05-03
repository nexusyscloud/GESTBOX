/*
  # Crear tabla recepciones

  1. Nueva tabla `recepciones`
     - Registra cada ingreso físico de un vehículo al taller
     - Separada de ordenes_trabajo: la recepción es el evento de ingreso
     - Columnas:
       - id (uuid, pk)
       - empresa_id (uuid, not null)
       - sucursal_id (uuid, nullable)
       - cliente_id (uuid, FK → clientes)
       - vehiculo_id (uuid, FK → vehiculos)
       - kilometraje (integer, nullable)
       - nivel_combustible (integer 0-4, nullable)
       - motivo_ingreso (text) — tipo de servicio solicitado
       - observaciones (text, nullable) — observaciones adicionales
       - estado (text, default 'abierto')
       - prioridad (text, default 'normal')
       - asesor (text, nullable)
       - fecha_entrega_prometida (date, nullable)
       - checklist (jsonb, nullable) — accesorios del vehículo
       - danos_exteriores (jsonb, nullable) — daños visibles
       - created_at, updated_at

  2. Seguridad
     - RLS habilitado
     - Políticas para usuarios autenticados
*/

CREATE TABLE IF NOT EXISTS recepciones (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id              uuid NOT NULL,
  sucursal_id             uuid,
  cliente_id              uuid REFERENCES clientes(id),
  vehiculo_id             uuid REFERENCES vehiculos(id),
  kilometraje             integer,
  nivel_combustible       integer CHECK (nivel_combustible BETWEEN 0 AND 4),
  motivo_ingreso          text NOT NULL,
  observaciones           text,
  estado                  text NOT NULL DEFAULT 'abierto',
  prioridad               text NOT NULL DEFAULT 'normal',
  asesor                  text,
  fecha_entrega_prometida date,
  checklist               jsonb,
  danos_exteriores        jsonb,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS recepciones_empresa_id_idx   ON recepciones(empresa_id);
CREATE INDEX IF NOT EXISTS recepciones_cliente_id_idx   ON recepciones(cliente_id);
CREATE INDEX IF NOT EXISTS recepciones_vehiculo_id_idx  ON recepciones(vehiculo_id);
CREATE INDEX IF NOT EXISTS recepciones_estado_idx       ON recepciones(estado);

ALTER TABLE recepciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select recepciones"
  ON recepciones FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert recepciones"
  ON recepciones FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recepciones"
  ON recepciones FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
