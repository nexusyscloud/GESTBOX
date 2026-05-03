import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EnhancedDashboard from './components/EnhancedDashboard';
import Workshop from './components/Workshop';
import Clients from './components/Clients';
import Vehicles from './components/Vehicles';
import WorkOrders from './components/WorkOrders';
import WorkOrdersList from './components/WorkOrdersList';
import Inventory from './components/Inventory';
import Invoicing from './components/Invoicing';
import Appointments from './components/Appointments';
import ManualScheduling from './components/ManualScheduling';
import Reports from './components/Reports';
import Employees from './components/Employees';
import CreateProduct from './components/CreateProduct';
import MeasurementUnits from './components/MeasurementUnits';
import SalesHistory from './components/SalesHistory';
import PaymentAccounts from './components/PaymentAccounts';
import CollectionList from './components/CollectionList';
import CreditNotes from './components/CreditNotes';
import Users from './components/Users';
import Settings from './components/Settings';
import WorkflowBoard from './components/WorkflowBoard';
import ScheduleConfiguration from './components/ScheduleConfiguration';
import VehicleReception from './components/VehicleReception';
import { BarChart3 } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('work-orders');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [useEnhancedDashboard, setUseEnhancedDashboard] = useState(false);

  React.useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      setCurrentView(event.detail);
    };

    window.addEventListener('navigate', handleNavigation as EventListener);
    return () => {
      window.removeEventListener('navigate', handleNavigation as EventListener);
    };
  }, []);

  const handleModuleClick = (moduleId: string) => {
    const moduleMap: { [key: string]: string } = {
      'services': 'work-orders',
      'bodywork': 'work-orders',
      'inventory': 'manage-products',
      'catalog': 'inventory'
    };

    const targetView = moduleMap[moduleId] || moduleId;
    setCurrentView(targetView);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return useEnhancedDashboard ? 
          <EnhancedDashboard onModuleClick={handleModuleClick} /> : 
          <Dashboard />;
      case 'workshop':
        return <Workshop />;
      case 'vehicle-reception':
        return <VehicleReception />;
      case 'workflow':
        return <WorkflowBoard />;
      case 'schedule-configuration':
        return <ScheduleConfiguration />;
      case 'clients':
        return <Clients />;
      case 'sales':
        return <div className="p-6"><h2 className="text-2xl font-bold">Gestión de Ventas</h2><p className="text-gray-600 mt-2">Control de ventas, productos y transacciones</p></div>;
      case 'sales-history':
        return <SalesHistory />;
      case 'payment-accounts':
        return <PaymentAccounts />;
      case 'collection-list':
        return <CollectionList />;
      case 'cash-movement-history':
        return <div className="p-6"><h2 className="text-2xl font-bold">Historial Mov. de Caja</h2><p className="text-gray-600 mt-2">Registro de movimientos de efectivo y transacciones</p></div>;
      case 'returns':
        return <div className="p-6"><h2 className="text-2xl font-bold">Devoluciones</h2><p className="text-gray-600 mt-2">Gestión de devoluciones de productos y servicios</p></div>;
      case 'credit-note':
        return <CreditNotes />;
      case 'vehicles':
        return <Vehicles />;
      case 'work-orders':
        return <WorkOrdersList />;
      case 'proforma':
        return <div className="p-6"><h2 className="text-2xl font-bold">Taller - Proforma</h2><p className="text-gray-600 mt-2">Gestión de proformas y cotizaciones</p></div>;
      case 'inventory':
        return <Inventory />;
      case 'create-product':
        return <CreateProduct />;
      case 'manage-products':
        return <Inventory />;
      case 'transfer-branches':
        return <div className="p-6"><h2 className="text-2xl font-bold">Traslado entre sucursales</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'edit-prices':
        return <div className="p-6"><h2 className="text-2xl font-bold">Editar Precios</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'physical-inventory':
        return <div className="p-6"><h2 className="text-2xl font-bold">Toma Física</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'product-profile':
        return <div className="p-6"><h2 className="text-2xl font-bold">Perfil de producto</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'create-categories':
        return <div className="p-6"><h2 className="text-2xl font-bold">Crear Categorías</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'create-combos':
        return <div className="p-6"><h2 className="text-2xl font-bold">Crear Combos</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'price-list':
        return <div className="p-6"><h2 className="text-2xl font-bold">Lista de Precios</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'manage-taxes':
        return <div className="p-6"><h2 className="text-2xl font-bold">Administrar Impuestos</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'assign-vendor-products':
        return <div className="p-6"><h2 className="text-2xl font-bold">Asignar Productos Vendedor</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'external-products':
        return <div className="p-6"><h2 className="text-2xl font-bold">Productos Externos</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'external-products-list':
        return <div className="p-6"><h2 className="text-2xl font-bold">Listado Productos Externos</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'damaged-products':
        return <div className="p-6"><h2 className="text-2xl font-bold">Productos dañados</h2><p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p></div>;
      case 'measurement-units':
        return <MeasurementUnits />;
      case 'invoicing':
        return <Invoicing />;
      case 'accounting':
        return <div className="p-6"><h2 className="text-2xl font-bold">Contabilidad</h2><p className="text-gray-600 mt-2">Gestión contable y financiera del taller</p></div>;
      case 'journal-entry':
        return <div className="p-6"><h2 className="text-2xl font-bold">Asiento de diario</h2><p className="text-gray-600 mt-2">Registro de asientos contables y movimientos del diario</p></div>;
      case 'credit-line':
        return <div className="p-6"><h2 className="text-2xl font-bold">Línea de crédito</h2><p className="text-gray-600 mt-2">Gestión de líneas de crédito y financiamiento</p></div>;
      case 'accounting-banks':
        return <div className="p-6"><h2 className="text-2xl font-bold">Contabilidad - Bancos</h2><p className="text-gray-600 mt-2">Gestión bancaria desde el módulo contable</p></div>;
      case 'bank-accounts':
        return <div className="p-6"><h2 className="text-2xl font-bold">Cuentas Bancarias</h2><p className="text-gray-600 mt-2">Gestión y configuración de cuentas bancarias</p></div>;
      case 'movement-type':
        return <div className="p-6"><h2 className="text-2xl font-bold">Tipo de Movimiento</h2><p className="text-gray-600 mt-2">Configuración de tipos de movimientos bancarios</p></div>;
      case 'requests':
        return <div className="p-6"><h2 className="text-2xl font-bold">Solicitudes</h2><p className="text-gray-600 mt-2">Gestión de solicitudes bancarias y financieras</p></div>;
      case 'deposits-transfers':
        return <div className="p-6"><h2 className="text-2xl font-bold">Depósitos y Transferencias</h2><p className="text-gray-600 mt-2">Control de depósitos y transferencias bancarias</p></div>;
      case 'fixed-assets':
        return <div className="p-6"><h2 className="text-2xl font-bold">Activo Fijo</h2><p className="text-gray-600 mt-2">Control y depreciación de activos fijos</p></div>;
      case 'asset-types':
        return <div className="p-6"><h2 className="text-2xl font-bold">Tipo de Activos</h2><p className="text-gray-600 mt-2">Configuración y clasificación de tipos de activos fijos</p></div>;
      case 'assets':
        return <div className="p-6"><h2 className="text-2xl font-bold">Activos</h2><p className="text-gray-600 mt-2">Gestión y control de activos fijos de la empresa</p></div>;
      case 'additional-settings':
        return <div className="p-6"><h2 className="text-2xl font-bold">Configuraciones adicionales</h2><p className="text-gray-600 mt-2">Configuraciones avanzadas del módulo contable</p></div>;
      case 'cost-center':
        return <div className="p-6"><h2 className="text-2xl font-bold">Centro de costo</h2><p className="text-gray-600 mt-2">Configuración y gestión de centros de costo</p></div>;
      case 'diary-types':
        return <div className="p-6"><h2 className="text-2xl font-bold">Tipos de diarios</h2><p className="text-gray-600 mt-2">Configuración de tipos de diarios contables</p></div>;
      case 'general-ledger-accounts':
        return <div className="p-6"><h2 className="text-2xl font-bold">Cuentas de Mayor</h2><p className="text-gray-600 mt-2">Gestión del plan de cuentas contables</p></div>;
      case 'sub-accounts':
        return <div className="p-6"><h2 className="text-2xl font-bold">Sub Cuentas</h2><p className="text-gray-600 mt-2">Configuración de subcuentas contables</p></div>;
      case 'fiscal-period':
        return <div className="p-6"><h2 className="text-2xl font-bold">Período Fiscal</h2><p className="text-gray-600 mt-2">Configuración de períodos fiscales</p></div>;
      case 'fiscal-month':
        return <div className="p-6"><h2 className="text-2xl font-bold">Mes Fiscal</h2><p className="text-gray-600 mt-2">Configuración de meses fiscales</p></div>;
      case 'journal-entry-config':
        return <div className="p-6"><h2 className="text-2xl font-bold">Configuración de Asientos</h2><p className="text-gray-600 mt-2">Configuración de asientos contables</p></div>;
      case 'reports-config':
        return <div className="p-6"><h2 className="text-2xl font-bold">Configuración de Reportes</h2><p className="text-gray-600 mt-2">Configuración de reportes contables</p></div>;
      case 'exchange-rate-type':
        return <div className="p-6"><h2 className="text-2xl font-bold">Tipo de Cambio</h2><p className="text-gray-600 mt-2">Configuración de tipos de cambio</p></div>;
      case 'initial-config':
        return <div className="p-6"><h2 className="text-2xl font-bold">Configuración Inicial</h2><p className="text-gray-600 mt-2">Configuración inicial del sistema contable</p></div>;
      case 'appointments':
        return <Appointments />;
      case 'manual-scheduling':
        return <ManualScheduling />;
      case 'web-scheduling':
        return <div className="p-6"><h2 className="text-2xl font-bold">Agendamiento Web</h2><p className="text-gray-600 mt-2">Sistema de agendamiento online para clientes</p></div>;
      case 'subscriptions':
        return <div className="p-6"><h2 className="text-2xl font-bold">Suscripciones</h2><p className="text-gray-600 mt-2">Gestión de suscripciones y planes de servicio</p></div>;
      case 'reports':
        return <Reports />;
      case 'employees':
        return <Employees />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      case 'general-parameters':
        return <GeneralParameters />;
      case 'suppliers':
        return <Suppliers />;
      default:
        return useEnhancedDashboard ? 
          <EnhancedDashboard onModuleClick={handleModuleClick} /> : 
          <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header currentView={currentView} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
        
        {/* Toggle para cambiar entre dashboards */}
        {currentView === 'dashboard' && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setUseEnhancedDashboard(!useEnhancedDashboard)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{useEnhancedDashboard ? 'Dashboard Básico' : 'Dashboard Pro'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;