import React, { useState, useCallback, memo } from 'react';
import { Plus, Search, Filter, Calendar as CalendarIcon, Clock, User, Car, Phone, MapPin, AlertCircle, CheckCircle, X } from 'lucide-react';

interface ReferenceWindowProps {
  showWindow: boolean;
  onClose: () => void;
}

const ReferenceWindow = memo<ReferenceWindowProps>(({ showWindow, onClose }) => {
  const [clientType, setClientType] = useState('existente');
  const [personType, setPersonType] = useState('natural');
  const [vehicleType, setVehicleType] = useState('existente');
  const [formData, setFormData] = useState({
    identification: '',
    fullName: '',
    address: '',
    phone: '',
    vin: '',
    model: '',
    brand: '',
    year: '',
    plate: '',
    mileage: '',
    maintenance: '',
    maintenancePlan: ''
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSchedule = useCallback(() => {
    console.log('Agendando cita con datos:', formData);
    onClose();
  }, [formData, onClose]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSchedule();
  }, [handleSchedule]);

  if (!showWindow) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Agendamiento Manual de Citas</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleFormSubmit}>
          {/* Cliente/Vehículo Tab */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-t-lg px-4 py-2">
              <h3 className="text-sm font-medium text-blue-800">Cliente/Vehículo</h3>
            </div>
            
            <div className="border border-t-0 border-blue-200 rounded-b-lg p-4 bg-white">
              {/* Tipo Cliente */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo cliente</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="clientType"
                      value="existente"
                      checked={clientType === 'existente'}
                      onChange={(e) => setClientType(e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Existente</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="clientType"
                      value="nuevo"
                      checked={clientType === 'nuevo'}
                      onChange={(e) => setClientType(e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Nuevo</span>
                  </label>
                </div>
              </div>

              {/* Tipo Persona */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Persona</label>
                <select
                  value={personType}
                  onChange={(e) => setPersonType(e.target.value)}
                  className="w-32 border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="natural">Natural</option>
                  <option value="juridica">Jurídica</option>
                </select>
              </div>

              {/* Identificación y Nombre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Identificación</label>
                  <input
                    type="text"
                    value={formData.identification}
                    onChange={(e) => handleInputChange('identification', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Dirección y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tipo Vehículo */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Vehículo</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="vehicleType"
                      value="existente"
                      checked={vehicleType === 'existente'}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Existente</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="vehicleType"
                      value="nuevo"
                      checked={vehicleType === 'nuevo'}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Nuevo</span>
                  </label>
                </div>
              </div>

              {/* Información del Vehículo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                  <input
                    type="text"
                    value={formData.vin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^A-HJ-NPR-Z0-9]/g, '').toUpperCase();
                      if (value.length <= 17) {
                        handleInputChange('vin', value);
                      }
                    }}
                    maxLength={17}
                    placeholder="Ej: 1HGBH41JXMN109186"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Exactamente 17 caracteres alfanuméricos (sin I, O, Q)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Información adicional del vehículo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 4 && /^\d*$/.test(value)) {
                        handleInputChange('year', value);
                      }
                    }}
                    min="1990"
                    max="2025"
                    placeholder="Ej: 2020"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                  <input
                    type="text"
                    value={formData.plate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                      if (value.length <= 7) {
                        handleInputChange('plate', value);
                      }
                    }}
                    maxLength={7}
                    placeholder="Ej: ABC123D"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Solo letras y números, máximo 7 caracteres</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje</label>
                  <input
                    type="text"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cita Tab */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-t-lg px-4 py-2">
              <h3 className="text-sm font-medium text-blue-800">Cita</h3>
            </div>
            
            <div className="border border-t-0 border-blue-200 rounded-b-lg p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mantenimiento</label>
                  <select
                    value={formData.maintenance}
                    onChange={(e) => handleInputChange('maintenance', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="preventivo">Mantenimiento Preventivo</option>
                    <option value="correctivo">Mantenimiento Correctivo</option>
                    <option value="revision">Revisión General</option>
                    <option value="diagnostico">Diagnóstico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Mantenimiento</label>
                  <select
                    value={formData.maintenancePlan}
                    onChange={(e) => handleInputChange('maintenancePlan', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="basico">Plan Básico</option>
                    <option value="completo">Plan Completo</option>
                    <option value="premium">Plan Premium</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSchedule}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Agendar</span>
          </button>
        </div>
      </div>
    </div>
  );
});

ReferenceWindow.displayName = 'ReferenceWindow';

const ManualScheduling: React.FC = () => {
  const [showReferenceWindow, setShowReferenceWindow] = useState(false);

  const handleCloseWindow = useCallback(() => {
    setShowReferenceWindow(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowReferenceWindow(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Cita</span>
        </button>
      </div>

      {/* Información */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center py-12">
          <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Agendamiento Manual de Citas</h3>
          <p className="text-gray-600 mb-6">
            Utiliza el formulario completo para registrar nuevos clientes y vehículos mientras programas citas
          </p>
          <button
            onClick={() => setShowReferenceWindow(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Abrir Formulario de Agendamiento</span>
          </button>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <h4 className="font-semibold text-blue-900 mb-3">Características del Formulario</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Registro de clientes nuevos y existentes</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Información completa del vehículo</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Selección de tipo de mantenimiento</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Planes de mantenimiento disponibles</span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <h4 className="font-semibold text-green-900 mb-3">Tipos de Cliente</h4>
          <div className="space-y-3 text-sm text-green-800">
            <div>
              <strong>Existente:</strong> Cliente ya registrado en el sistema
            </div>
            <div>
              <strong>Nuevo:</strong> Cliente que se registra por primera vez
            </div>
            <div>
              <strong>Persona Natural:</strong> Cliente individual
            </div>
            <div>
              <strong>Persona Jurídica:</strong> Empresa o institución
            </div>
          </div>
        </div>
      </div>

      <ReferenceWindow showWindow={showReferenceWindow} onClose={handleCloseWindow} />
    </div>
  );
};

export default ManualScheduling;