import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface Client {
  id: string;
  empresa_id: string;
  nombre: string;
  identificacion?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado?: string;
  created_at?: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('clientes')
        .select(`
          id,
          empresa_id,
          nombre,
          identificacion,
          telefono,
          email,
          direccion,
          estado,
          created_at
        `)
        .order('nombre');

      if (fetchError) {
        console.error('Error fetching clients:', fetchError);
        setError(fetchError.message);
        setClients([]);
        return;
      }

      console.log('Clientes cargados:', data);

      setClients(data || []);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message || 'Error cargando clientes');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      {loading && (
        <div className="text-blue-500">
          Cargando clientes...
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {!loading && clients.length === 0 && (
        <div className="text-gray-500">
          No existen clientes registrados.
        </div>
      )}

      <div className="space-y-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="font-semibold">
              {client.nombre}
            </div>

            <div className="text-sm text-gray-600">
              {client.telefono}
            </div>

            <div className="text-sm text-gray-600">
              {client.email}
            </div>

            <div className="text-sm text-gray-500">
              {client.identificacion}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}