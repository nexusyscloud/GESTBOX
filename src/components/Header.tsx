import React from 'react';
import { Bell, Search, User } from 'lucide-react';

interface HeaderProps {
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      workshop: 'Taller - Control de Taller',
      'vehicle-reception': 'Taller - Recepción Vehicular',
      'workflow': 'Taller - Flujo de Trabajo',
      'schedule-configuration': 'Taller - Configuración de Horarios',
      vehicles: 'Gestión de Vehículos',
      clients: 'Gestión de Clientes',
      sales: 'Gestión de Ventas',
      'sales-history': 'Ventas - Histórico de Ventas',
      'payment-accounts': 'Ventas - Abono Cuentas por Cobrar',
      'collection-list': 'Ventas - Lista de Cobros',
      'cash-movement-history': 'Ventas - Historial Mov. de Caja',
      'returns': 'Ventas - Devoluciones',
      'credit-note': 'Ventas - Nota de crédito',
      'work-orders': 'Taller - Órdenes de Trabajo',
      'proforma': 'Taller - Proforma',
      inventory: 'Inventario - Control de Inventario',
      'create-product': 'Inventario - Crear Producto',
      'manage-products': 'Inventario - Administrar Productos',
      'transfer-branches': 'Inventario - Traslado entre sucursales',
      'edit-prices': 'Inventario - Editar Precios',
      'physical-inventory': 'Inventario - Toma Física',
      'product-profile': 'Inventario - Perfil de producto',
      'create-categories': 'Inventario - Crear Categorías',
      'create-combos': 'Inventario - Crear Combos',
      'price-list': 'Inventario - Lista de Precios',
      'manage-taxes': 'Inventario - Administrar Impuestos',
      'assign-vendor-products': 'Inventario - Asignar Productos Vendedor',
      'external-products': 'Inventario - Productos Externos',
      'external-products-list': 'Inventario - Listado Productos Externos',
      'damaged-products': 'Inventario - Productos dañados',
      'measurement-units': 'Inventario - Admin. unidades medición',
      invoicing: 'Facturación',
      accounting: 'Contabilidad',
      'journal-entry': 'Contabilidad - Asiento de diario',
      'credit-line': 'Contabilidad - Línea de crédito',
      'accounting-banks': 'Contabilidad - Bancos',
      'bank-accounts': 'Contabilidad - Cuentas Bancarias',
      'movement-type': 'Contabilidad - Tipo de Movimiento',
      'requests': 'Contabilidad - Solicitudes',
      'deposits-transfers': 'Contabilidad - Depósitos y Transferencias',
      'fixed-assets': 'Contabilidad - Activo Fijo',
      'asset-types': 'Contabilidad - Tipo de Activos',
      'assets': 'Contabilidad - Activos',
      'additional-settings': 'Contabilidad - Configuraciones adicionales',
      'cost-center': 'Contabilidad - Centro de costo',
      'diary-types': 'Contabilidad - Tipos de diarios',
      'general-ledger-accounts': 'Contabilidad - Cuentas de Mayor',
      'sub-accounts': 'Contabilidad - Sub Cuentas',
      'fiscal-period': 'Contabilidad - Período Fiscal',
      'fiscal-month': 'Contabilidad - Mes Fiscal',
      'journal-entry-config': 'Contabilidad - Configuración de Asientos',
      'reports-config': 'Contabilidad - Configuración de Reportes',
      'exchange-rate-type': 'Contabilidad - Tipo de Cambio',
      'initial-config': 'Contabilidad - Configuración Inicial',
      appointments: 'Gestión de Citas',
      'manual-scheduling': 'Citas - Agendamiento Manual',
      'web-scheduling': 'Citas - Agendamiento Web',
      subscriptions: 'Citas - Suscripciones',
      reports: 'Reportes y Estadísticas',
      users: 'Gestión de Usuarios',
      settings: 'Configuración del Sistema',
      'general-parameters': 'Parámetros Generales',
      'suppliers': 'Parámetros Generales - Proveedores',
      'employees': 'Parámetros Generales - Empleados'
    };
    return titles[currentView] || 'GESTBOX';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{getPageTitle()}</h1>
          <p className="text-sm text-gray-600 mt-0.5 leading-tight">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent w-64"
            />
          </div>

          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Admin</p>
              <p className="text-gray-600">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;