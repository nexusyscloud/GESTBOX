import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Users, CreditCard } from 'lucide-react';

interface MetricCardProps {
  title: string;
  amount: string;
  percentage: string;
  isPositive: boolean;
  subtitle: string;
  details: Array<{label: string, value: string, count: number}>;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  amount, 
  percentage, 
  isPositive, 
  subtitle, 
  details 
}) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
          isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{percentage}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold mb-1">{amount}</div>
        <div className="text-gray-400 text-sm">{subtitle}</div>
      </div>

      <div className="space-y-3">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                detail.label.includes('Contado') || detail.label.includes('Alcanzado') || detail.label.includes('Al Día') || detail.label.includes('Vigentes') 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-300">{detail.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{detail.value}</span>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Users className="w-3 h-3" />
                <span>{detail.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de progreso visual */}
      <div className="mt-4 space-y-2">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  detail.label.includes('Contado') || detail.label.includes('Alcanzado') || detail.label.includes('Al Día') || detail.label.includes('Vigentes')
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.random() * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-8">{Math.floor(Math.random() * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FinancialMetrics: React.FC = () => {
  const metricsData = [
    {
      title: 'Ventas Totales',
      amount: '$0.00',
      percentage: '0.0%',
      isPositive: true,
      subtitle: 'Distribución por Tipo    0.000% / 0.000%',
      details: [
        { label: 'Contado', value: '$0.00', count: 0 },
        { label: 'Crédito', value: '$0.00', count: 0 }
      ]
    },
    {
      title: 'Proyección de Ventas',
      amount: '$0.00',
      percentage: '0%',
      isPositive: false,
      subtitle: 'Avance vs Meta    0% / 100%',
      details: [
        { label: 'Alcanzado', value: '$0.00', count: 0 },
        { label: 'Pendiente', value: '$0.00', count: 0 }
      ]
    },
    {
      title: 'Total por Pagar',
      amount: '$0.00',
      percentage: '0%',
      isPositive: false,
      subtitle: 'Distribución    0% / 0%',
      details: [
        { label: 'Al Día', value: '$0.00', count: 0 },
        { label: 'Vencidas', value: '$0.00', count: 0 }
      ]
    },
    {
      title: 'Total por Cobrar',
      amount: '$0.00',
      percentage: '0%',
      isPositive: false,
      subtitle: 'Distribución    0% / 0%',
      details: [
        { label: 'Vigentes', value: '$0.00', count: 0 },
        { label: 'Vencidas 30d', value: '$0.00', count: 0 }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricsData.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default FinancialMetrics;