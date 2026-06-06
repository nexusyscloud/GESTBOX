import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  Eye,
  X,
  ClipboardList,
  Car,
  User,
  Wrench
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';

const empresa_id = '1427c107-6e37-44fa-8984-cdf39a5b9a62';

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

type WorkOrderRow = {
  id: string;
  numero_ot: string | null;
  descripcion: string | null;
  estado: string | null;
  total: number | null;
  prioridad: string | null;
  asesor: string | null;
  fecha_recepcion: string | null;
  fecha_entrega_prometida: string | null;
  created_at: string | null;
  cliente_id: string | null;
  vehiculo_id: string | null;
  clientes: { nombre: string; telefono?: string | null }[] | null;
  vehiculos: {
    placa: string | null;
    marca: string | null;
    modelo: string | null;
    anio?: number | null;
  }[] | null;
};

type StatusConfig = {
  value: WorkOrderStatus;
  label: string;
  color: string;
  bg: string;
  border: string;
};

const STATUS_CONFIG: StatusConfig[] = [
  { value: 'recepcion', label: 'Recepción', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
  { value: 'diagnostico', label: 'Diagnóstico', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  { value: 'cotizacion', label: 'Cotización', color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  { value: 'pendiente_aprobacion', label: 'Pendiente aprobación', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  { value: 'aprobada', label: 'Aprobada', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { value: 'en_reparacion', label: 'En reparación', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  { value: 'espera_repuestos', label: 'Espera repuestos', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  { value: 'pausada', label: 'Pausada', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { value: 'control_calidad', label: 'Control calidad', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' },
  { value: 'lista_entrega', label: 'Lista entrega', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  { value: 'facturada', label: 'Facturada', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { value: 'entregada', label: 'Entregada', color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-300' },
  { value: 'cancelada', label: 'Cancelada', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' }
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

const getStatusConfig = (status: WorkOrderStatus) => {
  return STATUS_CONFIG.find(item => item.value === status) || STATUS_CONFIG[0];
};

const StatusBadge: React.FC<{ status: WorkOrderStatus }> = ({ status }) => {
  const cfg = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
};

const WorkOrders: React.FC = () => {
  const [orders, setOrders] = useState<WorkOrderRow[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrderRow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | WorkOrderStatus>('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkOrders = async () => {
    try {
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
          prioridad,
          asesor,
          fecha_recepcion,
          fecha_entrega_prometida,
          created_at,
          cliente_id,
          vehiculo_id,
          clientes (
            nombre,
            telefono
          ),
          vehiculos (
            placa,
            marca,
            modelo,
            anio
          )
        `)
        .eq('empresa_id', empresa_id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setOrders((data || []) as WorkOrderRow[]);
    } catch (err: any) {
      console.error('Error cargando órdenes:', err);
      setError(err?.message || 'No se pudieron cargar las órdenes de trabajo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: WorkOrderStatus) => {
    try {
      setUpdatingId(orderId);
      setError(null);

      const { error: updateError } = await supabase
        .from('ordenes_trabajo')
        .update({ estado: newStatus })
        .eq('id', orderId)
        .eq('empresa_id', empresa_id);

      if (updateError) {
        throw updateError;
      }

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, estado: newStatus } : order
        )
      );

      setSelectedOrder(prev =>
        prev && prev.id === orderId ? { ...prev, estado: newStatus } : prev
      );
    } catch (err: any) {
      console.error('Error actualizando estado:', err);
      setError(err?.message || 'No se pudo actualizar el estado.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter(order => {
      const status = normalizeStatus(order.estado);
      const cliente = order.clientes?.[0]?.nombre || '';
      const vehiculo = [
        order.vehiculos?.[0]?.placa,
        order.vehiculos?.[0]?.marca,
        order.vehiculos?.[0]?.modelo
      ].filter(Boolean).join(' ');

      const matchesSearch =
        !term ||
        [
          order.numero_ot,
          order.descripcion,
          cliente,
          vehiculo,
          order.asesor
        ]
          .filter(Boolean)
          .some(value => String(value).toLowerCase().includes(term));

      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const stats = {
    total: orders.length,
    active: orders.filter(order =>
      ['recepcion', 'diagnostico', 'cotizacion', 'pendiente_aprobacion', 'aprobada', 'en_reparacion', 'espera_repuestos', 'pausada']
        .includes(normalizeStatus(order.estado))
    ).length,
    ready: orders.filter(order =>
      ['control_calidad', 'lista_entrega', 'facturada']
        .includes(normalizeStatus(order.estado))
    ).length,
    closed: orders.filter(order => normalizeStatus(order.estado) === 'entregada').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Cargando órdenes de trabajo...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Órdenes de Trabajo</h1>
          <p className="text-gray-600 mt-1">
            Gestión y seguimiento del flujo operativo del taller.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchWorkOrders}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Activas</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Por entregar</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.ready}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Cerradas</p>
          <p className="text-2xl font-bold text-gray-700 mt-1">{stats.closed}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por orden, cliente, vehículo, placa o asesor..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | WorkOrderStatus)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            {STATUS_CONFIG.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">No se encontraron órdenes</h3>
            <p className="text-gray-500 text-sm mt-1">
              Crea una orden desde Recepción Vehicular o ajusta los filtros.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map(order => {
              const status = normalizeStatus(order.estado);
              const cliente = order.clientes?.[0]?.nombre || 'Sin cliente';
              const telefono = order.clientes?.[0]?.telefono || '';
              const vehiculo = [
                order.vehiculos?.[0]?.marca,
                order.vehiculos?.[0]?.modelo,
                order.vehiculos?.[0]?.anio
              ].filter(Boolean).join(' ') || 'Sin vehículo';
              const placa = order.vehiculos?.[0]?.placa || 'Sin placa';

              return (
                <div key={order.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">
                          OT {order.numero_ot || 'Sin número'}
                        </h3>
                        <StatusBadge status={status} />
                        {order.prioridad && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            Prioridad {order.prioridad}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{cliente}</p>
                            {telefono && <p className="text-gray-500">{telefono}</p>}
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Car className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{vehiculo}</p>
                            <p className="text-gray-500">Placa: {placa}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Wrench className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{order.asesor || 'Sin asesor'}</p>
                            <p className="text-gray-500">
                              {order.fecha_recepcion
                                ? new Date(order.fecha_recepcion).toLocaleDateString('es-EC')
                                : order.created_at
                                  ? new Date(order.created_at).toLocaleDateString('es-EC')
                                  : 'Sin fecha'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {order.descripcion && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                          {order.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 xl:items-center">
                      <select
                        value={status}
                        disabled={updatingId === order.id}
                        onChange={(event) => updateOrderStatus(order.id, event.target.value as WorkOrderStatus)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60"
                      >
                        {STATUS_CONFIG.map(item => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  OT {selectedOrder.numero_ot || 'Sin número'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Detalle de orden de trabajo</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <StatusBadge status={normalizeStatus(selectedOrder.estado)} />

                <select
                  value={normalizeStatus(selectedOrder.estado)}
                  disabled={updatingId === selectedOrder.id}
                  onChange={(event) => updateOrderStatus(selectedOrder.id, event.target.value as WorkOrderStatus)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {STATUS_CONFIG.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Cliente</p>
                  <p className="font-medium text-gray-900">
                    {selectedOrder.clientes?.[0]?.nombre || 'Sin cliente'}
                  </p>
                  {selectedOrder.clientes?.[0]?.telefono && (
                    <p className="text-sm text-gray-500">{selectedOrder.clientes[0].telefono}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Vehículo</p>
                  <p className="font-medium text-gray-900">
                    {[
                      selectedOrder.vehiculos?.[0]?.marca,
                      selectedOrder.vehiculos?.[0]?.modelo,
                      selectedOrder.vehiculos?.[0]?.anio
                    ].filter(Boolean).join(' ') || 'Sin vehículo'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Placa: {selectedOrder.vehiculos?.[0]?.placa || 'Sin placa'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Asesor</p>
                  <p className="font-medium text-gray-900">{selectedOrder.asesor || 'Sin asesor'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total</p>
                  <p className="font-medium text-gray-900">
                    ${(selectedOrder.total || 0).toLocaleString('es-EC', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Descripción</p>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700">
                  {selectedOrder.descripcion || 'Sin descripción registrada.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrders;
