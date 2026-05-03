import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Phone, Mail, CreditCard as Edit, Trash2, Eye,
  Filter, RefreshCw, Loader2, X, Save, AlertCircle, User, MapPin
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const EMPRESA_ID = '1427c107-6e37-44fa-8984-cdf39a5b9a62';

interface Cliente {
  id: string;
  empresa_id: string;
  nombre: string;
  identificacion: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  estado: string;
  created_at: string | null;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('clientes')
      .select('id, empresa_id, nombre, identificacion, telefono, email, direccion, estado, created_at')
      .eq('empresa_id', EMPRESA_ID)
      .order('nombre');

    if (fetchError) {
      setError(fetchError.message);
      setClients([]);
    } else {
      setClients(data || []);
    }

    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (client.telefono?.includes(searchTerm) ?? false) ||
    (client.identificacion?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return;
    const { error: deleteError } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
    if (deleteError) {
      alert('Error al eliminar: ' + deleteError.message);
    } else {
      fetchClients();
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? 'Cargando...' : `${filteredClients.length} cliente${filteredClients.length !== 1 ? 's' : ''} encontrado${filteredClients.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchClients}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
          <button
            onClick={() => { setSelectedClient(null); setShowModal(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo cliente</span>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nombre, identificación, email o teléfono..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Cargando clientes...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-700 font-medium mb-1">Error al cargar clientes</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchClients}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <User className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-gray-700 mb-1">No se encontraron clientes</h3>
          <p className="text-sm text-gray-400">
            {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Crea tu primer cliente'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Identificación</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{client.nombre}</p>
                          {client.created_at && (
                            <p className="text-xs text-gray-400">
                              Desde {new Date(client.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {client.telefono && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {client.telefono}
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {client.email}
                          </div>
                        )}
                        {!client.telefono && !client.email && (
                          <span className="text-xs text-gray-400">Sin contacto</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-mono">
                        {client.identificacion || <span className="text-gray-400 font-sans">—</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {client.direccion ? (
                        <div className="flex items-start gap-1.5 text-sm text-gray-700 max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="truncate">{client.direccion}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.estado === 'activo'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {client.estado === 'activo' ? 'Activo' : client.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedClient(client); setShowModal(true); }}
                          className="p-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Mostrando {filteredClients.length} de {clients.length} clientes
            </p>
          </div>
        </div>
      )}

      {showModal && (
        <ClientModal
          client={selectedClient}
          onClose={() => { setShowModal(false); setSelectedClient(null); }}
          onSuccess={() => { setShowModal(false); setSelectedClient(null); fetchClients(); }}
        />
      )}
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ClientModalProps {
  client: Cliente | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ client, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: client?.nombre || '',
    identificacion: client?.identificacion || '',
    telefono: client?.telefono || '',
    email: client?.email || '',
    direccion: client?.direccion || ''
  });

  const set = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      setLoading(false);
      return;
    }

    if (client) {
      // UPDATE
      const { error: updateError } = await supabase
        .from('clientes')
        .update({
          nombre: formData.nombre.trim(),
          identificacion: formData.identificacion.trim() || null,
          telefono: formData.telefono.trim() || null,
          email: formData.email.trim() || null,
          direccion: formData.direccion.trim() || null
        })
        .eq('id', client.id);

      if (updateError) {
        setError('Error al actualizar: ' + updateError.message);
        setLoading(false);
        return;
      }
    } else {
      // INSERT
      const { error: insertError } = await supabase
        .from('clientes')
        .insert({
          empresa_id: EMPRESA_ID,
          nombre: formData.nombre.trim(),
          identificacion: formData.identificacion.trim() || null,
          telefono: formData.telefono.trim() || null,
          email: formData.email.trim() || null,
          direccion: formData.direccion.trim() || null,
          estado: 'activo'
        })
        .select()
        .single();

      if (insertError) {
        setError('Error al crear: ' + insertError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              {client ? 'Editar cliente' : 'Nuevo cliente'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={e => set('nombre', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre del cliente"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identificación</label>
                <input
                  type="text"
                  value={formData.identificacion}
                  onChange={e => set('identificacion', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cédula / RUC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={e => set('telefono', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+593 99 999 9999"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => set('email', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="cliente@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <textarea
                rows={2}
                value={formData.direccion}
                onChange={e => set('direccion', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Dirección completa"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Guardando...</span></>
                ) : (
                  <><Save className="w-4 h-4" /><span>{client ? 'Actualizar' : 'Crear cliente'}</span></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Clients;
