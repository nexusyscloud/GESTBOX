import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, LineChart } from 'lucide-react';

const FinancialChart: React.FC = () => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

  // Datos simulados para el gráfico
  const monthlyData = [
    { month: 'Ene', ingresos: 85000, costos: 45000, utilidad: 40000 },
    { month: 'Feb', ingresos: 92000, costos: 48000, utilidad: 44000 },
    { month: 'Mar', ingresos: 78000, costos: 42000, utilidad: 36000 },
    { month: 'Abr', ingresos: 105000, costos: 55000, utilidad: 50000 },
    { month: 'May', ingresos: 118000, costos: 62000, utilidad: 56000 },
    { month: 'Jun', ingresos: 134000, costos: 68000, utilidad: 66000 }
  ];

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.ingresos, d.costos, d.utilidad)));

  return (
    <div className="bg-slate-800 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold">Análisis Financiero - Evolución de Ventas</h3>
          </div>
          <p className="text-gray-400 text-sm">Comparación de ingresos, costos y punto de equilibrio</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'line' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <LineChart className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'bar' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'pie' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <PieChart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gráfico de Barras Simulado */}
      <div className="h-80 flex items-end justify-between space-x-2 mb-6">
        {monthlyData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-full flex flex-col items-center space-y-1 h-64">
              {/* Barra de Ingresos */}
              <div className="w-full flex justify-center">
                <div
                  className="bg-green-500 rounded-t w-6"
                  style={{ height: `${(data.ingresos / maxValue) * 200}px` }}
                  title={`Ingresos: $${data.ingresos.toLocaleString()}`}
                />
              </div>
              
              {/* Barra de Costos */}
              <div className="w-full flex justify-center">
                <div
                  className="bg-red-500 w-6"
                  style={{ height: `${(data.costos / maxValue) * 200}px` }}
                  title={`Costos: $${data.costos.toLocaleString()}`}
                />
              </div>
              
              {/* Barra de Utilidad */}
              <div className="w-full flex justify-center">
                <div
                  className="bg-blue-500 rounded-b w-6"
                  style={{ height: `${(data.utilidad / maxValue) * 200}px` }}
                  title={`Utilidad: $${data.utilidad.toLocaleString()}`}
                />
              </div>
            </div>
            
            <span className="text-xs text-gray-400 font-medium">{data.month}</span>
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-sm text-gray-300">Ingresos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-sm text-gray-300">Costos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <span className="text-sm text-gray-300">Utilidad</span>
        </div>
      </div>

      {/* Métricas Resumidas */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            ${monthlyData.reduce((sum, d) => sum + d.ingresos, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Ingresos Totales</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            ${monthlyData.reduce((sum, d) => sum + d.costos, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Costos Totales</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            ${monthlyData.reduce((sum, d) => sum + d.utilidad, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Utilidad Neta</div>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;