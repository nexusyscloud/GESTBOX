import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Phone, Mail, MapPin, Building, User, Globe, CreditCard, Package } from 'lucide-react';

const Suppliers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const suppliers = [
    {
      id: 1,
      name: 'Autopartes González S.A.',
      contactPerson: 'Roberto González',
      email: 'ventas@autopartesgonzalez.com',
      phone: '+52 555 123 4567',
      address: 'Av. Industrial 123, Col. Zona Industrial, CDMX',
      website: 'www.autopartesgonzalez.com',
      taxId: 'AGO123456789',
      category: 'Refacciones',
      paymentTerms: '30 días',
      creditLimit: 50000,
      currentBalance: 12500,
      status: 'activo',
      rating: 4.8,
      productsSupplied: ['Filtros', 'Aceites', 'Baterías'],
      lastOrder: '2024-01-10',
      totalOrders: 45
    },
    {
      id: 2,
      name: 'Lubricantes del Norte',
      contactPerson: 'María Fernández',
      email: 'contacto@lubricantesnorte.com',
      phone: '+52 555 234 5678',
      address: 'Calle Revolución 456, Col. Centro, Monterrey, NL',
      website: 'www.lubricantesnorte.com',
      taxId: 'LDN987654321',
      category: 'Lubricantes',
      paymentTerms: '15 días',
      creditLimit: 75000,
      currentBalance: 8900,
      status: 'activo',
      rating: 4.6,
      productsSupplied: ['Aceites Motor', 'Grasas', 'Aditivos'],
      lastOrder: '2024-01-08',
      totalOrders: 32
    },
    {
      id: 3,
      name: 'Frenos Profesionales',
      contactPerson: 'Carlos Méndez',
      email: 'ventas@frenospro.com',
      phone: '+52 555 345 6789',
      address: 'Blvd. Tecnológico 789, Col. Industrial, Guadalajara, JAL',
      website: 'www.frenosprofesionales.com',
      taxId: 'FRP456789123',
      category: 'Sistema de Frenos',
      paymentTerms: '45 días',
      creditLimit: 100000,
      currentBalance: 25600,
      status: 'activo',
      rating: 4.9,
      productsSupplied: ['Pastillas', 'Discos', 'Líquido de Frenos'],
      lastOrder: '2024-01-12',
      totalOrders: 67
    },
    {
      id: 4,
      name: 'Herramientas Industriales',
      contactPerson: 'Ana López',
      email: 'info@herramientasindustriales.com',
      phone: '+52 555 456 7890',
      address: 'Av. Tláhuac 321, Col. San Lorenzo, CDMX',
      website: 'www.herramientasindustriales.com',
      taxId: 'HIN789123456',
      category: 'Herramientas',
      paymentTerms: '60 días',
      creditLimit: 30000,
      currentBalance: 0,
      status: 'inactivo',
      rating: 4.2,
      productsSupplied: ['Llaves', 'Equipos', 'Consumibles'],
      lastOrder: '2023-11-15',
      totalOrders: 18
    },
    {
      id: 5,
      name: 'Llantas Express',
      contactPerson: 'Miguel Torres',
      email: 'ventas@llantasexpress.com',
      phone: '+52 555 567 8901',
      address: 'Carretera Nacional Km 15, Puebla, PUE',
      website: 'www.llantasexpress.com',
      taxId: 'LEX321654987',
      category: 'Llantas y Rines',
      paymentTerms: '30 días',
      creditLimit: 80000,
      currentBalance: 15200,
      status: 'activo',
      rating: 4.7,
      productsSupplied: ['Llantas', 'Rines', 'Válvulas'],
      lastOrder: '2024-01-14',
      totalOrders: 28
    }
  ];

  const categories = [
    'Refacciones',
    'Lubricantes',
    'Sistema de Frenos',
    'Herramientas',
    'Llantas y Rines',
    'Sistema Eléctrico',
    'Carrocería',
    'Consumibles'
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      case 'suspendido': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800'
    ];
    const index = categories.indexOf(category);
    return colors[index] || 'bg-gray-100 text-gray-800';
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const SupplierModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {selectedSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h3>
          <button
            onClick={() => {
              setShowModal(false);
              setSelectedSupplier(null);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form className="space-y-6">
          {/* Información Básica */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedSupplier?.name || ''}
                  placeholder="Nombre del proveedor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Persona de Contacto *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedSupplier?.contactPerson || ''}
                  placeholder="Nombre del contacto principal"
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedSupplier?.email || ''}
                  placeholder="email@proveedor.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedSupplier?.phone || ''}
                  placeholder="+52 555 123 4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio Web
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedSupplier?.website || ''}
                  placeholder="www.proveedor.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RFC / ID Fiscal
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedSupplier?.taxId || ''}
                  placeholder="RFC123456789"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue={selectedSupplier?.address || ''}
                placeholder="Dirección completa del proveedor"
              />
            </div>
          </div>

          {/* Información Comercial */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Información Comercial</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Términos de Pago
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="contado">Contado</option>
                  <option value="15 días">15 días</option>
                  <option value="30 días">30 días</option>
                  <option value="45 días">45 días</option>
                  <option value="60 días">60 días</option>
                  <option value="90 días">90 días</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Límite de Crédito
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedSupplier?.creditLimit || ''}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Productos Suministrados */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Productos Suministrados</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map(category => (
                <label key={category} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    defaultChecked={selectedSupplier?.productsSupplied?.includes(category)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedSupplier(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {selectedSupplier ? 'Actualizar' : 'Crear'} Proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Proveedor</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Proveedores</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{suppliers.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Proveedores Activos</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {suppliers.filter(supplier => supplier.status === 'activo').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Pendiente</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ${suppliers.reduce((sum, supplier) => sum + supplier.currentBalance, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {(suppliers.reduce((sum, supplier) => sum + supplier.rating, 0) / suppliers.length).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar proveedores por nombre, contacto, email o categoría..."
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

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {supplier.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{supplier.name}</h3>
                    <p className="text-gray-600">{supplier.contactPerson}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(supplier.category)}`}>
                        {supplier.category}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(supplier.status)}`}>
                        {supplier.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    {getRatingStars(supplier.rating)}
                    <span className="text-sm font-medium ml-1">({supplier.rating})</span>
                  </div>
                  <p className="text-sm text-gray-600">{supplier.totalOrders} órdenes</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{supplier.address}</span>
                </div>
                {supplier.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>{supplier.website}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Productos Suministrados</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.productsSupplied.map((product, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Términos de Pago:</span>
                  <p className="font-medium">{supplier.paymentTerms}</p>
                </div>
                <div>
                  <span className="text-gray-600">Límite de Crédito:</span>
                  <p className="font-medium text-blue-600">${supplier.creditLimit.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Saldo Actual:</span>
                  <p className={`font-medium ${supplier.currentBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${supplier.currentBalance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Última Orden:</span>
                  <p className="font-medium">{supplier.lastOrder}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  RFC: {supplier.taxId}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 p-1">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSupplier(supplier);
                      setShowModal(true);
                    }}
                    className="text-gray-600 hover:text-gray-700 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Anterior
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredSuppliers.length}</span> de{' '}
              <span className="font-medium">{suppliers.length}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Anterior
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>

      {showModal && <SupplierModal />}
    </div>
  );
};

export default Suppliers;