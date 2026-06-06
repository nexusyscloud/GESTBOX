import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Clock,
  Wrench,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useUser } from '../../../../components/users/UserContext';
import NewWorkOrderModal from '../../../../components/workshop/NewWorkOrderModal';


type WorkOrderStatus =
  | 'recepcion'
  | 'diagnostico'
  | 'cotizacion'
  | 'pendiente_aprobacion'
  | 'aprobada'
  | 'en_reparacion'
  | 'espera_repuestos'
  | 'pausada'
  | 'control_calidad'
  | 'lista_entrega'
  | 'facturada'
  | 'entregada'
  | 'cancelada';

interface OrdenTrabajo {
  id: string;
  numero_ot: string | null;
  descripcion: string | null;
  estado: string | null;
  total: number | null;
  created_at: string | null;
  clientes: {
    nombre: string;
  }[] | null;
  vehiculos: {
    marca: string | null;
    modelo: string | null;
    placa?: string | null;
  }[] | null;
}

const STATUS_OPTIONS: { value: WorkOrderStatus; label: string }[] = [
  { value: 'recepcion', label: 'Recepción' },
  { value: 'diagnostico', label: 'Diagnóstico' },
  { value: 'cotizacion', label: 'Cotización' },
  { value: 'pendiente_aprobacion', label: 'Pendiente aprobación' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'en_reparacion', label: 'En reparación' },
  { value: 'espera_repuestos', label: 'Espera repuestos' },
  { value: 'pausada', label: 'Pausada' },
  { value: 'control_calidad', label: 'Control calidad' },
  { value: 'lista_entrega', label: 'Lista entrega' },
  { value: 'facturada', label: 'Facturada' },
  { value: 'entregada', label: 'Entregada' },
  { value: 'cancelada', label: 'Cancelada' }
];

const normalizeStatus = (estado: string | null): WorkOrderStatus => {
  switch (estado) {
    case 'recepcion':
    case 'abierta':
      return 'recepcion';

    case 'diagnostico':
    case 'en_diagnostico':
      return 'diagnostico';

    case 'cotizacion':
      return 'cotizacion';

    case 'pendiente_aprobacion':
    case 'pendiente':
      return 'pendiente_aprobacion';

    case 'aprobada':
      return 'aprobada';

    case 'en_reparacion':
    case 'en_proceso':
    case 'en-proceso':
      return 'en_reparacion';

    case 'espera_repuestos':
      return 'espera_repuestos';

    case 'pausada':
      return 'pausada';

    case 'control_calidad':
      return 'control_calidad';

    case 'lista_entrega':
      return 'lista_entrega';

    case 'facturada':
      return 'facturada';

    case 'entregada':
    case 'completada':
    case 'completado':
      return 'entregada';

    case 'cancelada':
    case 'cancelado':
      return 'cancelada';

    default:
      return 'recepcion';
  }
};

const getStatusLabel = (status: string | null) => {
  const normalized = normalizeStatus(status);
  return STATUS_OPTIONS.find(option => option.value === normalized)?.label || 'Recepción';
};

const getStatusColor = (status: string | null) => {
  switch (normalizeStatus(status)) {
    case 'recepcion':
      return 'bg-sky-100 text-sky-800';
    case 'diagnostico':
      return 'bg-violet-100 text-violet-800';
    case 'cotizacion':
      return 'bg-cyan-100 text-cyan-800';
    case 'pendiente_aprobacion':
      return 'bg-amber-100 text-amber-800';
    case 'aprobada':
      return 'bg-emerald-100 text-emerald-800';
    case 'en_reparacion':
      return 'bg-blue-100 text-blue-800';
    case 'espera_repuestos':
      return 'bg-orange-100 text-orange-800';
    case 'pausada':
      return 'bg-yellow-100 text-yellow-800';
    case 'control_calidad':
      return 'bg-teal-100 text-teal-800';
    case 'lista_entrega':
      return 'bg-green-100 text-green-800';
    case 'facturada':
      return 'bg-indigo-100 text-indigo-800';
    case 'entregada':
      return 'bg-gray-100 text-gray-800';
    case 'cancelada':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string | null) => {
  switch (normalizeStatus(status)) {
    case 'en_reparacion':
    case 'diagnostico':
      return <Wrench className="w-4 h-4" />;
    case 'control_calidad':
    case 'lista_entrega':
    case 'facturada':
    case 'entregada':
      return <CheckCircle className="w-4 h-4" />;
    case 'cancelada':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const WorkOrdersList: React.FC = () => {
  const { empresa_id } = useUser();
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | WorkOrderStatus>('all');
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
          modelo,
          placa
        )
      `)
      .eq('empresa_id', empresa_id)
      .order('created_at', { ascending: sortOrder === 'asc' });

    if (fetchError) {
      setError(fetchError.message);
      setOrdenes([]);
    } else {
      setOrdenes((data || []) as OrdenTrabajo[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrdenes();
  }, [sortOrder]);

  const formatCurrency = (value: number | null) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrdenes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return ordenes.filter(orden => {
      const cliente = orden.clientes?.[0]?.nombre || '';
      const vehiculo = [
        orden.vehiculos?.[0]?.marca,
        orden.vehiculos?.[0]?.modelo,
        orden.vehiculos?.[0]?.placa
      ].filter(Boolean).join(' ');

      const matchesSearch =
        !term ||
        [
          orden.numero_ot,
          orden.descripcion,
          cliente,
          vehiculo
        ]
          .filter(Boolean)
          .some(value => String(value).toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === 'all' || normalizeStatus(orden.estado) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [ordenes, searchTerm, statusFilter]);

  const canDelete = (orden: OrdenTrabajo) => {
    const status = normalizeStatus(orden.estado);
    return status === 'recepcion' && (!orden.total || orden.total === 0);
  };

  const handleEdit = (orden: OrdenTrabajo) => {
    setEditingOrder({
      ...orden,
      estado: normalizeStatus(orden.estado)
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('ordenes_trabajo')
      .delete()
      .eq('id', id)
      .eq('empresa_id', empresa_id);

    if (deleteError) {
      alert('Error al eliminar la orden: ' + deleteError.message);
    } else {
      setOrdenes(prev => prev.filter(o => o.id !== id));
    }

    setDeleteConfirmId(null);
  };

  const handleUpdateOrder = async (updatedOrder: OrdenTrabajo) => {
    const newStatus = normalizeStatus(updatedOrder.estado);

    const { error: updateError } = await supabase
      .from('ordenes_trabajo')
      .update({
        descripcion: updatedOrder.descripcion,
        estado: newStatus
      })
      .eq('id', updatedOrder.id)
      .eq('empresa_id', empresa_id);

    if (updateError) {
      alert('Error al actualizar la orden: ' + updateError.message);
    } else {
      setOrdenes(prev =>
        prev.map(o =>
          o.id === updatedOrder.id
            ? { ...updatedOrder, estado: newStatus }
            : o
        )
      );
      setIsEditModalOpen(false);
      setEditingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3 text-gray-500">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Cargando órdenes de trabajo...</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Órdenes de Trabajo</h1>
          <p className="text-gray-600">
            {filteredOrdenes.length} {filteredOrdenes.length === 1 ? 'orden' : 'órdenes'} encontradas
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
              placeholder="Buscar por número, descripción, cliente o vehículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | WorkOrderStatus)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron órdenes</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'No hay órdenes de trabajo registradas'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vehículo
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
                {filteredOrdenes.map((orden) => {
                  const vehiculo = orden.vehiculos?.[0];
                  const cliente = orden.clientes?.[0];

                  return (
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
                          <span className="ml-1">{getStatusLabel(orden.estado)}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">
                          {cliente?.nombre || '-'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">
                          {vehiculo
                            ? `${vehiculo.marca || ''} ${vehiculo.modelo || ''} ${vehiculo.placa ? `- ${vehiculo.placa}` : ''}`.trim() || '-'
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <NewWorkOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOrdenes}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={editingOrder.descripcion || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, descripcion: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={normalizeStatus(editingOrder.estado)}
                  onChange={(e) => setEditingOrder({ ...editingOrder, estado: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
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
              <h3 className="text-lg font-semibold text-gray-900">Confirmar eliminación</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Está seguro que desea eliminar esta orden de trabajo? Esta acción no se puede deshacer.
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
