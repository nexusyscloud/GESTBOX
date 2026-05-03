import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CreditCard as Edit2, Trash2, Clock, CheckCircle, AlertTriangle, Wrench, RefreshCw, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewWorkOrderModal from './NewWorkOrderModal';

interface OrdenTrabajo {
  id: string;
  numero_ot: string | null;
  descripcion: string | null;
  estado: string | null;
  total: number | null;
  created_at: string | null;
  clientes: {
    nombre: string;
  } | null;
  vehiculos: {
    marca: string | null;
    modelo: string | null;
  } | null;
}

const EMPRESA_ID = 'b4061d6f-5ff5-4a89-8c73-5dd39e33305e';

const WorkOrdersList: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrdenTrabajo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchOrdenes = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('ordenes_trabajo')
      .select(`
        id,
        numero_ot,
        descripcion,
        estado,
        total,
        created_at,
        clientes (
          nombre
        ),
        vehiculos (
          marca,
          modelo
        )
      `)
      .eq('empresa_id', EMPRESA_ID)
      .order('created_at', { ascending: sortOrder === 'asc' });

    if (fetchError) {
      setError(fetchError.message);
      setOrdenes([]);
    } else {
      setOrdenes(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrdenes();
  }, [sortOrder]);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso':
      case 'en-proceso':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'abierta':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'pendiente':
        return <Clock className="w-4 h-4" />;
      case 'en_proceso':
      case 'en-proceso':
        return <Wrench className="w-4 h-4" />;
      case 'completada':
      case 'completado':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelada':
      case 'cancelado':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrdenes = ordenes.filter(orden => {
    const matchesSearch =
      (orden.numero_ot?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (orden.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (orden.clientes?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (orden.vehiculos?.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (orden.vehiculos?.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === 'all' || orden.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = [...new Set(ordenes.map(o => o.estado).filter(Boolean))];

  const canDelete = (orden: OrdenTrabajo) => {
    return orden.estado === 'abierta' && (!orden.total || orden.total === 0);
  };

  const handleEdit = (orden: OrdenTrabajo) => {
    setEditingOrder(orden);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('ordenes_trabajo')
      .delete()
      .eq('id', id);

    if (deleteError) {
      alert('Error al eliminar la orden: ' + deleteError.message);
    } else {
      setOrdenes(prev => prev.filter(o => o.id !== id));
    }
    setDeleteConfirmId(null);
  };

  const handleUpdateOrder = async (updatedOrder: OrdenTrabajo) => {
    const { error: updateError } = await supabase
      .from('ordenes_trabajo')
      .update({
        descripcion: updatedOrder.descripcion,
        estado: updatedOrder.estado
      })
      .eq('id', updatedOrder.id);

    if (updateError) {
      alert('Error al actualizar la orden: ' + updateError.message);
    } else {
      setOrdenes(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      setIsEditModalOpen(false);
      setEditingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3 text-gray-500">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Cargando ordenes de trabajo...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar datos</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchOrdenes}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ordenes de Trabajo</h1>
          <p className="text-gray-600">
            {filteredOrdenes.length} {filteredOrdenes.length === 1 ? 'orden' : 'ordenes'} encontradas
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchOrdenes}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Orden</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por numero_ot, descripcion, cliente o vehiculo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status || ''}>
                  {status || 'Sin estado'}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              {sortOrder === 'desc' ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
              <span>Fecha</span>
            </button>
          </div>
        </div>
      </div>

      {filteredOrdenes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ordenes</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Intenta ajustar los filtros de busqueda'
              : 'No hay ordenes de trabajo registradas'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Numero
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Descripcion
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vehiculo
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrdenes.map((orden) => (
                  <tr key={orden.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        {orden.numero_ot || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 max-w-xs truncate" title={orden.descripcion || ''}>
                        {orden.descripcion || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(orden.estado)}`}>
                        {getStatusIcon(orden.estado)}
                        <span className="ml-1">{orden.estado || 'Sin estado'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">
                        {orden.clientes?.nombre || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">
                        {orden.vehiculos
                          ? `${orden.vehiculos.marca || ''} ${orden.vehiculos.modelo || ''}`.trim() || '-'
                          : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-semibold text-green-600">
                        {formatCurrency(orden.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-500 text-sm">
                        {formatDate(orden.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(orden)}
                          className="text-amber-600 hover:text-amber-800 p-2 rounded-lg hover:bg-amber-50 transition-colors"
                          title="Editar orden"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {canDelete(orden) && (
                          <button
                            onClick={() => setDeleteConfirmId(orden.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Eliminar orden"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <NewWorkOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOrdenes}
        empresaId={EMPRESA_ID}
      />

      {isEditModalOpen && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold">Editar Orden {editingOrder.numero_ot}</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingOrder(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                <textarea
                  value={editingOrder.descripcion || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, descripcion: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={editingOrder.estado || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, estado: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="abierta">Abierta</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingOrder(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUpdateOrder(editingOrder)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminacion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Esta seguro que desea eliminar esta orden de trabajo? Esta accion no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrdersList;
