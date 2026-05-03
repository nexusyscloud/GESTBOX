import React, { useState } from 'react';
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, Download, Filter, Eye, Edit, Trash2 } from 'lucide-react';

const CreateProduct: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [showModal, setShowModal] = useState(false);

  const quickAccessItems = [
    {
      id: 'catalog',
      title: 'Administrar',
      subtitle: 'Catálogo de productos',
      description: 'Descarga tu catálogo .PDF',
      icon: '📄',
      color: 'bg-green-100',
      iconBg: 'bg-green-500'
    },
    {
      id: 'categories',
      title: 'Administrar',
      subtitle: 'Categorías',
      description: 'Clic aquí para administrar categorías',
      icon: '🏷️',
      color: 'bg-yellow-100',
      iconBg: 'bg-yellow-500'
    },
    {
      id: 'taxes',
      title: 'Administrar',
      subtitle: 'Impuestos',
      description: 'Clic aquí para administrar impuestos',
      icon: '%',
      color: 'bg-blue-100',
      iconBg: 'bg-blue-500'
    },
    {
      id: 'services',
      title: 'Administrar',
      subtitle: 'Servicios',
      description: 'Clic aquí para administrar servicios',
      icon: '🔧',
      color: 'bg-red-100',
      iconBg: 'bg-red-500'
    }
  ];

  const products = [
    {
      id: 1,
      image: '/api/placeholder/40/40',
      name: 'ACEITE 20W50 TAP ROJA',
      brand: 'MOBIL',
      code: '',
      category: 'Motocicletas',
      barCode: '0',
      description: '',
      cost: 23000.00,
      quantity: 4.00,
      utility: 0.00,
      price: 23000.00,
      status: 'PREVENTIVO Sección D',
      visible: true,
      application: true,
      pos: true
    },
    {
      id: 2,
      image: '/api/placeholder/40/40',
      name: 'aceite motul 5100',
      brand: 'Motul',
      code: '001001001',
      category: 'lubricante',
      barCode: '',
      description: '',
      cost: 8.00,
      quantity: 11.00,
      utility: 32.75,
      price: 12.00,
      status: 'Agregar ubicación',
      visible: false,
      application: true,
      pos: true
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Agregar Producto</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Producto
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre del producto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Marca del producto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Código del producto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Seleccionar categoría</option>
                <option value="Motocicletas">Motocicletas</option>
                <option value="lubricante">Lubricante</option>
                <option value="Filtros">Filtros</option>
                <option value="Frenos">Frenos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Barras
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Código de barras"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utilidad (%)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción del producto"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Proveedor</span>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione</option>
                <option value="mobil">MOBIL</option>
                <option value="motul">Motul</option>
                <option value="castrol">Castrol</option>
              </select>
            </div>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </button>
            
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar producto</span>
            </button>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Acceso rápido</h3>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessItems.map((item) => (
            <div
              key={item.id}
              className={`${item.color} rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-10 h-10 ${item.iconBg} rounded-lg flex items-center justify-center text-white text-lg`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{item.title}</p>
                  <h4 className="font-semibold text-gray-900">{item.subtitle}</h4>
                </div>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <span>📋</span>
            <span>Lista de prod</span>
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <span>📁</span>
            <span>Prod. Categoría</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">👁️ Visible en</span>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-lg">ℹ️</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <MoreVertical className="w-4 h-4" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aplicación
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  POS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-xs">🔧</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded mt-1 inline-block">
                        {product.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <div>Marca: {product.brand}</div>
                        <div>Código: {product.code}</div>
                        <div>Categoría: {product.category}</div>
                        <div>Cód. Barras: {product.barCode}</div>
                        <div>Descripción: {product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.cost.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.quantity.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.utility.toFixed(2)} %
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className={`w-12 h-6 rounded-full ${product.application ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer transition-colors`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${product.application ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className={`w-12 h-6 rounded-full ${product.pos ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer transition-colors`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${product.pos ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <ProductModal />}
    </div>
  );
};

export default CreateProduct;