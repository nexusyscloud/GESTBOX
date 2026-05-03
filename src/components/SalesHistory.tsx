import React, { useState } from 'react';
import { Search, Calendar, Mail, RotateCcw, X, FileText, User, Phone, MapPin, DollarSign } from 'lucide-react';

const SalesHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Todos');
  const [dateFrom, setDateFrom] = useState('12/07/2025');
  const [dateTo, setDateTo] = useState('27/07/2025');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Todas');

  const invoices = [
    {
      id: '00025995',
      number: '#Factura No. 00025995',
      date: '21/07/2025',
      time: '20:36:33',
      client: 'Daniela castillo',
      email: 'dacr2605@gmail.com',
      whatsapp: '+58 412-9225227',
      company: 'Legacy Automotriz',
      address: 'dacr2605@gmail.com',
      amount: 60.00,
      status: 'Contado',
      type: 'Facturación Contado',
      items: [
        {
          quantity: 1.00,
          description: 'Mantenimiento General',
          unitPrice: 60.00,
          total: 60.00
        }
      ]
    },
    {
      id: '00025994',
      number: '#Factura No. 00025994',
      date: '19/07/2025',
      time: '15:22:10',
      client: 'Guillermo Flores',
      email: 'gflores@email.com',
      whatsapp: '+58 414-1234567',
      company: 'Legacy Automotriz',
      address: 'Av. Principal 123',
      amount: 65.50,
      status: 'Contado',
      type: 'Facturación Contado',
      items: [
        {
          quantity: 1.00,
          description: 'Cambio de Aceite',
          unitPrice: 65.50,
          total: 65.50
        }
      ]
    },
    {
      id: '00025993',
      number: '#Factura No. 00025993',
      date: '19/07/2025',
      time: '14:15:45',
      client: 'Alan Estrada',
      email: 'aestrada@email.com',
      whatsapp: '+58 426-7890123',
      company: 'Legacy Automotriz',
      address: 'Calle Secundaria 456',
      amount: 52000.00,
      status: 'Contado',
      type: 'Facturación Contado',
      items: [
        {
          quantity: 1.00,
          description: 'Reparación Motor',
          unitPrice: 52000.00,
          total: 52000.00
        }
      ]
    },
    {
      id: '00025992',
      number: '#Factura No. 00025992',
      date: '13/07/2025',
      time: '11:30:22',
      client: 'Cliente de contado',
      email: 'contado@legacy.com',
      whatsapp: '+58 412-0000000',
      company: 'Legacy Automotriz',
      address: 'N/A',
      amount: 750000.00,
      status: 'Contado',
      type: 'Facturación Contado',
      items: [
        {
          quantity: 1.00,
          description: 'Reparación Completa',
          unitPrice: 750000.00,
          total: 750000.00
        }
      ]
    },
    {
      id: '00025991',
      number: '#Factura No. 00025991',
      date: '12/07/2025',
      time: '09:45:18',
      client: 'Francisco Burgos',
      email: 'fburgos@email.com',
      whatsapp: '+58 424-5678901',
      company: 'Legacy Automotriz',
      address: 'Urbanización Los Pinos',
      amount: 642.00,
      status: 'Contado',
      type: 'Facturación Contado',
      items: [
        {
          quantity: 1.00,
          description: 'Mantenimiento Preventivo',
          unitPrice: 642.00,
          total: 642.00
        }
      ]
    }
  ];

  const tabs = ['Todas', 'Contado', 'Crédito', 'Pendientes', 'Anuladas'];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.includes(searchTerm) ||
                         invoice.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'Todas' || 
                      (activeTab === 'Contado' && invoice.status === 'Contado');
    
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Contado': return 'bg-green-100 text-green-800';
      case 'Crédito': return 'bg-blue-100 text-blue-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Anulada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panel Izquierdo - Lista de Facturas */}
      <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
        {/* Header con Filtros */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4 mb-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Botón Buscar */}
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
              🔍 Buscar
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Período */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Período:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Todos">Todos</option>
                <option value="Hoy">Hoy</option>
                <option value="Esta Semana">Esta Semana</option>
                <option value="Este Mes">Este Mes</option>
              </select>
            </div>

            {/* Fecha desde */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Fecha desde:</label>
              <div className="relative">
                <input
                  type="text"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              </div>
            </div>

            {/* Fecha hasta */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Fecha hasta:</label>
              <div className="relative">
                <input
                  type="text"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Facturas */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Facturas */}
        <div className="flex-1 overflow-y-auto">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              onClick={() => setSelectedInvoice(invoice)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedInvoice?.id === invoice.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    No. {invoice.id} - {invoice.status}
                  </div>
                  <div className="text-sm text-gray-600">{invoice.company}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{invoice.date}</div>
                  <div className="font-bold text-green-600">${invoice.amount.toFixed(2)}</div>
                </div>
              </div>
              <div className="text-sm text-gray-700">{invoice.client}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel Derecho - Detalles de Factura */}
      <div className="w-1/2 bg-white flex flex-col">
        {selectedInvoice ? (
          <>
            {/* Header del Detalle */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedInvoice.number}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">
                      Fecha: {selectedInvoice.date} {selectedInvoice.time}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                      {selectedInvoice.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    Total
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${selectedInvoice.amount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Cliente:</span>
                  <span className="ml-2">{selectedInvoice.client}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Correo:</span>
                  <span className="ml-2">{selectedInvoice.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Whatsapp:</span>
                  <span className="ml-2">{selectedInvoice.whatsapp}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Empresa:</span>
                  <span className="ml-2">{selectedInvoice.company}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="font-medium text-gray-700 mb-1">Dirección:</div>
                <div className="text-sm text-gray-600">{selectedInvoice.address}</div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  <span>Enviar email</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
                  <RotateCcw className="w-4 h-4" />
                  <span>Apt. Devolución</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                  <X className="w-4 h-4" />
                  <span>Anular Factura</span>
                </button>
              </div>
            </div>

            {/* Detalles de Items */}
            <div className="flex-1 p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                {selectedInvoice.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.quantity}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">Total: ${item.total.toFixed(2)}</div>
                      <div className="text-sm text-blue-600">Prec. Unitario: ${item.unitPrice.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Selecciona una factura</p>
              <p className="text-sm">para ver los detalles</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;