import React, { useState } from 'react';
import { Download, Filter, TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, DollarSign } from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('financial');

  const reportTypes = [
    { id: 'financial', name: 'Reporte Financiero', icon: DollarSign },
    { id: 'services', name: 'Servicios Realizados', icon: BarChart3 },
    { id: 'clients', name: 'Análisis de Clientes', icon: PieChart },
    { id: 'inventory', name: 'Movimiento de Inventario', icon: TrendingUp },
  ];

  const financialData = {
    totalRevenue: 145750,
    totalCosts: 62340,
    netProfit: 83410,
    profitMargin: 57.2,
    monthlyGrowth: 12.5,
    completedOrders: 89,
    averageOrderValue: 1637
  };

  const monthlyData = [
    { month: 'Ene', revenue: 98500, costs: 42300 },
    { month: 'Feb', revenue: 112300, costs: 48700 },
    { month: 'Mar', revenue: 125600, costs: 54200 },
    { month: 'Abr', revenue: 118900, costs: 51800 },
    { month: 'May', revenue: 134200, costs: 58100 },
    { month: 'Jun', revenue: 145750, costs: 62340 }
  ];

  const serviceDistribution = [
    { service: 'Mantenimiento Preventivo', count: 35, percentage: 39.3 },
    { service: 'Reparaciones Mayores', count: 18, percentage: 20.2 },
    { service: 'Cambio de Aceite', count: 15, percentage: 16.9 },
    { service: 'Sistema de Frenos', count: 12, percentage: 13.5 },
    { service: 'Diagnóstico', count: 9, percentage: 10.1 }
  ];

  const topClients = [
    { name: 'Juan Pérez González', orders: 8, spent: 12750 },
    { name: 'María García López', orders: 6, spent: 9850 },
    { name: 'Carlos Rodríguez', orders: 5, spent: 8300 },
    { name: 'Ana Martínez Silva', orders: 4, spent: 6900 },
    { name: 'Roberto Silva', orders: 3, spent: 5400 }
  ];

  const renderFinancialReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${financialData.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">
                  +{financialData.monthlyGrowth}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Costos Totales</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ${financialData.totalCosts.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm font-medium text-red-600">
                  42.8% del ingreso
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilidad Neta</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                ${financialData.netProfit.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm font-medium text-blue-600">
                  {financialData.profitMargin}% margen
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Promedio</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                ${financialData.averageOrderValue.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm font-medium text-gray-600">
                  {financialData.completedOrders} órdenes
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Tendencia Mensual</h3>
        <div className="space-y-4">
          {monthlyData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(data.revenue / 150000) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      ${(data.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div
                    className="bg-red-500 h-6 rounded-full absolute top-0 opacity-70"
                    style={{ width: `${(data.costs / 150000) * 100}%` }}
                  />
                </div>
                <div className="text-sm font-medium text-gray-900 w-20">
                  ${((data.revenue - data.costs) / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm text-gray-600">Ingresos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded opacity-70" />
            <span className="text-sm text-gray-600">Costos</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServicesReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución de Servicios</h3>
        <div className="space-y-4">
          {serviceDistribution.map((service, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{service.service}</span>
                  <span className="text-sm text-gray-600">{service.count} servicios</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-sm font-medium text-gray-900">
                {service.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClientsReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 5 Clientes</h3>
        <div className="space-y-4">
          {topClients.map((client, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-600">{client.orders} órdenes completadas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">${client.spent.toLocaleString()}</p>
                <p className="text-sm text-gray-600">gastado total</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedReport) {
      case 'financial':
        return renderFinancialReport();
      case 'services':
        return renderServicesReport();
      case 'clients':
        return renderClientsReport();
      case 'inventory':
        return <div className="text-center py-12 text-gray-500">Reporte de inventario en desarrollo</div>;
      default:
        return renderFinancialReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Exportar PDF</span>
        </button>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="flex space-x-2">
            {reportTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedReport === type.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{type.name}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
                <option value="year">Este año</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {renderContent()}
    </div>
  );
};

export default Reports;