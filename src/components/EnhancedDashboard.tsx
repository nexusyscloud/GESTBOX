import React, { useState } from 'react';
import QuickAccess from './QuickAccess';
import AdvancedFilters from './AdvancedFilters';
import FinancialMetrics from './FinancialMetrics';
import FinancialChart from './FinancialChart';
import { Bell, Settings, HelpCircle, Download, BarChart3 } from 'lucide-react';

interface EnhancedDashboardProps {
  onModuleClick?: (moduleId: string) => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ onModuleClick }) => {
  const [filters, setFilters] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleModuleClick = (moduleId: string) => {
    if (onModuleClick) {
      onModuleClick(moduleId);
    } else {
      // Mapeo de módulos del acceso rápido a las vistas del sistema
      const moduleMap: { [key: string]: string } = {
        'services': 'work-orders',
        'bodywork': 'work-orders',
        'inventory': 'inventory',
        'catalog': 'inventory'
      };
      
      const targetView = moduleMap[moduleId] || moduleId;
      // Simular navegación (en una app real usarías router)
      window.dispatchEvent(new CustomEvent('navigate', { detail: targetView }));
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    console.log('Filtros aplicados:', newFilters);
    // Aquí implementarías la lógica para actualizar los datos según los filtros
  };

  return (
    <div className="min-h-screen bg-primary-900 p-6">
      {/* Header con controles adicionales */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Ejecutivo</h1>
          <p className="text-gray-400">Panel de control integral para gestión de taller</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Indicador de actualización automática */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${autoRefresh ? 'bg-accent-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-300">
              {autoRefresh ? 'Desplazamiento automático' : 'Manual'}
            </span>
          </div>
          
          {/* Controles adicionales */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Módulos de Acceso Rápido */}
      <QuickAccess onModuleClick={handleModuleClick} />

      {/* Filtros Avanzados */}
      <div className="mt-6">
        <AdvancedFilters onFiltersChange={handleFiltersChange} />
      </div>

      {/* Métricas Financieras */}
      <FinancialMetrics />

      {/* Gráfico de Análisis Financiero */}
      <FinancialChart />

      {/* Información adicional del sistema */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary-800 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Estado del Sistema</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Órdenes Activas:</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Técnicos Disponibles:</span>
              <span className="font-medium">8/12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Citas Hoy:</span>
              <span className="font-medium">15</span>
            </div>
          </div>
        </div>

        <div className="bg-primary-800 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Alertas Importantes</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-sm">5 productos con stock bajo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-sm">3 facturas por vencer</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-500 rounded-full" />
              <span className="text-sm">2 vehículos listos para entrega</span>
            </div>
          </div>
        </div>

        <div className="bg-primary-800 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Rendimiento</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Eficiencia:</span>
              <span className="font-medium text-accent-400">87%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Satisfacción:</span>
              <span className="font-medium text-accent-400">4.8/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tiempo Promedio:</span>
              <span className="font-medium">2.3 días</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;