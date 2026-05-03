import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Car, AlertTriangle, CheckCircle, Camera, Wrench, Plus, X, Loader2, Fuel, ChevronRight, Upload, Trash2 } from 'lucide-react';
import { supabase, EMPRESA_ID } from '../lib/supabase';

interface Client {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  identificacion: string | null;
}

interface Vehicle {
  id: string;
  placa: string | null;
  marca: string | null;
  modelo: string | null;
  anio: number | null;
  color: string | null;
  vin: string | null;
  cliente_id: string | null;
}

interface VehicleReceptionProps {
  onOrderCreated?: (orderId: string) => void;
}

type ChecklistKey =
  | 'spareTire'
  | 'jack'
  | 'toolkit'
  | 'documents'
  | 'radio'
  | 'antenna'
  | 'mirrors'
  | 'wipers'
  | 'mats'
  | 'extinguisher';

type ExteriorDamageKey =
  | 'frontBumper'
  | 'rearBumper'
  | 'hood'
  | 'trunk'
  | 'leftDoors'
  | 'rightDoors'
  | 'windshield'
  | 'rearWindow'
  | 'leftMirror'
  | 'rightMirror'
  | 'wheels'
  | 'lights';

type ChecklistState = Record<ChecklistKey, boolean>;
type ExteriorDamageState = Record<ExteriorDamageKey, boolean>;

const initialReceptionData = () => ({
  mileage: '',
  fuelLevel: 2,
  serviceType: '',
  problemDescription: '',
  priority: 'normal' as 'normal' | 'urgente' | 'express',
  deliveryDate: '',
  advisor: '',
  checklist: {
    spareTire: false,
    jack: false,
    toolkit: false,
    documents: false,
    radio: false,
    antenna: false,
    mirrors: false,
    wipers: false,
    mats: false,
    extinguisher: false
  } as ChecklistState,
  exteriorDamage: {
    frontBumper: false,
    rearBumper: false,
    hood: false,
    trunk: false,
    leftDoors: false,
    rightDoors: false,
    windshield: false,
    rearWindow: false,
    leftMirror: false,
    rightMirror: false,
    wheels: false,
    lights: false
  } as ExteriorDamageState,
  observations: '',
  photos: [] as { id: string; url: string; name: string }[]
});

const VehicleReception: React.FC<VehicleReceptionProps> = ({ onOrderCreated }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'client' | 'vehicle' | 'reception'>('client');
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderCreated, setOrderCreated] = useState<string | null>(null);
  const [creatingClient, setCreatingClient] = useState(false);
  const [creatingVehicle, setCreatingVehicle] = useState(false);

  const [clientSearch, setClientSearch] = useState('');
  const [clientResults, setClientResults] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    nombre: '',
    telefono: '',
    email: '',
    identificacion: ''
  });

  const [vehicleResults, setVehicleResults] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    placa: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    color: '',
    vin: ''
  });

  const [receptionData, setReceptionData] = useState(initialReceptionData());

  const advisors = [
    'Carlos Mendez Garcia',
    'Roberto Silva Jimenez',
    'Ana Fernandez Cruz',
    'Miguel Torres Lopez'
  ];

  const serviceTypes = [
    'Mantenimiento Preventivo',
    'Reparacion Mecanica',
    'Sistema de Frenos',
    'Sistema Electrico',
    'Aire Acondicionado',
    'Transmision',
    'Suspension',
    'Diagnostico General',
    'Revision Pre-compra',
    'Otro'
  ];

  useEffect(() => {
    if (selectedClient) {
      fetchVehiclesByClient(selectedClient.id);
    } else {
      setVehicleResults([]);
      setSelectedVehicle(null);
    }
  }, [selectedClient]);

  const handleClientSearch = async () => {
    if (!clientSearch.trim()) return;
    setIsSearching(true);
    setClientResults([]);
    setShowNewClientForm(false);

    const searchTerm = clientSearch.trim().toLowerCase();

    const { data, error } = await supabase
      .from('clientes')
      .select('id, nombre, telefono, email, identificacion')
      .eq('empresa_id', EMPRESA_ID)
      .or(`nombre.ilike.%${searchTerm}%,identificacion.ilike.%${searchTerm}%,telefono.ilike.%${searchTerm}%`)
      .order('nombre')
      .limit(10);

    setIsSearching(false);

    if (error) {
      console.error('Error searching clients:', error);
      return;
    }

    if (data && data.length > 0) {
      setClientResults(data);
      setShowNewClientForm(false);
    } else {
      setClientResults([]);
      setShowNewClientForm(true);
      setNewClient(prev => ({
        ...prev,
        identificacion: searchTerm.includes('-') || /^[a-zA-Z]/.test(searchTerm) ? searchTerm.toUpperCase() : '',
        telefono: /^\d+$/.test(searchTerm) ? searchTerm : '',
        nombre: !searchTerm.includes('-') && !/^\d+$/.test(searchTerm) && !/^[vVeEjJgGpP]-?\d/.test(searchTerm) ? searchTerm : ''
      }));
    }
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setClientResults([]);
    setClientSearch('');
    setShowNewClientForm(false);
  };

  const handleCreateClient = async () => {
    if (!newClient.nombre.trim()) return;

    setCreatingClient(true);

    const { data, error } = await supabase
      .from('clientes')
      .insert({
        empresa_id: EMPRESA_ID,
        nombre: newClient.nombre.trim(),
        identificacion: newClient.identificacion.trim().toUpperCase() || null,
        telefono: newClient.telefono.trim() || null,
        email: newClient.email.trim() || null,
        estado: 'activo'
      })
      .select('id, nombre, telefono, email, identificacion')
      .single();

    setCreatingClient(false);

    if (error) {
      console.error('Error creating client:', error);
      return;
    }

    console.log('Cliente creado en Recepcion Vehicular:', data);
    setSelectedClient(data);
    setShowNewClientForm(false);
    setNewClient({ nombre: '', telefono: '', email: '', identificacion: '' });
  };

  const fetchVehiclesByClient = async (clientId: string) => {
    const { data, error } = await supabase
      .from('vehiculos')
      .select('id, placa, marca, modelo, anio, color, vin, cliente_id')
      .eq('empresa_id', EMPRESA_ID)
      .eq('cliente_id', clientId)
      .order('marca');

    if (error) {
      console.error('Error fetching vehicles:', error);
      return;
    }

    setVehicleResults(data || []);
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowNewVehicleForm(false);
  };

  const handleCreateVehicle = async () => {
    if (!selectedClient || !newVehicle.placa.trim()) return;

    setCreatingVehicle(true);

    const { data, error } = await supabase
      .from('vehiculos')
      .insert({
        empresa_id: EMPRESA_ID,
        cliente_id: selectedClient.id,
        placa: newVehicle.placa.trim().toUpperCase(),
        marca: newVehicle.marca.trim() || null,
        modelo: newVehicle.modelo.trim() || null,
        anio: newVehicle.anio || null,
        color: newVehicle.color.trim() || null,
        vin: newVehicle.vin.trim().toUpperCase() || null
      })
      .select('id, placa, marca, modelo, anio, color, vin, cliente_id')
      .single();

    setCreatingVehicle(false);

    if (error) {
      console.error('Error creating vehicle:', error);
      return;
    }

    console.log('Vehiculo creado en Recepcion Vehicular:', data);
    setSelectedVehicle(data);
    setShowNewVehicleForm(false);
    setNewVehicle({ placa: '', marca: '', modelo: '', anio: new Date().getFullYear(), color: '', vin: '' });
    await fetchVehiclesByClient(selectedClient.id);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReceptionData(prev => ({
          ...prev,
          photos: [...prev.photos, {
            id: Date.now().toString() + Math.random(),
            url: ev.target?.result as string,
            name: file.name
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (photoId: string) => {
    setReceptionData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId)
    }));
  };

  const generateNextNumeroOt = async (): Promise<string> => {
    const { data, error } = await supabase
      .from('ordenes_trabajo')
      .select('numero_ot')
      .eq('empresa_id', EMPRESA_ID)
      .order('numero_ot', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error consultando ultimo numero_ot:', error);
      return '000001';
    }

    if (!data || !data.numero_ot) return '000001';

    const last = parseInt(data.numero_ot, 10);
    if (isNaN(last)) return '000001';
    return String(last + 1).padStart(6, '0');
  };

  const handleCreateOrder = async () => {
    if (!selectedClient || !selectedVehicle) return;

    setIsCreatingOrder(true);

    // 1 — Insertar recepción
    const recepcionPayload = {
      empresa_id: EMPRESA_ID,
      sucursal_id: null,
      cliente_id: selectedClient.id,
      vehiculo_id: selectedVehicle.id,
      kilometraje: receptionData.mileage ? parseInt(receptionData.mileage, 10) : null,
      nivel_combustible: receptionData.fuelLevel,
      motivo_ingreso: receptionData.serviceType
        ? `${receptionData.serviceType}: ${receptionData.problemDescription.trim()}`
        : receptionData.problemDescription.trim(),
      observaciones: receptionData.observations.trim() || null,
      estado: 'abierto',
      prioridad: receptionData.priority,
      asesor: receptionData.advisor || null,
      fecha_entrega_prometida: receptionData.deliveryDate || null,
      checklist: receptionData.checklist,
      danos_exteriores: receptionData.exteriorDamage
    };

    const { data: recepcion, error: recepcionError } = await supabase
      .from('recepciones')
      .insert(recepcionPayload)
      .select()
      .single();

    if (recepcionError) {
      console.error('Error al guardar recepción:', recepcionError);
      alert('Error al guardar la recepción: ' + recepcionError.message);
      setIsCreatingOrder(false);
      return;
    }

    // 2 — Generar numero_ot secuencial
    const numero_ot = await generateNextNumeroOt();

    // 3 — Insertar orden de trabajo
    const otPayload = {
      empresa_id: EMPRESA_ID,
      sucursal_id: null,
      cliente_id: selectedClient.id,
      vehiculo_id: selectedVehicle.id,
      recepcion_id: recepcion.id,
      numero_ot,
      estado: 'recepcion',
      prioridad: receptionData.priority,
      asesor: receptionData.advisor || null,
      fecha_recepcion: new Date().toISOString()
    };

    const { data: orden, error: otError } = await supabase
      .from('ordenes_trabajo')
      .insert(otPayload)
      .select()
      .single();

    setIsCreatingOrder(false);

    if (otError) {
      console.error('Error al crear orden de trabajo:', otError);
      alert('Recepción guardada pero error al crear la OT: ' + otError.message);
      return;
    }

    setOrderCreated(orden.numero_ot);

    if (onOrderCreated) {
      setTimeout(() => onOrderCreated(orden.id), 2000);
    }
  };

  const canProceedToVehicle = selectedClient !== null;
  const canProceedToReception = selectedVehicle !== null;
  const canCreateOrder = Boolean(receptionData.mileage && receptionData.serviceType && receptionData.problemDescription && receptionData.deliveryDate);

  const FuelGauge = () => {
    const levels = [
      { value: 0, label: 'E' },
      { value: 1, label: '1/4' },
      { value: 2, label: '1/2' },
      { value: 3, label: '3/4' },
      { value: 4, label: 'F' }
    ];

    return (
      <div className="flex items-center space-x-1">
        {levels.map((level, index) => (
          <button
            key={level.value}
            type="button"
            onClick={() => setReceptionData(prev => ({ ...prev, fuelLevel: level.value }))}
            className={`relative flex-1 h-10 rounded transition-all ${
              index <= receptionData.fuelLevel
                ? index === 0 ? 'bg-red-500' : index <= 1 ? 'bg-yellow-500' : 'bg-green-500'
                : 'bg-gray-200'
            }`}
          >
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
              index <= receptionData.fuelLevel ? 'text-white' : 'text-gray-500'
            }`}>
              {level.label}
            </span>
          </button>
        ))}
      </div>
    );
  };

  const ChecklistSection = <T extends ChecklistKey | ExteriorDamageKey>({
    title,
    items,
    category
  }: {
    title: string;
    items: { key: T; label: string }[];
    category: 'checklist' | 'exteriorDamage';
  }) => (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {items.map(item => {
          const checked =
            category === 'checklist'
              ? receptionData.checklist[item.key as ChecklistKey]
              : receptionData.exteriorDamage[item.key as ExteriorDamageKey];

          return (
            <label
              key={item.key}
              className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all ${
                checked
                  ? category === 'checklist' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setReceptionData(prev => ({
                  ...prev,
                  [category]: {
                    ...prev[category],
                    [item.key]: e.target.checked
                  }
                }))}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                checked
                  ? category === 'checklist' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'
                  : 'border-gray-300'
              }`}>
                {checked && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className="text-xs">{item.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  if (orderCreated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Orden creada correctamente</h2>
          <p className="text-gray-600 mb-6">
            La recepción fue guardada y la orden de trabajo fue creada correctamente.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-600 font-medium">Número de orden</p>
            <p className="text-3xl font-mono font-bold text-blue-700">{orderCreated}</p>
          </div>
          <div className="space-y-3 text-left bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Cliente:</span>
              <span className="font-medium">{selectedClient?.nombre}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehículo:</span>
              <span className="font-medium">{selectedVehicle?.marca} {selectedVehicle?.modelo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Placa:</span>
              <span className="font-medium">{selectedVehicle?.placa}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estado:</span>
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full text-xs font-medium">
                Abierto
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setOrderCreated(null);
              setStep('client');
              setSelectedClient(null);
              setSelectedVehicle(null);
              setClientSearch('');
              setReceptionData(initialReceptionData());
            }}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Nueva recepción
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recepción Vehicular</h1>
            <p className="text-gray-600">Registro de ingreso y creación de orden de trabajo</p>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <span className={`px-3 py-1 rounded-full font-medium ${step === 'client' ? 'bg-blue-600 text-white' : selectedClient ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              1. Cliente
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className={`px-3 py-1 rounded-full font-medium ${step === 'vehicle' ? 'bg-blue-600 text-white' : selectedVehicle ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              2. Vehículo
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className={`px-3 py-1 rounded-full font-medium ${step === 'reception' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              3. Recepción
            </span>
          </div>
        </div>

        {step === 'client' && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Identificar Cliente</h3>
                  <p className="text-sm text-gray-600">Busca por cédula, teléfono o nombre</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleClientSearch()}
                    placeholder="V-12345678, 555-1234, o nombre..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleClientSearch}
                  disabled={isSearching || !clientSearch.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  <span>Buscar</span>
                </button>
              </div>
            </div>

            {clientResults.length > 0 && !selectedClient && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Clientes encontrados ({clientResults.length})</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {clientResults.map(client => (
                    <button
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className="w-full p-4 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{client.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {[client.identificacion, client.telefono].filter(Boolean).join(' - ')}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedClient && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedClient.nombre}</p>
                      <p className="text-sm text-gray-600">{selectedClient.identificacion} - {selectedClient.telefono}</p>
                      <p className="text-sm text-gray-500">{selectedClient.email}</p>
                      <p className="text-xs text-green-600 mt-1">ID: {selectedClient.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedClient(null);
                      setClientSearch('');
                      setClientResults([]);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {showNewClientForm && !selectedClient && clientResults.length === 0 && (
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Cliente no encontrado - Crear nuevo</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      value={newClient.nombre}
                      onChange={(e) => setNewClient(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Identificación</label>
                    <input
                      type="text"
                      value={newClient.identificacion}
                      onChange={(e) => setNewClient(prev => ({ ...prev, identificacion: e.target.value.toUpperCase() }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={newClient.telefono}
                      onChange={(e) => setNewClient(prev => ({ ...prev, telefono: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleCreateClient}
                    disabled={!newClient.nombre.trim() || creatingClient}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {creatingClient ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creando...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Crear Cliente</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep('vehicle')}
                disabled={!canProceedToVehicle}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>Continuar</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 'vehicle' && (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Seleccionar Vehículo</h3>
                  <p className="text-sm text-gray-600">Vehículos registrados de {selectedClient?.nombre}</p>
                </div>
              </div>

              {vehicleResults.length > 0 && !selectedVehicle && (
                <div className="space-y-2 mb-4">
                  {vehicleResults.map(vehicle => (
                    <button
                      key={vehicle.id}
                      onClick={() => handleSelectVehicle(vehicle)}
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-green-400 hover:bg-green-50 transition-colors flex items-center space-x-3"
                    >
                      <Car className="w-5 h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {[vehicle.marca, vehicle.modelo, vehicle.anio].filter(Boolean).join(' ')}
                        </p>
                        <p className="text-sm text-gray-500">Placa: {vehicle.placa} - Color: {vehicle.color}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}

              {vehicleResults.length === 0 && !showNewVehicleForm && (
                <p className="text-sm text-amber-600 mb-4">Este cliente no tiene vehículos registrados.</p>
              )}

              {!selectedVehicle && !showNewVehicleForm && (
                <button
                  onClick={() => setShowNewVehicleForm(true)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Registrar nuevo vehículo</span>
                </button>
              )}
            </div>

            {selectedVehicle && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedVehicle.marca} {selectedVehicle.modelo} {selectedVehicle.anio}</p>
                      <p className="text-sm text-gray-600">Placa: {selectedVehicle.placa} - Color: {selectedVehicle.color}</p>
                      {selectedVehicle.vin && <p className="text-sm text-gray-500">VIN: {selectedVehicle.vin}</p>}
                      <p className="text-xs text-green-600 mt-1">ID: {selectedVehicle.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedVehicle(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {showNewVehicleForm && !selectedVehicle && (
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Car className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Registrar nuevo vehículo</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
                    <input
                      type="text"
                      value={newVehicle.placa}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <input
                      type="text"
                      value={newVehicle.marca}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, marca: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                    <input
                      type="text"
                      value={newVehicle.modelo}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, modelo: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                    <input
                      type="number"
                      value={newVehicle.anio}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, anio: parseInt(e.target.value) || 0 }))}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      value={newVehicle.color}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                    <input
                      type="text"
                      value={newVehicle.vin}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
                      maxLength={17}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowNewVehicleForm(false);
                      setNewVehicle({ placa: '', marca: '', modelo: '', anio: new Date().getFullYear(), color: '', vin: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateVehicle}
                    disabled={!newVehicle.placa.trim() || creatingVehicle}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {creatingVehicle ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creando...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Registrar Vehículo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep('client')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Atras
              </button>
              <button
                onClick={() => setStep('reception')}
                disabled={!canProceedToReception}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>Continuar</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 'reception' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Cliente</p>
                  <p className="font-medium">{selectedClient?.nombre}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Vehículo</p>
                  <p className="font-medium">{selectedVehicle?.marca} {selectedVehicle?.modelo} - {selectedVehicle?.placa}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje actual *</label>
                <input
                  type="number"
                  value={receptionData.mileage}
                  onChange={(e) => setReceptionData(prev => ({ ...prev, mileage: e.target.value }))}
                  placeholder="Ej: 45000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Fuel className="w-4 h-4 inline mr-1" />
                  Nivel de Combustible
                </label>
                <FuelGauge />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio *</label>
                <select
                  value={receptionData.serviceType}
                  onChange={(e) => setReceptionData(prev => ({ ...prev, serviceType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <div className="flex space-x-2">
                  {[
                    { value: 'normal', label: 'Normal', color: 'bg-gray-100 text-gray-700 border-gray-300' },
                    { value: 'urgente', label: 'Urgente', color: 'bg-orange-100 text-orange-700 border-orange-300' },
                    { value: 'express', label: 'Express', color: 'bg-red-100 text-red-700 border-red-300' }
                  ].map(priority => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setReceptionData(prev => ({ ...prev, priority: priority.value as typeof prev.priority }))}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        receptionData.priority === priority.value
                          ? priority.color.replace('100', '200')
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del problema / solicitud *</label>
              <textarea
                value={receptionData.problemDescription}
                onChange={(e) => setReceptionData(prev => ({ ...prev, problemDescription: e.target.value }))}
                rows={3}
                placeholder="Describa el motivo de ingreso, síntomas o servicios solicitados..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha compromiso de entrega *</label>
                <input
                  type="date"
                  value={receptionData.deliveryDate}
                  onChange={(e) => setReceptionData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asesor / recepcionista</label>
                <select
                  value={receptionData.advisor}
                  onChange={(e) => setReceptionData(prev => ({ ...prev, advisor: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {advisors.map(advisor => (
                    <option key={advisor} value={advisor}>{advisor}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Checklist de Accesorios
              </h3>
              <ChecklistSection
                title="Elementos presentes en el vehículo"
                category="checklist"
                items={[
                  { key: 'spareTire', label: 'Llanta repuesto' },
                  { key: 'jack', label: 'Gato' },
                  { key: 'toolkit', label: 'Herramientas' },
                  { key: 'documents', label: 'Documentos' },
                  { key: 'radio', label: 'Radio' },
                  { key: 'antenna', label: 'Antena' },
                  { key: 'mirrors', label: 'Espejos' },
                  { key: 'wipers', label: 'Plumillas' },
                  { key: 'mats', label: 'Alfombras' },
                  { key: 'extinguisher', label: 'Extintor' }
                ]}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Daños visibles en carrocería
              </h3>
              <ChecklistSection
                title="Marcar áreas con daños"
                category="exteriorDamage"
                items={[
                  { key: 'frontBumper', label: 'Parachoque del.' },
                  { key: 'rearBumper', label: 'Parachoque tras.' },
                  { key: 'hood', label: 'Capo' },
                  { key: 'trunk', label: 'Maleta' },
                  { key: 'leftDoors', label: 'Puertas izq.' },
                  { key: 'rightDoors', label: 'Puertas der.' },
                  { key: 'windshield', label: 'Parabrisas' },
                  { key: 'rearWindow', label: 'Vidrio trasero' },
                  { key: 'leftMirror', label: 'Espejo izq.' },
                  { key: 'rightMirror', label: 'Espejo der.' },
                  { key: 'wheels', label: 'Rines/Cauchos' },
                  { key: 'lights', label: 'Luces' }
                ]}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-blue-600" />
                Fotos del Vehículo
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {receptionData.photos.map(photo => (
                  <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center text-gray-500 hover:text-blue-600"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs">Agregar foto</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones adicionales</label>
              <textarea
                value={receptionData.observations}
                onChange={(e) => setReceptionData(prev => ({ ...prev, observations: e.target.value }))}
                rows={2}
                placeholder="Observaciones adicionales para el técnico..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep('vehicle')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Atras
              </button>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Estado inicial de la orden:</p>
                  <p className="text-sm font-medium text-yellow-700">Pendiente de diagnóstico</p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateOrder}
                  disabled={!canCreateOrder || isCreatingOrder}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 font-medium"
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creando orden...</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="w-5 h-5" />
                      <span>Crear Orden de Trabajo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleReception;
