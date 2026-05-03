import React, { useState } from 'react';
import { Search, Plus, User, Mail, Phone, Star, RotateCcw, FileText, Info } from 'lucide-react';

const CreditNotes: React.FC = () => {
  const [searchClient, setSearchClient] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [selectedDate, setSelectedDate] = useState('28/07/2025');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Todas');

  const clients = [
    {
      id: 1,
      name: 'Alan Estrada',
      email: 'alan.estradav@gmail.com',
      phone: '311 324-9331',
      avatar: '👤'
    },
    {
      id: 2,
      name: 'Alberto Nevare',
      phone: '6258374883',
      avatar: '👤'
    },
    {
      id: 3,
      name: 'Alejandro bolzan',
      email: 'alebolzan12@gmail.com',
      phone: '3436422342',
      avatar: '👤'
    },
    {
      id: 4,
      name: 'alex',
      email: 'hamlsnap@hamis.com',
      avatar: '👤'
    },
    {
      id: 5,
      name: 'Alex Fuentes',
      email: 'lafortuna@gmail.com',
      avatar: '👤'
    },
    {
      id: 6,
      name: 'Ana Martinez',
      email: 'Martinez.ana@gmail.com',
      avatar: '👤'
    },
    {
      id: 7,
      name: 'ANGEL CHECA',
      email: 'angelcheca1974@gmail.com',
      avatar: '👤'
    },
    {
      id: 8,
      name: 'Angel Osorio',
      email: 'angelosorio160798@gmail.com',
      phone: '3156744796',
      avatar: '👤'
    },
    {
      id: 9,
      name: 'Anibal',
      email: 'anibalmc@gmail.com',
      avatar: '👤'
    }
  ];

  const invoices = [
    {
      id: 'No. 993',
      number: '993',
      date: '19/07/2025',
      company: 'Legacy Automotriz',
      status: 'Contado',
      total: 52000.00,
      client: 'Alan Estrada'
    },
    {
      id: 'No. 987',
      number: '987',
      date: '02/07/2025',
      company: 'Legacy Automotriz',
      status: 'Contado',
      total: 0.00,
      client: 'Alan Estrada'
    },
    {
      id: 'No. 972',
      number: '972',
      date: '07/05/2025',
      company: 'Legacy Automotriz',
      status: 'Contado',
      total: 0.00,
      client: 'Alan Estrada'
    },
    {
      id: 'No. 971',
      number: '971',
      date: '04/05/2025',
      company: 'Legacy Automotriz',
      status: 'Contado',
      total: 208083.00,
      client: 'Alan Estrada'
    }
  ];

  const tabs = ['Todas', 'Contado', 'Crédito', 'Pendientes'];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchClient.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchClient.toLowerCase())
  );

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.includes(searchInvoice) ||
                         invoice.company.toLowerCase().includes(searchInvoice.toLowerCase());
    
    const matchesTab = activeTab === 'Todas' || 
                      (activeTab === 'Contado' && invoice.status === 'Contado');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panel Izquierdo - Lista de Clientes */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notas de Crédito</h1>
              <p className="text-sm text-gray-600">Panel Notas de créditos</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                <span>⚙️</span>
                <span>Inicio</span>
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                Notas de Crédito
              </button>
            </div>
          </div>

          {/* Búsqueda de Cliente */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar Cliente..."
                value={searchClient}
                onChange={(e) => setSearchClient(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Buscar
            </button>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="flex-1 overflow-y-auto">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedClient?.id === client.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  {client.email && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      <span>{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Phone className="w-3 h-3 mr-1" />
                      <span>Tel: {client.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel Derecho - Facturas y Notas de Crédito */}
      <div className="w-2/3 bg-white flex flex-col">
        {selectedClient ? (
          <>
            {/* Header del Cliente Seleccionado */}
            <div className="p-4 border-b border-gray-200 bg-blue-600 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{selectedClient.name}</h2>
                  {selectedClient.email && (
                    <div className="flex items-center text-sm opacity-90">
                      <Mail className="w-3 h-3 mr-1" />
                      <span>Email: {selectedClient.email}</span>
                    </div>
                  )}
                  {selectedClient.phone && (
                    <div className="flex items-center text-sm opacity-90">
                      <Phone className="w-3 h-3 mr-1" />
                      <span>Tel: {selectedClient.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botón Nueva NC */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nueva NC</span>
              </button>
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
                        ? 'border-cyan-500 text-cyan-600 bg-cyan-50'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros de Búsqueda de Facturas */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar factura..."
                    value={searchInvoice}
                    onChange={(e) => setSearchInvoice(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="dd/mm/aaaa"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Buscar
                </button>
              </div>
            </div>

            {/* Lista de Facturas */}
            <div className="flex-1 overflow-y-auto">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{invoice.id} - {invoice.date}</h3>
                          <p className="text-sm text-gray-600">{invoice.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{invoice.status}</div>
                          <div className="font-bold text-gray-900">
                            Total ${invoice.total.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botones de Acción */}
                    <div className="flex flex-col space-y-1 ml-4">
                      <button className="w-10 h-8 bg-gray-400 text-white rounded flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <span className="text-xs">≡</span>
                      </button>
                      <button className="w-10 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Opciones de Nota de Crédito */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                      <Star className="w-3 h-3" />
                      <span>Aplicar Nota Crédito</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                      <Star className="w-3 h-3" />
                      <span>Aplicar Nota Débito</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm">
                      <RotateCcw className="w-3 h-3" />
                      <span>Aplicar devolución</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Selecciona un cliente</p>
              <p className="text-sm">para ver sus facturas y aplicar notas de crédito</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditNotes;