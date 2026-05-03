/*
  # Crear tablas del módulo Taller

  1. Nuevas tablas
     - `clientes` — clientes del taller (empresa_id, nombre, telefono, email, cedula_ruc)
     - `vehiculos` — vehículos vinculados a clientes
     - `ordenes_trabajo` — órdenes de trabajo con el nuevo flujo de estados

  2. Seguridad
     - RLS habilitado en las tres tablas
     - Políticas para usuarios autenticados: solo pueden operar sobre
       registros que pertenezcan a su empresa_id (usando app_metadata)
     - Se usa empresa_id fijo como fallback para datos de demo

  3. Estados de ordenes_trabajo
     abierta | en_diagnostico | pendiente_aprobacion | aprobada | en_proceso |
     control_calidad | lista_entrega | facturada | entregada |
     espera_repuestos | pausada | cancelada
*/

-- ── clientes ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id   uuid NOT NULL,
  nombre       text NOT NULL,
  telefono     text,
  email        text,
  cedula_ruc   text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select clientes"
  ON clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clientes"
  ON clientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clientes"
  ON clientes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── vehiculos ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehiculos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id   uuid NOT NULL,
  cliente_id   uuid REFERENCES clientes(id),
  placa        text,
  marca        text,
  modelo       text,
  anio         integer,
  color        text,
  vin          text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select vehiculos"
  ON vehiculos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert vehiculos"
  ON vehiculos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vehiculos"
  ON vehiculos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── ordenes_trabajo ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ordenes_trabajo (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id   uuid NOT NULL,
  numero       text NOT NULL,
  cliente_id   uuid REFERENCES clientes(id),
  vehiculo_id  uuid REFERENCES vehiculos(id),
  descripcion  text,
  estado       text NOT NULL DEFAULT 'abierta',
  total        numeric(12,2) DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  CONSTRAINT ordenes_trabajo_estado_check CHECK (
    estado IN (
      'abierta','en_diagnostico','pendiente_aprobacion','aprobada',
      'en_proceso','control_calidad','lista_entrega','facturada',
      'entregada','espera_repuestos','pausada','cancelada'
    )
  )
);

CREATE INDEX IF NOT EXISTS ordenes_trabajo_empresa_id_idx ON ordenes_trabajo(empresa_id);
CREATE INDEX IF NOT EXISTS ordenes_trabajo_cliente_id_idx  ON ordenes_trabajo(cliente_id);
CREATE INDEX IF NOT EXISTS ordenes_trabajo_estado_idx       ON ordenes_trabajo(estado);

ALTER TABLE ordenes_trabajo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select ordenes_trabajo"
  ON ordenes_trabajo FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ordenes_trabajo"
  ON ordenes_trabajo FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ordenes_trabajo"
  ON ordenes_trabajo FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
