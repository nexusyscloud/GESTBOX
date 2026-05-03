/*
  # Create users table for GestBox application

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique identifier for each user
      - `name` (text) - Full name of the user
      - `email` (text, unique) - Email address for login and contact
      - `phone` (text, nullable) - Phone number
      - `role` (text) - User role (Administrador, Técnico, Recepcionista, Contador, Vendedor)
      - `status` (text) - User status (activo, inactivo, suspendido)
      - `last_login` (timestamptz, nullable) - Last login timestamp
      - `permissions` (jsonb) - JSON object with menu permissions
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record last update timestamp

  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read all users
    - Add policy for authenticated users to insert users
    - Add policy for authenticated users to update users
    - Add policy for authenticated users to delete users
    
  3. Indexes
    - Index on email for faster lookups
    - Index on role for filtering
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  role text NOT NULL,
  status text DEFAULT 'activo' NOT NULL,
  last_login timestamptz,
  permissions jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Authenticated users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
