import React from 'react';
import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  Package,
  FileText,
  Calendar as CalendarIcon,
  BarChart3,
  UserCheck,
  Settings,
  Wrench,
  ChevronDown,
  ChevronRight,
  Clock,
  Plus,
  ArrowRightLeft,
  DollarSign,
  FolderPlus,
  Package2,
  List,
  Calculator,
  UserPlus,
  ExternalLink,
  FileSpreadsheet,
  AlertTriangle,
  Ruler,
  User,
  Globe,
  CreditCard,
  History,
  Wallet,
  Receipt,
  TrendingDown,
  RotateCcw,
  FileX,
  BookOpen,
  Building,
  Home,
  Cog,
  AlertCircle
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, collapsed, setCollapsed }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<{[key: string]: boolean}>({
    operation: true,
    clients: false,
    inventory: false,
    billing: false,
    reports: false,
    config: false,
    deprecated: false
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCollapsed(true);
    setExpandedGroups({
      operation: false,
      clients: false,
      inventory: false,
      billing: false,
      reports: false,
      config: false,
      deprecated: false
    });
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const menuGroups = [
    {
      id: 'operation',
      label: 'Taller',
      icon: Wrench,
      items: [
        { id: 'vehicle-reception', label: 'Recepción Vehicular', icon: Car, primary: true },
        { id: 'work-orders', label: 'Órdenes de Trabajo', icon: ClipboardList, primary: true },
        { id: 'appointments', label: 'Citas', icon: Clock }
      ]
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: Users,
      items: [
        { id: 'clients', label: 'Gestion de Clientes', icon: Users },
        { id: 'vehicles', label: 'Vehiculos', icon: Car },
        { id: 'web-scheduling', label: 'Agendamiento Web', icon: Globe },
        { id: 'subscriptions', label: 'Suscripciones', icon: CreditCard }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventario',
      icon: Package,
      items: [
        { id: 'manage-products', label: 'Administrar Productos', icon: Package },
        { id: 'create-product', label: 'Crear Producto', icon: Plus },
        { id: 'transfer-branches', label: 'Traslado Sucursales', icon: ArrowRightLeft },
        { id: 'edit-prices', label: 'Editar Precios', icon: DollarSign },
        { id: 'physical-inventory', label: 'Toma Fisica', icon: ClipboardList },
        { id: 'create-categories', label: 'Crear Categorias', icon: FolderPlus },
        { id: 'price-list', label: 'Lista de Precios', icon: List },
        { id: 'manage-taxes', label: 'Administrar Impuestos', icon: Calculator },
        { id: 'measurement-units', label: 'Unidades de Medicion', icon: Ruler },
        { id: 'suppliers', label: 'Proveedores', icon: Building }
      ]
    },
    {
      id: 'billing',
      label: 'Facturación',
      icon: FileText,
      items: [
        { id: 'invoicing', label: 'Generar Factura', icon: FileText, primary: true },
        { id: 'sales-history', label: 'Historico de Ventas', icon: History },
        { id: 'payment-accounts', label: 'Cuentas por Cobrar', icon: Wallet },
        { id: 'collection-list', label: 'Lista de Cobros', icon: Receipt },
        { id: 'credit-notes', label: 'Notas de Credito', icon: FileX },
        { id: 'returns', label: 'Devoluciones', icon: RotateCcw }
      ]
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: BarChart3,
      items: [
        { id: 'reports', label: 'Reportes Generales', icon: BarChart3 },
        { id: 'cash-movement-history', label: 'Mov. de Caja', icon: TrendingDown }
      ]
    },
    {
      id: 'config',
      label: 'Configuración',
      icon: Settings,
      items: [
        { id: 'employees', label: 'Empleados', icon: UserCheck },
        { id: 'users', label: 'Usuarios', icon: User },
        { id: 'settings', label: 'Configuracion General', icon: Settings },
        { id: 'general-parameters', label: 'Parametros Generales', icon: Cog }
      ]
    }
  ];

  const deprecatedModules = {
    id: 'deprecated',
    label: 'Modulos a Revisar',
    icon: AlertCircle,
    warning: true,
    items: [
      { id: 'sales', label: 'Ventas (Redundante)', icon: DollarSign, deprecated: true },
      { id: 'proforma', label: 'Proforma (Integrar en OT)', icon: FileText, deprecated: true },
      { id: 'accounting', label: 'Contabilidad', icon: Calculator, deprecated: true },
      { id: 'journal-entry', label: 'Asiento de Diario', icon: BookOpen, deprecated: true },
      { id: 'credit-line', label: 'Linea de Credito', icon: BarChart3, deprecated: true },
      { id: 'bank-accounts', label: 'Cuentas Bancarias', icon: CreditCard, deprecated: true },
      { id: 'fixed-assets', label: 'Activo Fijo', icon: Home, deprecated: true }
    ]
  };

  const isGroupActive = (groupId: string) => {
    const group = menuGroups.find(g => g.id === groupId);
    if (group) {
      return group.items.some(item => item.id === currentView);
    }
    if (groupId === 'deprecated') {
      return deprecatedModules.items.some(item => item.id === currentView);
    }
    return false;
  };

  const renderMenuItem = (item: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; primary?: boolean; deprecated?: boolean }, isSubItem = false) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;

    return (
      <button
        key={item.id}
        onClick={() => setCurrentView(item.id)}
        className={`w-full flex items-center px-4 py-2 text-left hover:bg-primary-800 transition-all duration-200 ${
          isActive ? 'bg-primary-700 text-accent-400' : item.deprecated ? 'text-yellow-400' : 'text-gray-300'
        } ${isSubItem ? '' : ''} ${item.primary ? 'font-medium' : ''}`}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${item.deprecated ? 'text-yellow-500' : ''}`} />
        <span className={`ml-3 text-sm ${item.deprecated ? 'line-through opacity-70' : ''}`}>
          {item.label}
        </span>
        {item.deprecated && (
          <AlertTriangle className="w-3 h-3 ml-auto text-yellow-500" />
        )}
      </button>
    );
  };

  const renderMenuGroup = (group: typeof menuGroups[0] | typeof deprecatedModules) => {
    const Icon = group.icon;
    const isActive = isGroupActive(group.id);
    const isExpanded = expandedGroups[group.id];
    const isWarning = 'warning' in group && group.warning;

    return (
      <div key={group.id} className={isWarning ? 'mt-4 border-t border-primary-700 pt-4' : ''}>
        <button
          onClick={() => {
            if (collapsed) {
              const firstItem = group.items[0];
              if (firstItem) setCurrentView(firstItem.id);
            } else {
              toggleGroup(group.id);
            }
          }}
          className={`w-full flex items-center px-4 py-3 text-left hover:bg-primary-800 transition-all duration-200 ${
            isActive ? 'bg-accent-600 border-r-4 border-accent-400' : ''
          } ${collapsed ? 'justify-center' : 'justify-between'} ${isWarning ? 'text-yellow-400' : ''}`}
          title={collapsed ? group.label : ''}
        >
          <div className="flex items-center">
            <Icon className={`w-5 h-5 flex-shrink-0 ${isWarning ? 'text-yellow-500' : ''}`} />
            {!collapsed && (
              <span className={`ml-3 font-medium ${isWarning ? 'text-yellow-400 text-sm' : ''}`}>
                {group.label}
              </span>
            )}
          </div>
          {!collapsed && (
            isExpanded ?
              <ChevronDown className="w-4 h-4" /> :
              <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {!collapsed && isExpanded && (
          <div className="ml-4 border-l border-primary-700">
            {group.items.map(item => renderMenuItem(item, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-primary-900 text-white transition-all duration-300 z-30 flex flex-col shadow-xl ${collapsed && !isHovered ? 'w-16' : 'w-64'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between p-4 border-b border-primary-700 relative">
        {(!collapsed || isHovered) && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold transition-opacity duration-300">GESTBOX</h1>
          </div>
        )}

        {(collapsed && !isHovered) && (
          <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hidden mt-4 pb-4">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`w-full flex items-center px-4 py-3 text-left hover:bg-primary-800 transition-all duration-200 ${
            currentView === 'dashboard' ? 'bg-accent-600 border-r-4 border-accent-400' : ''
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Dashboard' : ''}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3 font-medium">Dashboard</span>}
        </button>

        {menuGroups.map(group => renderMenuGroup(group))}

        {!collapsed && (
          <div className="px-4 py-2 mt-4">
            <div className="border-t border-primary-700"></div>
          </div>
        )}

        {renderMenuGroup(deprecatedModules)}
      </nav>

    </div>
  );
};

export default Sidebar;
