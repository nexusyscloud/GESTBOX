import React from 'react';
import { Wrench, Car, Package, FileText, Calendar, Users, BarChart3, Settings } from 'lucide-react';

interface QuickAccessProps {
  onModuleClick: (module: string) => void;
}

const QuickAccess: React.FC<QuickAccessProps> = ({ onModuleClick }) => {
  const modules = [
    {
      id: 'services',
      title: 'Servicios',
      subtitle: 'Clic aquí para administrar servicios',
      icon: Wrench,
      color: 'bg-red-500',
      borderColor: 'border-red-400'
    },
    {
      id: 'bodywork',
      title: 'Enderezado y Pintura',
      subtitle: 'Crear orden de Enderezado y Pintura',
      icon: Car,
      color: 'bg-pink-500',
      borderColor: 'border-pink-400'
    },
    {
      id: 'inventory',
      title: 'Inventario',
      subtitle: 'Clic aquí para crear productos',
      icon: Package,
      color: 'bg-cyan-500',
      borderColor: 'border-cyan-400'
    },
    {
      id: 'catalog',
      title: 'Catálogo',
      subtitle: 'Clic aquí para crear catálogo',
      icon: FileText,
      color: 'bg-orange-500',
      borderColor: 'border-orange-400'
    }
  ];

  return (
    <div className="bg-slate-800 p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Acceso Rápido</h2>
        <span className="text-green-400 text-sm">Nuevo</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => onModuleClick(module.id)}
              className={`${module.color} ${module.borderColor} border-t-4 rounded-lg p-4 text-white hover:opacity-90 hover:scale-105 transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Icon className="w-6 h-6" />
                <h3 className="font-semibold text-lg">{module.title}</h3>
              </div>
              <p className="text-sm opacity-90 text-left">{module.subtitle}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAccess;