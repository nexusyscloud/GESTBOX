import React, { useState } from 'react';
import { Search, Eye, FileText, Phone, Mail, MapPin, DollarSign, CreditCard, User, AlertCircle } from 'lucide-react';

const PaymentAccounts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Pendientes');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const clients = [
    {
      id: 1,
      name: 'Alex Fuentes',
      phone: '+504 3333-3333',
      email: 'lafortuna@gmail.com',
      location: 'San Jerónimo Copán',
      avatar: '👤',
      total: 760032.32,
      balance: 400000.00,
      status: 'pendiente'
    },
    {
      id: 2,
      name: 'Cristhian Rojas Echeverria',
      document: '131200925-9',
      phone: '0997169413',
      location: 'Portoviejo',
      avatar: '👤',
      total: 50000.00,
      balance: 49500.00,
      status: 'pendiente'
    },
    {
      id: 3,
      name: 'Eduardo',
      document: '120',
      phone: '9841290630',
      email: 'laloz134@hotmail',
      avatar: '👤',
      total: 128.40,
      balance: 0.40,
      status: 'pendiente'
    },
    {
      id: 4,
      name: 'EUGENIA ALVAREZ STEFANELL',
      avatar: '👤',
      total: 64500.00,
      balance: 64500.00,
      status: 'pendiente'
    },
    {
      id: 5,
      name: 'Francisco Burgos',
      phone: '+58 424-5678901',
      email: 'fburgos@email.com',
      location: 'Urbanización Los Pinos',
      avatar: '👤',
      total: 25000.00,
      balance: 15000.00,
      status: 'pendiente'
    }
  ];

  const totalPendingBalance = clients.reduce((sum, client) => sum + client.balance, 0);
  const totalAmount = clients.reduce((sum, client) => sum + client.total, 0);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone?.includes(searchTerm) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'Pendientes' ? client.balance > 0 : client.balance === 0;
    
    return matchesSearch && matchesTab;
  });

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Registrar Abono</h3>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <input
              type="text"
              value={selectedClient?.name || ''}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saldo Pendiente
            </label>
            <input
              type="text"
              value={`$${selectedClient?.balance?.toFixed(2) || '0.00'}`}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-red-600 font-bold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto del Abono
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
              Método de Pago
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Seleccionar método</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="cheque">Cheque</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notas adicionales..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar Abono
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cuentas por Cobrar</h1>
          <p className="text-gray-600 mt-1">Panel de abonos de crédito</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            ⚠️ Ayuda
          </div>
        </div>
      </div>

      {/* Search and Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 relative mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>
        </div>

        {/* Total Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Total saldo pendiente</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                ${totalPendingBalance.toLocaleString()}
              </div>
              <div className="text-lg font-semibold text-red-500">
                C${totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex">
            {['Pendientes', 'Canceladas'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Client List */}
        <div className="divide-y divide-gray-100">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <button 
                      className="w-10 h-8 bg-cyan-500 text-white rounded flex items-center justify-center hover:bg-cyan-600 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedClient(client);
                        setShowPaymentModal(true);
                      }}
                      className="w-10 h-8 bg-cyan-600 text-white rounded flex items-center justify-center hover:bg-cyan-700 transition-colors"
                      title="Registrar abono"
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                    {client.avatar}
                  </div>

                  {/* Client Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{client.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      {client.document && (
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          <span>{client.document}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{client.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amounts */}
                <div className="text-right">
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Total </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${client.total.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Saldo </span>
                    <span className="text-lg font-bold text-red-600">
                      ${client.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default PaymentAccounts;