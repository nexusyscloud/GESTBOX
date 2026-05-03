/*
  # AI Module Tables for GESTBOX

  1. New Tables
    - `ai_interactions` - Logs all AI interactions per vehicle/work order
    - `ai_suggestions` - Stores AI-generated suggestions before approval
    - `ai_work_order_history` - Historical records of AI suggestions per work order
    
  2. Relationships
    - Links to existing users table for role-based access
    - Tracks which user approved/rejected AI suggestions
    - Stores vehicle and work order context
    
  3. Security
    - RLS enabled on all tables
    - Policies based on user role and business logic
    - Audit trail for compliance
*/

-- AI Interactions Log
CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id text NOT NULL,
  work_order_id text,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (
    interaction_type IN (
      'structured_order',
      'diagnostic_suggestion',
      'technical_observation',
      'customer_explanation',
      'quotation',
      'general'
    )
  ),
  input_text text NOT NULL,
  ai_response jsonb NOT NULL,
  model_used text DEFAULT 'claude-3-5-sonnet',
  tokens_used integer,
  cost_cents integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Suggestions (editable before approval)
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id text NOT NULL,
  work_order_id text,
  interaction_id uuid NOT NULL REFERENCES ai_interactions(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  suggestion_type text NOT NULL CHECK (
    suggestion_type IN (
      'diagnostic',
      'observation',
      'quotation_item',
      'customer_note'
    )
  ),
  original_content jsonb NOT NULL,
  edited_content jsonb,
  status text DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'rejected', 'archived')
  ),
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  rejection_reason text,
  rejected_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Work Order AI History
CREATE TABLE IF NOT EXISTS ai_work_order_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id text NOT NULL,
  vehicle_id text NOT NULL,
  ai_suggestions jsonb NOT NULL,
  structured_order jsonb,
  diagnostics jsonb,
  observations jsonb,
  customer_explanation text,
  quotation jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Usage Statistics
CREATE TABLE IF NOT EXISTS ai_usage_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  interaction_count integer DEFAULT 1,
  total_tokens_used integer DEFAULT 0,
  total_cost_cents integer DEFAULT 0,
  unique_vehicles integer DEFAULT 0,
  unique_work_orders integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_interactions_vehicle_id ON ai_interactions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_work_order_id ON ai_interactions(work_order_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_suggestions_work_order_id ON ai_suggestions(work_order_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_status ON ai_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_created_by ON ai_suggestions(created_by);

CREATE INDEX IF NOT EXISTS idx_ai_work_order_history_work_order_id ON ai_work_order_history(work_order_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_stats_user_id ON ai_usage_stats(user_id, date DESC);

-- Enable RLS
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_work_order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies: ai_interactions
-- Only authenticated users can view interactions
CREATE POLICY "Users can view AI interactions"
  ON ai_interactions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('Administrador', 'Técnico', 'Recepcionista')
    )
  );

-- Only the user who created the interaction can view details
CREATE POLICY "Users can create AI interactions"
  ON ai_interactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies: ai_suggestions
-- Users can view suggestions related to their work
CREATE POLICY "Users can view AI suggestions"
  ON ai_suggestions FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('Administrador', 'Técnico')
    )
  );

-- Users can create suggestions
CREATE POLICY "Users can create AI suggestions"
  ON ai_suggestions FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Users can update their own suggestions (before approval)
CREATE POLICY "Users can update own AI suggestions"
  ON ai_suggestions FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() AND status = 'pending'
  )
  WITH CHECK (
    created_by = auth.uid() AND status = 'pending'
  );

-- Only admins and technicians can approve
CREATE POLICY "Technicians can approve suggestions"
  ON ai_suggestions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('Administrador', 'Técnico')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('Administrador', 'Técnico')
    )
  );

-- RLS Policies: ai_work_order_history
CREATE POLICY "Users can view work order AI history"
  ON ai_work_order_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('Administrador', 'Técnico', 'Recepcionista')
    )
  );

CREATE POLICY "Users can create work order AI history"
  ON ai_work_order_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('Administrador', 'Técnico', 'Recepcionista')
    )
  );

-- RLS Policies: ai_usage_stats
CREATE POLICY "Users can view own usage stats"
  ON ai_usage_stats FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'Administrador'
    )
  );

CREATE POLICY "System can update usage stats"
  ON ai_usage_stats FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can update usage stats on upsert"
  ON ai_usage_stats FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'Administrador'
    )
  );
