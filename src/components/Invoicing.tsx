import React, { useState } from 'react';
import { Plus, Search, Eye, ShoppingCart, Package, Wrench, Settings, User, Calculator, FileText, Printer, MoreVertical } from 'lucide-react';

const Invoicing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [showClientModal, setShowClientModal] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState('vendedor');
  const [activeProformaTab, setActiveProformaTab] = useState('proforma');

  const categories = [
    { id: 'TODOS', name: 'TODOS', icon: '📋' },
    { id: 'Combos', name: 'Combos', icon: '🎁' },
    { id: 'FILTROS', name: 'FILTROS', icon: '🔧' },
    { id: 'Lavados de carros', name: 'Lavados de carros', icon: '🚿' },
    { id: 'Lubricante', name: 'Lubricante', icon: '🛢️' }
  ];

  const proformas = [
    {
      id: '#1017',
      client: '',
      total: 0.00,
      date: '18/07/2025',
      dueDate: '18/10/2025',
      status: 'pendiente'
    },
    {
      id: '#1016',
      client: 'vecina dinamic',
      total: 0.00,
      date: '18/07/2025',
      dueDate: '18/10/2025',
      status: 'pendiente'
    },
    {
      id: '#1015',
      client: '',
      total: 0.00,
      date: '18/07/2025',
      dueDate: '18/10/2025',
      status: 'pendiente'
    },
    {
      id: '#1014',
      client: '',
      total: 28250.00,
      date: '18/07/2025',
      dueDate: '18/10/2025',
      status: 'pendiente'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'ACEITE 20W50 TAP ROJA',
      category: 'Lubricante',
      stock: 3.00,
      unit: 'CJ',
      price: 'NaN.00',
      image: '/api/placeholder/120/120',
      status: 'PREVENTIVO / Sección D',
      location: 'Tamaño: 950'
    },
    {
      id: 2,
      name: 'aceite valvoline 20w50 4T',
      category: 'Lubricante',
      stock: -3.00,
      unit: 'Lt',
      price: 'NaN.00',
      image: '/api/placeholder/120/120',
      status: '+ Agregar Ubicación'
    },
    {
      id: 3,
      name: 'alarma',
      category: 'Eléctrico',
      stock: 49.00,
      unit: 'Unid',
      price: 'NaN.00',
      image: '/api/placeholder/120/120',
      status: '+ Agregar Ubicación'
    },
    {
      id: 4,
      name: 'Balata Delantera',
      category: 'Frenos',
      stock: -8.00,
      unit: 'Unid',
      price: 'NaN.00',
      image: '/api/placeholder/120/120',
      status: 'PREVENTIVO / Sección D'
    },
    {
      id: 5,
      name: 'Balata trasera',
      category: 'Frenos',
      stock: -8.00,
      unit: 'Unid',
      price: 'NaN.00',
      image: '/api/placeholder/120/120',
      status: 'PREVENTIVO / Sección D'
    },
    {
      id: 6,
      name: 'Barra HJ',
      category: 'Suspensión',
      stock: 0.00,
      unit: 'Unid',
      price: 'NaN.00',
      image: '/api/placeholder/120/120',
      status: '+ Agregar Ubicación'
    },
    {
      id: 7,
      name: 'Bujía CR8E',
      category: 'Motor',
      stock: -3.00,
      unit: 'Unid',
      price: 'NaN.00',
      image: '/api/placeholder/120/120',
      status: '+ Agregar Ubicación'
    },
    {
      id: 8,
      name: 'COLECTOR',
      category: 'Motor',
      stock: 0.00,
      unit: 'Unid',
      price: 'NaN.00',
      image: '/api/placeholder/120/120'
    },
    {
      id: 9,
      name: 'CONDENSADOR CND-98 SUNY TACOMA MAZDA',
      category: 'Aire Acondicionado',
      stock: -2.00,
      unit: 'Unid',
      price: 'NaN.00',
      image: '/api/placeholder/120/120'
    },
    {
      id: 10,
      name: 'CONDENSADOR CND-98 SUNY TACOMA MAZDA',
      category: 'Aire Acondicionado',
      stock: 0.00,
      unit: 'Unid',
      price: 'NaN.00',
      image: '/api/placeholder/120/120'
    },
    {
      id: 11,
      name: 'CONO PLEGABLE DE SEGURIDAD',
      category: 'Seguridad',
      stock: 0.00,
      unit: 'Unid',
      price: 'NaN.00',
      image: '/api/placeholder/120/120'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'TODOS' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockColor = (stock: number) => {
    if (stock < 0) return 'text-red-600';
    if (stock === 0) return 'text-yellow-600';
    return 'text-green-600';
  };

  const addToInvoice = (product: any) => {
    const existingItem = selectedItems.find(item => item.id === product.id);
    if (existingItem) {
      setSelectedItems(prev => prev.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeFromInvoice = (productId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromInvoice(productId);
    } else {
      setSelectedItems(prev => prev.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const renderProformaView = () => (
    <div className="flex-1 bg-gray-100">
      {/* Proforma Summary Cards */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-500 text-white rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold mb-2">PROFORMA</h3>
            <div className="text-4xl font-bold">924</div>
          </div>
          <div className="bg-green-500 text-white rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold mb-2">PROFORMA de Consignación</h3>
            <div className="text-4xl font-bold">1</div>
          </div>
          <div className="bg-red-500 text-white rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold mb-2">PROFORMA de Taller</h3>
            <div className="text-4xl font-bold">3</div>
          </div>
        </div>

        {/* Proforma Type Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveProformaTab('proforma')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeProformaTab === 'proforma'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📄 PROFORMA
          </button>
          <button
            onClick={() => setActiveProformaTab('consignacion')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeProformaTab === 'consignacion'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📋 PROFORMA de Consignación
          </button>
          <button
            onClick={() => setActiveProformaTab('taller')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeProformaTab === 'taller'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🔧 PROFORMA de Taller
          </button>
        </div>

        {/* Proforma List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {proformas.map((proforma, index) => (
              <div key={proforma.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center p-4">
                  {/* Document Icon */}
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-gray-500" />
                  </div>

                  {/* Proforma Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">PROFORMA {proforma.id}</h3>
                        {proforma.client && (
                          <p className="text-gray-600 text-sm">Cliente: {proforma.client}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-lg">
                          Total: ${proforma.total.toFixed(2)}
                        </div>
                        <div className="text-sm text-green-600">
                          Fecha: {proforma.date}
                        </div>
                        <div className="text-sm text-red-600">
                          Fecha de Vencimiento: {proforma.dueDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-4">
                    <button className="w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVendorView = () => (
    <>
      {/* Left Panel - Categories and Products */}
      <div className="w-2/3 flex">
        {/* Categories Sidebar */}
        <div className="w-48 bg-gray-800 text-white">
          <div className="p-4 bg-teal-600">
            <h3 className="font-bold text-center">CATEGORÍAS</h3>
          </div>
          <div className="p-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 bg-white">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
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
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <div className="w-4 h-4 bg-white rounded grid grid-cols-2 gap-0.5">
                  <div className="bg-blue-600 rounded-sm"></div>
                  <div className="bg-blue-600 rounded-sm"></div>
                  <div className="bg-blue-600 rounded-sm"></div>
                  <div className="bg-blue-600 rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {/* Create Product Card */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-48 hover:border-blue-400 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Plus className="w-6 h-6 text-gray-500" />
                </div>
                <span className="text-sm text-gray-600 text-center">Crear Producto</span>
              </div>

              {/* Product Cards */}
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToInvoice(product)}
                  className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-all cursor-pointer bg-white relative group"
                >
                  {/* Stock Badge */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span className={`font-bold ${getStockColor(product.stock)}`}>
                      {product.stock.toFixed(2)} {product.unit}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg mb-3 flex items-center justify-center">
                    <Package className="w-8 h-8 text-white" />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
                      {product.name}
                    </h4>
                    
                    {product.location && (
                      <div className="text-xs text-white bg-teal-600 px-2 py-1 rounded">
                        {product.location}
                      </div>
                    )}
                    
                    {product.status && (
                      <div className={`text-xs px-2 py-1 rounded ${
                        product.status.includes('PREVENTIVO') 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {product.status}
                      </div>
                    )}

                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </div>
                    </div>
                  </div>

                  {/* Add Button */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const ClientModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Agregar Cliente</h3>
          <button
            onClick={() => setShowClientModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Cliente
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+52 555 123 4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="cliente@email.com"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowClientModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Top Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">☰</span>
              </div>
              <h1 className="text-xl font-bold">Legacy Automotriz</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-blue-700 rounded">
              <Search className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-sm">Demo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setActiveMainTab('vendedor')}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeMainTab === 'vendedor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 border border-gray-300'
            }`}
          >
            📊 Vendedor
          </button>
          <button 
            onClick={() => setActiveMainTab('facturacion')}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeMainTab === 'facturacion'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 border border-gray-300'
            }`}
          >
            📄 Facturación
          </button>
          <button 
            onClick={() => setActiveMainTab('taller')}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeMainTab === 'taller'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 border border-gray-300'
            }`}
          >
            🔧 Taller
          </button>
          <button 
            onClick={() => setActiveMainTab('proforma')}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeMainTab === 'proforma'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 border border-gray-300'
            }`}
          >
            📋 PROFORMA
          </button>
          <button 
            onClick={() => setActiveMainTab('importar')}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeMainTab === 'importar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 border border-gray-300'
            }`}
          >
            📥 Importar factura
          </button>
          <button 
            onClick={() => setActiveMainTab('externos')}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeMainTab === 'externos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 border border-gray-300'
            }`}
          >
            📦 Productos extern
          </button>
        </div>
      </div>

      {/* Conditional Action Bar - Only show for vendedor */}
      {activeMainTab === 'vendedor' && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Productos</span>
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                <Wrench className="w-4 h-4" />
                <span>Servicios</span>
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>End. Pintura</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Precio:</span>
              <div className="flex space-x-1">
                <button className="px-2 py-1 bg-green-600 text-white rounded text-xs">MXN</button>
                <button className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs">≡</button>
                <button className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs">🖨️</button>
                <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Caja</button>
                <button className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs">⋯</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Render different views based on active tab */}
        {activeMainTab === 'vendedor' && renderVendorView()}
        {activeMainTab === 'taller' && renderWorkshopView()}
        {activeMainTab === 'proforma' && renderProformaView()}
        {(activeMainTab === 'facturacion' || activeMainTab === 'importar' || activeMainTab === 'externos') && (
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeMainTab === 'facturacion' && 'Facturación'}
                {activeMainTab === 'importar' && 'Importar Factura'}
                {activeMainTab === 'externos' && 'Productos Externos'}
              </h3>
              <p className="text-gray-600">Esta funcionalidad estará disponible próximamente</p>
            </div>
          </div>
        )}

        {/* Right Panel - Client and Invoice */}
        {(activeMainTab === 'vendedor' || activeMainTab === 'taller') && (
          <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col">
            {/* Client Section */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Agregar Cliente</span>
                </h3>
                <button
                  onClick={() => setShowClientModal(true)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar Cliente"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="w-full mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                🔍 Buscar
              </button>
            </div>

            {/* Invoice Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 pb-2 border-b">
                  <span>IVA</span>
                  <span>Cant.</span>
                  <span>Prec. Unidad</span>
                  <span>Descuento</span>
                  <span>Total</span>
                </div>
                
                {selectedItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => removeFromInvoice(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      <div className="flex items-center">
                        <input type="checkbox" className="w-3 h-3" />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-1 py-1 text-xs"
                          min="1"
                        />
                      </div>
                      <div className="text-gray-600">$0.00</div>
                      <div className="text-gray-600">0%</div>
                      <div className="font-bold text-gray-900">$0.00</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Total */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-gray-900">TOTAL:</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">$0.00</div>
                  <div className="text-sm text-gray-600">$0.00</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-bold flex items-center justify-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>✓ FACTURAR (F10)</span>
                </button>
                <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <MoreVertical className="w-4 h-4" />
                </button>
                <button className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showClientModal && <ClientModal />}
    </div>
  );
};

export default Invoicing;