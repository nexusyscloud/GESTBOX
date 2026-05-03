import React, { useState } from 'react';
import { Plus, Search, Edit } from 'lucide-react';

const MeasurementUnits: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  const measurementUnits = [
    {
      id: 1,
      abbreviation: 'Bt',
      name: 'Botella',
      plural: 'Botellas'
    },
    {
      id: 2,
      abbreviation: 'CJ',
      name: 'Caja',
      plural: 'Cajas'
    },
    {
      id: 3,
      abbreviation: '',
      name: 'Carton',
      plural: 'Cartones'
    },
    {
      id: 4,
      abbreviation: 'cm',
      name: 'Centimetro',
      plural: 'Centimetros'
    },
    {
      id: 5,
      abbreviation: 'Fc',
      name: 'Frasco',
      plural: 'Frascos'
    },
    {
      id: 6,
      abbreviation: 'gr',
      name: 'Gramo',
      plural: 'Gramos'
    },
    {
      id: 7,
      abbreviation: 'Kg',
      name: 'Kilogramo',
      plural: 'Kilogramos'
    }
  ];

  const filteredUnits = measurementUnits.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.plural.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UnitModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {selectedUnit ? 'Editar Unidad de Medición' : 'Nueva Unidad de Medición'}
          </h3>
          <button
            onClick={() => {
              setShowModal(false);
              setSelectedUnit(null);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Abreviatura
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: kg, cm, lt"
              defaultValue={selectedUnit?.abbreviation || ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre (Singular)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Kilogramo, Centímetro, Litro"
              defaultValue={selectedUnit?.name || ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre (Plural)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Kilogramos, Centímetros, Litros"
              defaultValue={selectedUnit?.plural || ''}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedUnit(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {selectedUnit ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Administración de tipos medición</h2>
          <p className="text-gray-500 text-sm mt-1">Unidades de medición</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Medidas de medición..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
              <span className="text-sm font-medium text-gray-700">Abreviatura</span>
            </div>
            <div className="col-span-3">
              <span className="text-sm font-medium text-gray-700">Nombre</span>
            </div>
            <div className="col-span-3">
              <span className="text-sm font-medium text-gray-700">Plural</span>
            </div>
            <div className="col-span-3 flex justify-end">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {filteredUnits.map((unit, index) => (
            <div key={unit.id} className={`px-6 py-4 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <span className="text-sm text-gray-900 font-medium">{unit.abbreviation}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-sm text-gray-900">{unit.name}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-sm text-gray-900">{unit.plural}</span>
                </div>
                <div className="col-span-3 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedUnit(unit);
                      setShowModal(true);
                    }}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredUnits.length} de {measurementUnits.length} unidades de medición
      </div>

      {showModal && <UnitModal />}
    </div>
  );
};

export default MeasurementUnits;