import React, { useState, useEffect } from 'react';
import { Plus, Search, Car, CreditCard as Edit, Trash2, Eye, Filter, RefreshCw, X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useUser } from '../../../components/users/UserContext';
interface Vehículo {
  id: string;
  marca: string | null;
  modelo: string | null;
  anio: number | null;
  placa: string | null;
  vin: string | null;
  color: string | null;
  kilometraje: number | null;
  cliente_id: string | null;
  clientes?: {
    nombre: string;
  } | null;
}

interface Cliente {
  id: string;
  nombre: string;
}

const MARCAS = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'BMW', 'Buick', 'Cadillac',
  'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'Genesis',
  'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini',
  'Land Rover', 'Lexus', 'Lincoln', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz',
  'Mini', 'Mitsubishi', 'Nissan', 'Porsche', 'Ram', 'Renault', 'Rolls-Royce',
  'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

const Vehicles: React.FC = () => {
  const { empresa_id } = useUser();

  const [vehicles, setVehicles] = useState<Vehículo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehículo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('vehiculos')
      .select(`
        *,
        clientes (
          nombre
        )
      `)
      .eq('empresa_id', empresa_id)
      .order('marca');

    if (fetchError) {
      setError(fetchError.message);
      setVehicles([]);
    } else {
      setVehicles(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle =>
    (vehicle.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (vehicle.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (vehicle.clientes?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Esta seguro de eliminar este vehículo?')) return;

    const { error: deleteError } = await supabase
      .from('vehículos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      alert('Error al eliminar: ' + deleteError.message);
    } else {
      fetchVehicles();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-gray-600">{filteredVehicles.length} vehículos encontrados</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchVehicles}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
          <button
            onClick={() => {
              setSelectedVehicle(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Vehículo</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por placa, marca, modelo o propietario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3 text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Cargando vehículos...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600">{error}</p>
          <button onClick={fetchVehicles} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Reintentar
          </button>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron vehículos</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta ajustar los filtros de busqueda' : 'Registra tu primer vehículo'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{vehicle.placa || 'Sin placa'}</h3>
                      <p className="text-sm text-gray-600">{vehicle.marca} {vehicle.modelo}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Anio:</span>
                    <span className="font-medium">{vehicle.anio || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">{vehicle.color || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VIN:</span>
                    <span className="font-medium text-xs">{vehicle.vin || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Propietario:</span>
                    <span className="font-medium">{vehicle.clientes?.nombre || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kilometraje:</span>
                    <span className="font-medium">{vehicle.kilometraje?.toLocaleString() || '0'} km</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 p-1">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowModal(true);
                      }}
                      className="text-gray-600 hover:text-gray-700 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => {
            setShowModal(false);
            setSelectedVehicle(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setSelectedVehicle(null);
            fetchVehicles();
          }}
        />
      )}
    </div>
  );
};

interface VehicleModalProps {
  vehicle: Vehículo | null;
  onClose: () => void;
  onSuccess: () => void;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose, onSuccess }) => {
  const { empresa_id } = useUser();
  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [formData, setFormData] = useState({
    placa: vehicle?.placa || '',
    marca: vehicle?.marca || '',
    modelo: vehicle?.modelo || '',
    anio: vehicle?.anio?.toString() || '',
    color: vehicle?.color || '',
    vin: vehicle?.vin || '',
    kilometraje: vehicle?.kilometraje?.toString() || '',
    cliente_id: vehicle?.cliente_id || ''
  });

  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      const { data } = await supabase
        .from('clientes')
        .select('id, nombre')
        .eq('empresa_id', empresa_id)
        .order('nombre');

      setClientes(data || []);
      setLoadingClientes(false);
    };

    fetchClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      empresa_id,
      placa: formData.placa.trim().toUpperCase() || null,
      marca: formData.marca.trim() || null,
      modelo: formData.modelo.trim() || null,
      anio: formData.anio ? parseInt(formData.anio) : null,
      color: formData.color.trim() || null,
      vin: formData.vin.trim().toUpperCase() || null,
      kilometraje: formData.kilometraje ? parseInt(formData.kilometraje) : null,
      cliente_id: formData.cliente_id || null
    };

    if (vehicle) {
      const { error: updateError } = await supabase
        .from('vehículos')
        .update(payload)
        .eq('id', vehicle.id);

      if (updateError) {
        setError('Error al actualizar: ' + updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('vehículos')
        .insert(payload);

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
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative inline-block w-full max-w-2xl p-6 my-8 text-left align-middle bg-white rounded-2xl shadow-2xl transform transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                <input
                  type="text"
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                  maxLength={10}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ABC123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <select
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar marca</option>
                  {MARCAS.map(marca => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Corolla"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anio</label>
                <input
                  type="number"
                  value={formData.anio}
                  onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
                  min="1990"
                  max="2030"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Blanco"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje</label>
                <input
                  type="number"
                  value={formData.kilometraje}
                  onChange={(e) => setFormData({ ...formData, kilometraje: e.target.value })}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                  maxLength={17}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1HGBH41JXMN109186"
                />
                <p className="text-xs text-gray-500 mt-1">17 caracteres</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Propietario</label>
                {loadingClientes ? (
                  <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500">
                    Cargando clientes...
                  </div>
                ) : (
                  <select
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                    ))}
                  </select>
                )}
              </div>
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
                    <span>{vehicle ? 'Actualizar' : 'Crear'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
