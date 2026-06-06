import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Loader2, Plus, UserPlus, Car } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useUser } from '../users/UserContext';

interface Cliente {
  id: string;
  nombre: string;
}

interface Vehículo {
  id: string;
  marca: string | null;
  modelo: string | null;
  placa: string | null;
  cliente_id: string | null;
}

interface NewWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ESTADOS = [
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

const MARCAS = [
  'Acura', 'Alfa Romeo', 'Audi', 'BMW', 'Buick', 'Cadillac',
  'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford',
  'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia',
  'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz',
  'Mini', 'Mitsubishi', 'Nissan', 'Porsche', 'Ram', 'Renault',
  'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

const NewWorkOrderModal: React.FC<NewWorkOrderModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { empresa_id, sucursal_id } = useUser();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehículos, setVehículos] = useState<Vehículo[]>([]);
  const [filteredVehículos, setFilteredVehículos] = useState<Vehículo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextOrderNumber, setNextOrderNumber] = useState('OT-0001');

  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
  const [creatingClient, setCreatingClient] = useState(false);
  const [creatingVehicle, setCreatingVehicle] = useState(false);

  const [newClientData, setNewClientData] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });

  const [newVehicleData, setNewVehicleData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    anio: '',
    color: ''
  });

  const [formData, setFormData] = useState({
    descripcion: '',
    estado: 'recepcion',
    total: '',
    cliente_id: '',
    vehículo_id: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.cliente_id) {
      const clienteVehículos = vehículos.filter(v => v.cliente_id === formData.cliente_id);
      setFilteredVehículos(clienteVehículos);
      if (!clienteVehículos.find(v => v.id === formData.vehículo_id)) {
        setFormData(prev => ({ ...prev, vehículo_id: '' }));
      }
    } else {
      setFilteredVehículos([]);
    }
  }, [formData.cliente_id, vehículos]);

  const resetForm = () => {
    setFormData({
      descripcion: '',
      estado: 'recepcion',
      total: '',
      cliente_id: '',
      vehículo_id: ''
    });
    setNewClientData({ nombre: '', telefono: '', email: '' });
    setNewVehicleData({ placa: '', marca: '', modelo: '', anio: '', color: '' });
    setShowNewClientForm(false);
    setShowNewVehicleForm(false);
    setError(null);
  };

  const generateNextOrderNumber = async (): Promise<string> => {
    const { data, error } = await supabase
      .from('ordenes_trabajo')
      .select('numero_ot')
      .eq('empresa_id', empresa_id)
      .order('numero_ot', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching last order:', error);
      return '000001';
    }

    if (!data || !data.numero_ot) return '000001';

    const last = parseInt(data.numero_ot, 10);
    if (isNaN(last)) return '000001';
    return String(last + 1).padStart(6, '0');
  };

  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nombre')
      .eq('empresa_id', empresa_id)
      .order('nombre');

    if (!error && data) {
      setClientes(data);
    }
    return data || [];
  };

  const fetchVehículos = async () => {
    const { data, error } = await supabase
      .from('vehículos')
      .select('id, marca, modelo, placa, cliente_id')
      .eq('empresa_id', empresa_id)
      .order('marca');

    if (!error && data) {
      setVehículos(data);
    }
    return data || [];
  };

  const fetchData = async () => {
    setLoadingData(true);
    setError(null);

    try {
      const [clientesData, vehículosData, nextNumber] = await Promise.all([
        fetchClientes(),
        fetchVehículos(),
        generateNextOrderNumber()
      ]);

      setClientes(clientesData);
      setVehículos(vehículosData);
      setNextOrderNumber(nextNumber);
    } catch (err) {
      setError('Error al cargar datos');
    }

    setLoadingData(false);
  };

  const handleCreateClient = async () => {
    if (!newClientData.nombre.trim()) {
      setError('El nombre del cliente es requerido');
      return;
    }

    setCreatingClient(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from('clientes')
      .insert({
        empresa_id,
        nombre: newClientData.nombre.trim(),
        telefono: newClientData.telefono.trim() || null,
        email: newClientData.email.trim() || null
      })
      .select('id, nombre')
      .single();

    if (insertError) {
      setError('Error al crear cliente: ' + insertError.message);
      setCreatingClient(false);
      return;
    }

    console.log('Cliente creado:', data);

    await fetchClientes();

    setFormData(prev => ({ ...prev, cliente_id: data.id, vehículo_id: '' }));
    setNewClientData({ nombre: '', telefono: '', email: '' });
    setShowNewClientForm(false);
    setCreatingClient(false);
  };

  const handleCreateVehicle = async () => {
    if (!formData.cliente_id) {
      setError('Selecciona un cliente primero');
      return;
    }

    setCreatingVehicle(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from('vehículos')
      .insert({
        empresa_id,
        cliente_id: formData.cliente_id,
        placa: newVehicleData.placa.trim().toUpperCase() || null,
        marca: newVehicleData.marca.trim() || null,
        modelo: newVehicleData.modelo.trim() || null,
        anio: newVehicleData.anio ? parseInt(newVehicleData.anio) : null,
        color: newVehicleData.color.trim() || null
      })
      .select('id, marca, modelo, placa, cliente_id')
      .single();

    if (insertError) {
      setError('Error al crear vehículo: ' + insertError.message);
      setCreatingVehicle(false);
      return;
    }

    console.log('Vehículo creado:', data);

    await fetchVehículos();

    setFormData(prev => ({ ...prev, vehículo_id: data.id }));
    setNewVehicleData({ placa: '', marca: '', modelo: '', anio: '', color: '' });
    setShowNewVehicleForm(false);
    setCreatingVehicle(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const orderData = {
      empresa_id,
      sucursal_id,
      numero_ot: nextOrderNumber,
      descripcion: formData.descripcion.trim() || null,
      estado: formData.estado,
      total: formData.total ? parseFloat(formData.total) : 0,
      cliente_id: formData.cliente_id || null,
      vehículo_id: formData.vehículo_id || null
    };

    console.log('Creando orden con datos:', {
      empresa_id: orderData.empresa_id,
      sucursal_id: orderData.sucursal_id,
      cliente_id: orderData.cliente_id,
      vehículo_id: orderData.vehículo_id,
      numero_ot: orderData.numero_ot
    });

    const { data, error: insertError } = await supabase
      .from('ordenes_trabajo')
      .insert(orderData)
      .select()
      .single();

    if (insertError) {
      console.error('Error al crear orden:', insertError);
      setError('Error al crear la orden: ' + insertError.message);
      setLoading(false);
      return;
    }

    console.log('Orden creada exitosamente:', data);

    setLoading(false);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-2xl p-6 my-8 text-left align-middle bg-white rounded-2xl shadow-2xl transform transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Nueva Orden de Trabajo</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Orden
                  </label>
                  <input
                    type="text"
                    value={nextOrderNumber}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Generado automáticamente</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ESTADOS.map(estado => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Cliente
                  </label>
                  {!showNewClientForm && (
                    <button
                      type="button"
                      onClick={() => setShowNewClientForm(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Nuevo Cliente</span>
                    </button>
                  )}
                </div>

                {showNewClientForm ? (
                  <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={newClientData.nombre}
                        onChange={(e) => setNewClientData({ ...newClientData, nombre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Nombre del cliente"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                        <input
                          type="tel"
                          value={newClientData.telefono}
                          onChange={(e) => setNewClientData({ ...newClientData, telefono: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Teléfono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={newClientData.email}
                          onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewClientForm(false);
                          setNewClientData({ nombre: '', telefono: '', email: '' });
                        }}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                        disabled={creatingClient}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateClient}
                        disabled={creatingClient}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
                      >
                        {creatingClient ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Creando...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Crear Cliente</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <select
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value, vehículo_id: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                )}

                {formData.cliente_id && (
                  <p className="mt-2 text-xs text-green-600">
                    Cliente seleccionado: ID {formData.cliente_id.slice(0, 8)}...
                  </p>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Vehículo
                  </label>
                  {!showNewVehicleForm && formData.cliente_id && (
                    <button
                      type="button"
                      onClick={() => setShowNewVehicleForm(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <Car className="w-4 h-4" />
                      <span>Nuevo Vehículo</span>
                    </button>
                  )}
                </div>

                {!formData.cliente_id ? (
                  <p className="text-sm text-gray-500 italic">Selecciona un cliente primero</p>
                ) : showNewVehicleForm ? (
                  <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Placa</label>
                        <input
                          type="text"
                          value={newVehicleData.placa}
                          onChange={(e) => setNewVehicleData({ ...newVehicleData, placa: e.target.value.toUpperCase() })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="ABC123"
                          maxLength={10}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Marca</label>
                        <select
                          value={newVehicleData.marca}
                          onChange={(e) => setNewVehicleData({ ...newVehicleData, marca: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Seleccionar...</option>
                          {MARCAS.map(marca => (
                            <option key={marca} value={marca}>{marca}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Modelo</label>
                        <input
                          type="text"
                          value={newVehicleData.modelo}
                          onChange={(e) => setNewVehicleData({ ...newVehicleData, modelo: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Corolla"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Año</label>
                        <input
                          type="number"
                          value={newVehicleData.anio}
                          onChange={(e) => setNewVehicleData({ ...newVehicleData, anio: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="2020"
                          min="1990"
                          max="2030"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                        <input
                          type="text"
                          value={newVehicleData.color}
                          onChange={(e) => setNewVehicleData({ ...newVehicleData, color: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Blanco"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewVehicleForm(false);
                          setNewVehicleData({ placa: '', marca: '', modelo: '', anio: '', color: '' });
                        }}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                        disabled={creatingVehicle}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateVehicle}
                        disabled={creatingVehicle}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
                      >
                        {creatingVehicle ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Creando...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Crear Vehículo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <select
                      value={formData.vehículo_id}
                      onChange={(e) => setFormData({ ...formData, vehículo_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Seleccionar vehículo...</option>
                      {filteredVehículos.map(vehículo => (
                        <option key={vehículo.id} value={vehículo.id}>
                          {[vehículo.placa, vehículo.marca, vehículo.modelo].filter(Boolean).join(' - ') || 'Sin datos'}
                        </option>
                      ))}
                    </select>
                    {filteredVehículos.length === 0 && (
                      <p className="mt-2 text-sm text-amber-600">
                        Este cliente no tiene vehículos registrados. Crea uno nuevo.
                      </p>
                    )}
                  </>
                )}

                {formData.vehículo_id && (
                  <p className="mt-2 text-xs text-green-600">
                    Vehículo seleccionado: ID {formData.vehículo_id.slice(0, 8)}...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Descripción del trabajo a realizar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Estimado
                </label>
                <input
                  type="number"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Crear Orden</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewWorkOrderModal;
