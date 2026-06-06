import React from 'react';

import {
  Users,
  Car,
  ClipboardList,
  Wrench,
  Loader2,
  Clock3,
} from 'lucide-react';

import { useDashboard } from '../hooks/useDashboard';

const Dashboard: React.FC = () => {
  const {
    loading,
    stats,
    recentActivity,
  } = useDashboard();

  const cards = [
    {
      title: 'Clientes',
      value: stats.clientes,
      icon: Users,
    },

    {
      title: 'Vehículos',
      value: stats.vehiculos,
      icon: Car,
    },

    {
      title: 'Recepciones',
      value: stats.recepciones,
      icon: Wrench,
    },

    {
      title: 'Órdenes',
      value: stats.ordenes,
      icon: ClipboardList,
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Resumen operativo de GESTBOX.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center text-gray-500">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />

          Cargando métricas...
        </div>
      ) : (
        <>
          
          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300"
                >
                  <div className="flex items-start justify-between">
                    
                    {/* Content */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">
                        {card.title}
                      </p>

                      <p className="text-4xl font-bold text-gray-900 mt-4 leading-none">
                        {card.value}
                      </p>

                      <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                        Operativo
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Acciones Rápidas
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Accesos operacionales frecuentes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 text-left transition-all duration-300 shadow-sm hover:shadow-md">
                <p className="text-sm opacity-80">
                  Operaciones
                </p>

                <h3 className="text-lg font-semibold mt-2">
                  Nueva Recepción
                </h3>
              </button>

              <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-5 text-left transition-all duration-300 shadow-sm hover:shadow-md">
                <p className="text-sm opacity-80">
                  Taller
                </p>

                <h3 className="text-lg font-semibold mt-2">
                  Nueva OT
                </h3>
              </button>

              <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl p-5 text-left transition-all duration-300 shadow-sm hover:shadow-md">
                <p className="text-sm opacity-80">
                  CRM
                </p>

                <h3 className="text-lg font-semibold mt-2">
                  Nuevo Cliente
                </h3>
              </button>

              <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-5 text-left transition-all duration-300 shadow-sm hover:shadow-md">
                <p className="text-sm opacity-80">
                  Vehículos
                </p>

                <h3 className="text-lg font-semibold mt-2">
                  Nuevo Vehículo
                </h3>
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Actividad Operacional
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Últimos movimientos del ecosistema
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {recentActivity.map(
                (activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Clock3 className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          {activity.title}
                        </h3>

                        <span className="text-xs text-gray-400">
                          {activity.time}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;