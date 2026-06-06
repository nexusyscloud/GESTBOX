import React from 'react';

import {
  User,
  Bell,
  Search,
} from 'lucide-react';

import {
  useLocation,
} from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === '/') {
      return 'Dashboard';
    }

    if (path.startsWith('/customers')) {
      return 'Clientes';
    }

    if (path.startsWith('/vehicles')) {
      return 'Vehículos';
    }

    if (
      path.startsWith(
        '/operations/reception'
      )
    ) {
      return 'Recepción Vehicular';
    }

    if (
      path.startsWith(
        '/operations/workorders'
      )
    ) {
      return 'Órdenes de Trabajo';
    }

    if (path.startsWith('/settings')) {
      return 'Configuración';
    }

    return 'GESTBOX';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        
        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {getPageTitle()}
          </h1>

          <p className="text-sm text-gray-500 mt-1 capitalize">
            {new Date().toLocaleDateString(
              'es-EC',
              {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )}
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          
          {/* Search */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />

            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User */}
          <div className="flex items-center space-x-3 bg-gray-100 rounded-xl px-3 py-2">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>

            <div className="text-sm leading-tight">
              <p className="font-medium text-gray-900">
                Usuario
              </p>

              <p className="text-gray-500">
                Sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;