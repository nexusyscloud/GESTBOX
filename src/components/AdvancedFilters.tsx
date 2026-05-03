import React, { useState } from 'react';
import { Building2, Calendar, Search, Filter, ChevronDown } from 'lucide-react';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFiltersChange }) => {
  const [selectedCompany, setSelectedCompany] = useState('Legacy Automotriz');
  const [selectedPeriod, setSelectedPeriod] = useState('Hoy');
  const [dateRange, setDateRange] = useState({
    start: '28/07/2025',
    end: '28/07/2025'
  });

  const companies = [
    'Legacy Automotriz',
    'AutoService Pro',
    'Mecánica Integral',
    'Taller Express',
    'AutoTech Solutions'
  ];

  const periods = ['Hoy', 'Esta Semana', 'Este Mes', 'Este Año', 'Personalizado'];

  const handleFilterChange = () => {
    onFiltersChange({
      company: selectedCompany,
      period: selectedPeriod,
      dateRange: dateRange
    });
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Selector de Compañía */}
        <div>
          <label className="flex items-center text-white text-sm font-medium mb-2">
            <Building2 className="w-4 h-4 mr-2" />
            COMPAÑÍAS
          </label>
          <div className="relative">
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                handleFilterChange();
              }}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Selector de Período */}
        <div>
          <label className="flex items-center text-white text-sm font-medium mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            PERÍODO
          </label>
          <div className="flex space-x-2">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => {
                  setSelectedPeriod(period);
                  handleFilterChange();
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Rango de Fechas */}
        <div>
          <label className="text-white text-sm font-medium mb-2 block">
            RANGO DE FECHAS
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="DD/MM/YYYY"
            />
            <span className="text-gray-400">→</span>
            <input
              type="text"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="DD/MM/YYYY"
            />
          </div>
        </div>

        {/* Botón de Búsqueda */}
        <div>
          <button
            onClick={handleFilterChange}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;