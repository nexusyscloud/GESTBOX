import React, { useState } from 'react';
import { Search, Calendar, Eye, FileText, User, DollarSign, Clock } from 'lucide-react';

const CollectionList: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState('Todos');
  const [selectedVendor, setSelectedVendor] = useState('Todos');
  const [selectedDate, setSelectedDate] = useState('27/07/2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('Domingo');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const clients = ['Todos', 'Eduardo', 'Jonathan Sarmiento', 'María García', 'Carlos López'];
  const vendors = ['Todos', 'Demo', 'Vendedor 1', 'Vendedor 2'];
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const statuses = ['Todos', 'Pendientes', 'Abonados'];
  const currencies = ['USD', 'EUR', 'COP'];

  const collections = [
    {
      id: 415,
      type: 'Semanal',
      client: 'Eduardo',
      vendor: 'Demo',
      date: '2022-04-15',
      time: '12:25:10',
      total: 128.40,
      balance: 0.40,
      amountToPay: 0.00,
      status: 'pendiente'
    },
    {
      id: 649,
      type: 'Semanal',
      client: 'Jonathan Sarmiento',
      vendor: 'Demo',
      date: '2023-06-14',
      time: '22:03:33',
      total: 2023.00,
      balance: 2023.00,
      amountToPay: 0.00,
      status: 'pendiente'
    },
    {
      id: 320,
      type: 'Mensual',
      client: 'María García',
      vendor: 'Demo',
      date: '2023-08-20',
      time: '14:15:22',
      total: 850.00,
      balance: 425.00,
      amountToPay: 0.00,
      status: 'abonado'
    },
    {
      id: 158,
      type: 'Quincenal',
      client: 'Carlos López',
      vendor: 'Demo',
      date: '2023-09-10',
      time: '09:30:45',
      total: 1200.00,
      balance: 600.00,
      amountToPay: 0.00,
      status: 'pendiente'
    }
  ];

  const filteredCollections = collections.filter(collection => {
    const matchesClient = selectedClient === 'Todos' || collection.client === selectedClient;
    const matchesVendor = selectedVendor === 'Todos' || collection.vendor === selectedVendor;
    const matchesSearch = collection.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.id.toString().includes(searchTerm);
    const matchesStatus = selectedStatus === 'Todos' || 
                         (selectedStatus === 'Pendientes' && collection.status === 'pendiente') ||
                         (selectedStatus === 'Abonados' && collection.status === 'abonado');
    
    return matchesClient && matchesVendor && matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de cobro</h1>
          <p className="text-gray-500 text-sm mt-1">Panel Lista de cobro</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Cliente Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {clients.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>

          {/* Vendedor Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendedor
            </label>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {vendors.map(vendor => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </select>
          </div>

          {/* Fecha Filter */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Fecha
              <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center ml-1 text-xs">
                ?
              </div>
            </label>
            <div className="relative">
              <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Búsqueda
            </label>
            <div className="flex space-x-2">
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
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Days of Week Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDay === day
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Status and Currency Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Moneda:</span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-teal-600 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Collections List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="divide-y divide-gray-100">
          {filteredCollections.map((collection) => (
            <div key={collection.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  <button className="w-10 h-8 bg-cyan-500 text-white rounded flex items-center justify-center hover:bg-cyan-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-8 bg-cyan-600 text-white rounded flex items-center justify-center hover:bg-cyan-700 transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                {/* Image Placeholder */}
                <div className="w-20 h-16 bg-gray-100 border-2 border-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Imagen</span>
                </div>

                {/* Collection Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      No. {collection.id} {collection.type}
                    </h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {collection.date} {collection.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Cliente:</span>
                      <span className="ml-1 font-medium text-blue-600">{collection.client}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Vendedor:</span>
                      <span className="ml-1 font-medium text-orange-600">{collection.vendor}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Monto Cobro:</span>
                      <span className="ml-1 font-bold">${collection.amountToPay.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Amounts */}
                <div className="text-right">
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Total </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${collection.total.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Saldo </span>
                    <span className="text-lg font-bold text-red-600">
                      ${collection.balance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredCollections.length} de {collections.length} registros de cobro
      </div>
    </div>
  );
};

export default CollectionList;