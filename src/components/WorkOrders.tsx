import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Eye, CreditCard as Edit, Clock, CheckCircle, AlertTriangle,
  Calendar, User, Car, Wrench, ChevronDown, X, Package, DollarSign, FileText,
  Printer, Send, Sparkles, Loader2, RefreshCw, ChevronRight, Pause, ShoppingCart,
  FlaskConical, ThumbsUp, Truck, XCircle, ClipboardCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { aiService, StructuredOrder } from '../lib/aiService';

const EMPRESA_ID = '1427c107-6e37-44fa-8984-cdf39a5b9a62';

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkOrderStatus =
  | 'abierta'
  | 'en_diagnostico'
  | 'pendiente_aprobacion'
  | 'aprobada'
  | 'en_proceso'
  | 'control_calidad'
  | 'lista_entrega'
  | 'facturada'
  | 'entregada'
  | 'espera_repuestos'
  | 'pausada'
  | 'cancelada';

interface StatusConfig {
  value: WorkOrderStatus;
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
  group: 'main' | 'aux';
}

interface WorkOrderItem {
  id: string;
  type: 'service' | 'part';
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  inventoryId?: string;
  stockAvailable?: number;
}

interface WorkOrder {
  id: string;
  numero: string;
  client: string;
  clientPhone?: string;
  vehicle: string;
  vehiclePlate?: string;
  service: string;
  status: WorkOrderStatus;
  priority: 'alta' | 'media' | 'baja';
  startDate: string;
  estimatedCompletion: string;
  assignedTo: string;
  description: string;
  items: WorkOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  quotationApproved: boolean;
  quotationSentAt?: string;
  invoiceId?: string;
}

// ─── Status catalogue ─────────────────────────────────────────────────────────

const STATUS_CONFIG: StatusConfig[] = [
  {
    value: 'abierta',
    label: 'Abierta',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
    group: 'main'
  },
  {
    value: 'en_diagnostico',
    label: 'En diagnóstico',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
    group: 'main'
  },
  {
    value: 'pendiente_aprobacion',
    label: 'Pend. aprobación',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    group: 'main'
  },
  {
    value: 'aprobada',
    label: 'Aprobada',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    group: 'main'
  },
  {
    value: 'en_proceso',
    label: 'En proceso',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    group: 'main'
  },
  {
    value: 'control_calidad',
    label: 'Control de calidad',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    dot: 'bg-teal-500',
    group: 'main'
  },
  {
    value: 'lista_entrega',
    label: 'Lista para entrega',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    dot: 'bg-green-500',
    group: 'main'
  },
  {
    value: 'facturada',
    label: 'Facturada',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
    group: 'main'
  },
  {
    value: 'entregada',
    label: 'Entregada',
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    dot: 'bg-gray-500',
    group: 'main'
  },
  {
    value: 'espera_repuestos',
    label: 'Espera repuestos',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
    group: 'aux'
  },
  {
    value: 'pausada',
    label: 'Pausada',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    dot: 'bg-yellow-400',
    group: 'aux'
  },
  {
    value: 'cancelada',
    label: 'Cancelada',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-500',
    group: 'aux'
  }
];

const getStatusConfig = (value: string): StatusConfig =>
  STATUS_CONFIG.find(s => s.value === value) ?? STATUS_CONFIG[0];

const mapEstadoToStatus = (estado: string | null): WorkOrderStatus => {
  switch (estado) {
    case 'abierta': return 'abierta';
    case 'en_diagnostico': return 'en_diagnostico';
    case 'pendiente_aprobacion': return 'pendiente_aprobacion';
    case 'aprobada': return 'aprobada';
    case 'en_proceso':
    case 'en-proceso': return 'en_proceso';
    case 'control_calidad': return 'control_calidad';
    case 'lista_entrega': return 'lista_entrega';
    case 'facturada': return 'facturada';
    case 'entregada':
    case 'completada':
    case 'completado': return 'entregada';
    case 'espera_repuestos': return 'espera_repuestos';
    case 'pausada': return 'pausada';
    case 'cancelada':
    case 'cancelado': return 'cancelada';
    default: return 'abierta';
  }
};

// ─── Status badge component ────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: WorkOrderStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md'
}) => {
  const cfg = getStatusConfig(status);
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Status selector dropdown ──────────────────────────────────────────────────

const StatusDropdown: React.FC<{
  current: WorkOrderStatus;
  onChange: (s: WorkOrderStatus) => void;
  onClose: () => void;
}> = ({ current, onChange, onClose }) => {
  const main = STATUS_CONFIG.filter(s => s.group === 'main');
  const aux = STATUS_CONFIG.filter(s => s.group === 'aux');

  return (
    <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
      <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Estado principal
      </p>
      {main.map(s => (
        <button
          key={s.value}
          onClick={() => { onChange(s.value); onClose(); }}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
            current === s.value ? 'bg-gray-50 font-medium' : ''
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
          <span className={s.color}>{s.label}</span>
          {current === s.value && <CheckCircle className="w-3.5 h-3.5 ml-auto text-gray-400" />}
        </button>
      ))}
      <div className="mx-3 my-1 border-t border-gray-100" />
      <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Estado auxiliar
      </p>
      {aux.map(s => (
        <button
          key={s.value}
          onClick={() => { onChange(s.value); onClose(); }}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
            current === s.value ? 'bg-gray-50 font-medium' : ''
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
          <span className={s.color}>{s.label}</span>
          {current === s.value && <CheckCircle className="w-3.5 h-3.5 ml-auto text-gray-400" />}
        </button>
      ))}
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

const WorkOrders: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | WorkOrderStatus>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'quotation' | 'invoice'>('details');
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<{ structuredOrder?: StructuredOrder }>({});

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

    setLoading(true);
    const { data, error } = await supabase
      .from('ordenes_trabajo')
      .select(`
        id, numero_ot, descripcion, estado, total, created_at,
        clientes ( nombre, telefono ),
        vehiculos ( placa, marca, modelo, anio )
      `)
      .eq('empresa_id', EMPRESA_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching work orders:', error);
      setWorkOrders([]);
    } else {
      const mapped: WorkOrder[] = (data || []).map((order: any) => ({
        id: order.id,
        numero: order.numero_ot || '-',
        client: order.clientes?.nombre || 'Sin cliente',
        clientPhone: order.clientes?.telefono || '',
        vehicle: order.vehiculos
          ? `${order.vehiculos.marca || ''} ${order.vehiculos.modelo || ''} ${order.vehiculos.anio || ''}`.trim()
          : 'Sin vehículo',
        vehiclePlate: order.vehiculos?.placa || '',
        service: order.descripcion || 'Sin descripción',
        status: mapEstadoToStatus(order.estado),
        priority: 'media',
        startDate: order.created_at?.split('T')[0] || '',
        estimatedCompletion: '',
        assignedTo: '',
        description: order.descripcion || '',
        items: [],
        subtotal: order.total || 0,
        tax: (order.total || 0) * 0.16,
        total: (order.total || 0) * 1.16,
        quotationApproved: ['entregada', 'facturada', 'lista_entrega', 'control_calidad'].includes(order.estado),
        quotationSentAt: undefined,
        invoiceId: undefined
      }));
      setWorkOrders(mapped);
    }
    setLoading(false);
  };

  useEffect(() => { fetchWorkOrders(); }, []);

  const handleStatusChange = async (orderId: string, newStatus: WorkOrderStatus) => {
    await supabase
      .from('ordenes_trabajo')
      .update({ estado: newStatus })
      .eq('id', orderId);

    setWorkOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
    setOpenDropdowns(prev => ({ ...prev, [orderId]: false }));
  };

  const handleModalStatusChange = async (newStatus: WorkOrderStatus) => {
    if (!selectedOrder) return;
    await supabase
      .from('ordenes_trabajo')
      .update({ estado: newStatus })
      .eq('id', selectedOrder.id);

    const updated = { ...selectedOrder, status: newStatus };
    setSelectedOrder(updated);
    setWorkOrders(prev => prev.map(o => o.id === selectedOrder.id ? updated : o));
    setShowStatusDropdown(false);
  };

  const canGenerateInvoice = (order: WorkOrder) =>
    ['lista_entrega', 'control_calidad'].includes(order.status) &&
    order.quotationApproved &&
    !order.invoiceId;

  const filteredOrders = workOrders.filter(order => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      order.numero_ot.toLowerCase().includes(q) ||
      order.client.toLowerCase().includes(q) ||
      order.vehicle.toLowerCase().includes(q) ||
      order.service.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-700';
      case 'media': return 'bg-amber-100 text-amber-700';
      case 'baja': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const openOrderDetail = (order: WorkOrder) => {
    setSelectedOrder(order);
    setActiveTab('details');
    setShowDetailModal(true);
    setShowStatusDropdown(false);
  };

  const handleAddItem = (type: 'service' | 'part') => {
    if (!selectedOrder) return;
    const newItem: WorkOrderItem = {
      id: Date.now().toString(), type, description: '', quantity: 1, unitPrice: 0, discount: 0
    };
    const updated = { ...selectedOrder, items: [...selectedOrder.items, newItem] };
    setSelectedOrder(updated);
    recalculateTotals(updated);
  };

  const handleUpdateItem = (itemId: string, field: keyof WorkOrderItem, value: string | number) => {
    if (!selectedOrder) return;
    const items = selectedOrder.items.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    recalculateTotals({ ...selectedOrder, items });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!selectedOrder) return;
    recalculateTotals({
      ...selectedOrder,
      items: selectedOrder.items.filter(item => item.id !== itemId)
    });
  };

  const recalculateTotals = (order: WorkOrder) => {
    const subtotal = order.items.reduce((acc, item) => {
      return acc + item.quantity * item.unitPrice * (1 - item.discount / 100);
    }, 0);
    const tax = subtotal * 0.16;
    const updated = { ...order, subtotal, tax, total: subtotal + tax };
    setSelectedOrder(updated);
    setWorkOrders(prev => prev.map(o => o.id === order.id ? updated : o));
  };

  const handleApproveQuotation = () => {
    if (!selectedOrder) return;
    const updated = { ...selectedOrder, quotationApproved: true, quotationSentAt: new Date().toISOString() };
    setSelectedOrder(updated);
    setWorkOrders(prev => prev.map(o => o.id === selectedOrder.id ? updated : o));
  };

  const handleGenerateInvoice = () => {
    if (!selectedOrder || !canGenerateInvoice(selectedOrder)) return;
    const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
    const updated = { ...selectedOrder, status: 'facturada' as WorkOrderStatus, invoiceId };
    setSelectedOrder(updated);
    setWorkOrders(prev => prev.map(o => o.id === selectedOrder.id ? updated : o));
    alert(`Factura ${invoiceId} generada exitosamente`);
  };

  const handleGenerateAI = async () => {
    if (!selectedOrder) return;
    setAILoading(true);
    try {
      const parts = selectedOrder.vehicle.split(' ');
      const vehicleInfo = {
        brand: parts[0],
        model: parts.slice(1, -1).join(' '),
        year: parseInt(parts[parts.length - 1] || '0')
      };
      const result = await aiService.generateStructuredOrder(
        selectedOrder.description, vehicleInfo, selectedOrder.vehiclePlate
      );
      setAISuggestions({ structuredOrder: result });
      setShowAIModal(true);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      alert('Error al generar sugerencias con IA');
    } finally {
      setAILoading(false);
    }
  };

  const handleApplyAISuggestion = () => {
    if (!selectedOrder || !aiSuggestions.structuredOrder) return;
    const newItems: WorkOrderItem[] = aiSuggestions.structuredOrder.services.map((s, i) => ({
      id: `ai-${Date.now()}-${i}`,
      type: 'service' as const,
      description: s.description,
      quantity: 1,
      unitPrice: s.estimatedHours * 350,
      discount: 0
    }));
    recalculateTotals({ ...selectedOrder, items: [...selectedOrder.items, ...newItems] });
    setShowAIModal(false);
    setAISuggestions({});
  };

  // ─── Flujo de estados visual ─────────────────────────────────────────────────

  const FLOW_STEPS: WorkOrderStatus[] = [
    'abierta', 'en_diagnostico', 'pendiente_aprobacion', 'aprobada',
    'en_proceso', 'control_calidad', 'lista_entrega', 'facturada', 'entregada'
  ];

  const StatusFlow: React.FC<{ current: WorkOrderStatus }> = ({ current }) => {
    const auxStatuses: WorkOrderStatus[] = ['espera_repuestos', 'pausada', 'cancelada'];
    const isAux = auxStatuses.includes(current);
    const currentIdx = FLOW_STEPS.indexOf(current);

    return (
      <div className="w-full overflow-x-auto pb-1">
        <div className="flex items-center min-w-max gap-0">
          {FLOW_STEPS.map((step, i) => {
            const cfg = getStatusConfig(step);
            const isDone = !isAux && i < currentIdx;
            const isActive = !isAux && step === current;
            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-500'
                      : isActive
                        ? `${cfg.dot.replace('bg-', 'bg-')} border-current ${cfg.color}`
                        : 'bg-white border-gray-200'
                  }`}>
                    {isDone
                      ? <CheckCircle className="w-4 h-4 text-white" />
                      : <span className={`w-2.5 h-2.5 rounded-full ${isActive ? cfg.dot : 'bg-gray-200'}`} />
                    }
                  </div>
                  <span className={`mt-1 text-[10px] font-medium whitespace-nowrap max-w-[64px] text-center leading-tight ${
                    isActive ? cfg.color : isDone ? 'text-emerald-600' : 'text-gray-400'
                  }`}>
                    {cfg.label}
                  </span>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className={`h-0.5 w-6 mx-0.5 mb-4 ${i < currentIdx && !isAux ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        {isAux && (
          <div className="mt-2">
            <StatusBadge status={current} />
          </div>
        )}
      </div>
    );
  };

  // ─── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando órdenes de trabajo...</span>
        </div>
      </div>
    );
  }

  // ─── Order detail modal ───────────────────────────────────────────────────────

  const OrderDetailModal = () => {
    if (!selectedOrder) return null;
    const cfg = getStatusConfig(selectedOrder.status);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">Orden {selectedOrder.numero}</h3>

              {/* Status badge with dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(v => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${cfg.bg} ${cfg.color} ${cfg.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>
                {showStatusDropdown && (
                  <StatusDropdown
                    current={selectedOrder.status}
                    onChange={handleModalStatusChange}
                    onClose={() => setShowStatusDropdown(false)}
                  />
                )}
              </div>

              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedOrder.priority)}`}>
                Prioridad {selectedOrder.priority}
              </span>
            </div>
            <button
              onClick={() => { setShowDetailModal(false); setShowStatusDropdown(false); }}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status flow bar */}
          <div className="px-6 py-3 border-b bg-white">
            <StatusFlow current={selectedOrder.status} />
          </div>

          {/* Tabs */}
          <div className="flex border-b bg-white">
            {(['details', 'items', 'quotation', 'invoice'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                }`}
              >
                {tab === 'details' && 'Detalles'}
                {tab === 'items' && 'Servicios y repuestos'}
                {tab === 'quotation' && 'Cotización'}
                {tab === 'invoice' && 'Facturación'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* ── Details tab ── */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" /> Cliente
                    </h4>
                    <p className="text-gray-900 font-medium">{selectedOrder.client}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{selectedOrder.clientPhone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4" /> Vehículo
                    </h4>
                    <p className="text-gray-900 font-medium">{selectedOrder.vehicle}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Placa: {selectedOrder.vehiclePlate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                      <Wrench className="w-4 h-4" /> Técnico asignado
                    </h4>
                    <p className="text-gray-900">{selectedOrder.assignedTo || 'Sin asignar'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">Servicio</h4>
                    <p className="text-gray-900 font-medium">{selectedOrder.service}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedOrder.description}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" /> Fechas
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Inicio:</span> <span className="font-medium">{selectedOrder.startDate}</span></p>
                      <p><span className="text-gray-500">Fin estimado:</span> <span className="font-medium">{selectedOrder.estimatedCompletion || '—'}</span></p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h4 className="font-semibold text-blue-800 mb-1 text-sm">Total de la orden</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      ${selectedOrder.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Items tab ── */}
            {activeTab === 'items' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Servicios y repuestos</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateAI}
                      disabled={aiLoading}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                    >
                      {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      <span>Sugerir con IA</span>
                    </button>
                    <button
                      onClick={() => handleAddItem('service')}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Servicio</span>
                    </button>
                    <button
                      onClick={() => handleAddItem('part')}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 flex items-center gap-1 shadow-sm"
                    >
                      <Package className="w-4 h-4" />
                      <span>Repuesto</span>
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Cant.</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">P. Unit.</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Desc. %</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtotal</th>
                        <th className="px-4 py-3 w-8" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {selectedOrder.items.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                            No hay ítems agregados a esta orden
                          </td>
                        </tr>
                      ) : selectedOrder.items.map(item => {
                        const itemSubtotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                item.type === 'service'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {item.type === 'service' ? 'Servicio' : 'Repuesto'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={item.description}
                                onChange={e => handleUpdateItem(item.id, 'description', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Descripción"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={e => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-blue-500"
                                min="1"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={e => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right focus:ring-2 focus:ring-blue-500"
                                min="0" step="0.01"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.discount}
                                onChange={e => handleUpdateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-blue-500"
                                min="0" max="100"
                              />
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900 text-sm">
                              ${itemSubtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="w-72 bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-medium">${selectedOrder.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>IVA (16%):</span>
                      <span className="font-medium">${selectedOrder.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 text-gray-900">
                      <span>Total:</span>
                      <span className="text-blue-600">${selectedOrder.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Quotation tab ── */}
            {activeTab === 'quotation' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Cotización de la orden</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Revisa y aprueba la cotización antes de facturar</p>
                  </div>
                  {selectedOrder.quotationApproved ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" /> Aprobada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm font-medium">
                      <Clock className="w-4 h-4" /> Pendiente de aprobación
                    </span>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between mb-5">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">COTIZACIÓN</h3>
                      <p className="text-sm text-gray-400 mt-0.5">Orden: {selectedOrder.numero}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Fecha: {new Date().toLocaleDateString('es-MX')}</p>
                      {selectedOrder.quotationSentAt && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Enviada: {new Date(selectedOrder.quotationSentAt).toLocaleString('es-MX')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cliente</p>
                      <p className="font-semibold text-gray-900 mt-1">{selectedOrder.client}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.clientPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vehículo</p>
                      <p className="font-semibold text-gray-900 mt-1">{selectedOrder.vehicle}</p>
                      <p className="text-sm text-gray-500">Placa: {selectedOrder.vehiclePlate}</p>
                    </div>
                  </div>

                  <table className="w-full mb-5">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Descripción</th>
                        <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cant.</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">P. Unit.</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.length === 0 ? (
                        <tr><td colSpan={4} className="py-4 text-center text-gray-400 text-sm">Sin ítems</td></tr>
                      ) : selectedOrder.items.map(item => (
                        <tr key={item.id} className="border-b border-gray-50">
                          <td className="py-2.5 text-sm text-gray-900">{item.description}</td>
                          <td className="py-2.5 text-sm text-center text-gray-700">{item.quantity}</td>
                          <td className="py-2.5 text-sm text-right text-gray-700">
                            ${item.unitPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 text-sm text-right font-medium text-gray-900">
                            ${(item.quantity * item.unitPrice * (1 - item.discount / 100)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-end">
                    <div className="w-64 space-y-1.5">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>IVA (16%):</span>
                        <span>${selectedOrder.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                        <span>Total:</span>
                        <span className="text-blue-600">${selectedOrder.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                    <Printer className="w-4 h-4" /> Imprimir
                  </button>
                  <button className="px-4 py-2 border border-blue-200 text-blue-600 rounded-xl text-sm hover:bg-blue-50 flex items-center gap-2 transition-colors">
                    <Send className="w-4 h-4" /> Enviar por email
                  </button>
                  {!selectedOrder.quotationApproved && (
                    <button
                      onClick={handleApproveQuotation}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Aprobar cotización
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Invoice tab ── */}
            {activeTab === 'invoice' && (
              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900">Facturación</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Genera la factura cuando la orden esté en "Lista para entrega" y la cotización aprobada
                  </p>
                </div>

                {selectedOrder.invoiceId ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-emerald-800">Factura generada</h4>
                    <p className="text-emerald-700 mt-1 text-sm">Número de factura: <span className="font-bold">{selectedOrder.invoiceId}</span></p>
                    <div className="mt-4 flex justify-center gap-3">
                      <button className="px-4 py-2 bg-white border border-emerald-300 text-emerald-700 rounded-xl text-sm hover:bg-emerald-50 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Ver factura
                      </button>
                      <button className="px-4 py-2 bg-white border border-emerald-300 text-emerald-700 rounded-xl text-sm hover:bg-emerald-50 flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Imprimir
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          done: !['abierta', 'en_diagnostico', 'pendiente_aprobacion', 'aprobada', 'en_proceso', 'espera_repuestos', 'pausada'].includes(selectedOrder.status),
                          label: 'Orden avanzada',
                          note: 'La orden debe estar en Control de calidad o Lista para entrega'
                        },
                        {
                          done: selectedOrder.quotationApproved,
                          label: 'Cotización aprobada',
                          note: 'Aprobar cotización en la pestaña anterior'
                        },
                        {
                          done: canGenerateInvoice(selectedOrder),
                          label: 'Listo para facturar',
                          note: 'Complete los pasos anteriores'
                        }
                      ].map((step, i) => (
                        <div key={i} className={`p-4 rounded-xl border-2 ${step.done ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
                          <div className="flex items-center gap-2">
                            {step.done
                              ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                              : <Clock className="w-5 h-5 text-gray-400" />
                            }
                            <span className="font-semibold text-sm text-gray-900">{step.label}</span>
                          </div>
                          {!step.done && <p className="text-xs text-gray-500 mt-1">{step.note}</p>}
                        </div>
                      ))}
                    </div>

                    {canGenerateInvoice(selectedOrder) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 text-sm">Resumen de facturación</h4>
                            <div className="mt-3 space-y-1.5 text-sm">
                              <div className="flex justify-between text-gray-700">
                                <span>Cliente:</span>
                                <span className="font-medium">{selectedOrder.client}</span>
                              </div>
                              <div className="flex justify-between text-gray-700">
                                <span>Subtotal:</span>
                                <span>${selectedOrder.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between text-gray-700">
                                <span>IVA:</span>
                                <span>${selectedOrder.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between font-bold text-base border-t border-blue-200 pt-2">
                                <span>Total a facturar:</span>
                                <span className="text-blue-700">${selectedOrder.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleGenerateInvoice}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
                          >
                            <FileText className="w-4 h-4" /> Generar factura
                          </button>
                        </div>
                      </div>
                    )}

                    {!canGenerateInvoice(selectedOrder) && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-800 font-semibold text-sm">No se puede generar factura aún</p>
                          <p className="text-amber-700 text-sm mt-0.5">
                            {['abierta', 'en_diagnostico', 'pendiente_aprobacion', 'aprobada', 'en_proceso', 'espera_repuestos', 'pausada'].includes(selectedOrder.status) &&
                              'La orden debe estar en Control de calidad o Lista para entrega. '}
                            {!selectedOrder.quotationApproved && 'La cotización debe estar aprobada.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── AI modal ─────────────────────────────────────────────────────────────────

  const AIModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold">Sugerencias de IA</h3>
          </div>
          <button onClick={() => setShowAIModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {aiSuggestions.structuredOrder && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Tipo de mantenimiento:</span> {aiSuggestions.structuredOrder.maintenanceType}
              </p>
              <p className="text-sm text-blue-800 mt-1">
                <span className="font-semibold">Duración estimada:</span> {aiSuggestions.structuredOrder.estimatedDuration}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Servicios sugeridos:</p>
              <div className="space-y-2">
                {aiSuggestions.structuredOrder.services.map((service, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{service.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{service.estimatedHours}h · Prioridad: {service.priority}</p>
                    </div>
                    <span className="text-emerald-600 font-bold text-sm">
                      ${(service.estimatedHours * 350).toLocaleString('es-MX')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {aiSuggestions.structuredOrder.diagnosticsNeeded.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Diagnósticos recomendados:</p>
                <ul className="space-y-1">
                  {aiSuggestions.structuredOrder.diagnosticsNeeded.map((diag, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      {diag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowAIModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyAISuggestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                Agregar servicios
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Main render ──────────────────────────────────────────────────────────────

  const mainStatuses = STATUS_CONFIG.filter(s => s.group === 'main');
  const auxStatuses = STATUS_CONFIG.filter(s => s.group === 'aux');

  return (
    <div className="space-y-5">
      {/* Backdrop para cerrar dropdowns de tarjetas */}
      <div
        className="fixed inset-0 z-0"
        onClick={() => setOpenDropdowns({})}
        style={{ display: Object.values(openDropdowns).some(Boolean) ? 'block' : 'none' }}
      />

      {/* Page header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Órdenes de Trabajo</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gestión de órdenes de servicio</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchWorkOrders}
            className="bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva orden</span>
          </button>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente, vehículo o servicio..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'all' | WorkOrderStatus)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos los estados</option>
              <optgroup label="Estados principales">
                {mainStatuses.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </optgroup>
              <optgroup label="Estados auxiliares">
                {auxStatuses.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Status legend pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_CONFIG.map(s => {
          const count = workOrders.filter(o => o.status === s.value).length;
          if (count === 0) return null;
          return (
            <button
              key={s.value}
              onClick={() => setStatusFilter(statusFilter === s.value ? 'all' : s.value)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                statusFilter === s.value
                  ? `${s.bg} ${s.color} ${s.border} ring-2 ring-offset-1 ring-current`
                  : `${s.bg} ${s.color} ${s.border} opacity-70 hover:opacity-100`
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
              <span className="ml-0.5 bg-white/60 rounded-full px-1.5 py-0.5 text-xs font-bold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Orders grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <Wrench className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-gray-700 mb-1">No se encontraron órdenes</h3>
          <p className="text-sm text-gray-400">
            {searchTerm || statusFilter !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'No hay órdenes de trabajo registradas'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map(order => {
            const cfg = getStatusConfig(order.status);
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Card top accent */}
                <div className={`h-1 ${cfg.dot}`} />

                <div className="p-5">
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border}`}>
                        <Wrench className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{order.numero_ot}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{order.service}</p>
                      </div>
                    </div>

                    {/* Status dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdowns(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer hover:opacity-80 transition-opacity ${cfg.bg} ${cfg.color} ${cfg.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {openDropdowns[order.id] && (
                        <StatusDropdown
                          current={order.status}
                          onChange={ns => handleStatusChange(order.id, ns)}
                          onClose={() => setOpenDropdowns(prev => ({ ...prev, [order.id]: false }))}
                        />
                      )}
                    </div>
                  </div>

                  {/* Info rows */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{order.client}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Car className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{order.vehicle}{order.vehiclePlate ? ` · ${order.vehiclePlate}` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span>Ingreso: {order.startDate}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {order.quotationApproved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Cotización OK
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-emerald-600">
                        ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Gestionar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showDetailModal && <OrderDetailModal />}
      {showAIModal && <AIModal />}
    </div>
  );
};

export default WorkOrders;
