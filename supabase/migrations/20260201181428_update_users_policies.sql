/*
  # Update users table policies to allow anonymous access

  1. Changes
    - Drop existing restrictive policies
    - Create new policies that allow anonymous (public) access
    - This allows the application to work without authentication
    
  2. Security Note
    - These policies allow public access for development
    - In production, you should implement proper authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view all users" ON users;
DROP POLICY IF EXISTS "Authenticated users can insert users" ON users;
DROP POLICY IF EXISTS "Authenticated users can update users" ON users;
DROP POLICY IF EXISTS "Authenticated users can delete users" ON users;

-- Create new policies that allow anonymous access
CREATE POLICY "Allow public read access to users"
  ON users FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert access to users"
  ON users FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update access to users"
  ON users FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to users"
  ON users FOR DELETE
  TO anon, authenticated
  USING (true);
