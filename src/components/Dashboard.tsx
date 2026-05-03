import React from 'react';
import { TrendingUp, TrendingDown, Users, Car, ClipboardList, DollarSign, AlertTriangle, CheckCircle, Clock, Calendar, ArrowRight, Activity, Wrench, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const metrics = [
    {
      title: 'Ingresos del Mes',
      value: '$24,580',
      change: '+12.5%',
      positive: true,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Órdenes Activas',
      value: '18',
      change: '+3',
      positive: true,
      icon: ClipboardList,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Clientes del Mes',
      value: '142',
      change: '+8.2%',
      positive: true,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Vehículos en Servicio',
      value: '23',
      change: '-2',
      positive: false,
      icon: Car,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const recentOrders = [
    { 
      id: '001', 
      client: 'Juan Pérez', 
      vehicle: 'Toyota Corolla 2020', 
      service: 'Cambio de aceite', 
      status: 'En proceso', 
      priority: 'media',
      progress: 65,
      technician: 'Carlos Méndez',
      estimatedTime: '2 horas'
    },
    { 
      id: '002', 
      client: 'María García', 
      vehicle: 'Honda Civic 2019', 
      service: 'Revisión general', 
      status: 'Completado', 
      priority: 'alta',
      progress: 100,
      technician: 'Roberto Silva',
      estimatedTime: 'Finalizado'
    },
    { 
      id: '003', 
      client: 'Carlos López', 
      vehicle: 'Ford Focus 2021', 
      service: 'Reparación frenos', 
      status: 'Pendiente', 
      priority: 'alta',
      progress: 0,
      technician: 'Miguel Torres',
      estimatedTime: '4 horas'
    },
    { 
      id: '004', 
      client: 'Ana Martínez', 
      vehicle: 'Chevrolet Spark 2018', 
      service: 'Cambio de llantas', 
      status: 'En proceso', 
      priority: 'baja',
      progress: 30,
      technician: 'Luis Ramírez',
      estimatedTime: '1.5 horas'
    },
  ];

  const upcomingAppointments = [
    { time: '09:00', client: 'Roberto Silva', service: 'Diagnóstico motor', vehicle: 'Nissan Sentra 2022' },
    { time: '11:30', client: 'Laura Fernández', service: 'Cambio de filtros', vehicle: 'Mazda CX-5 2021' },
    { time: '14:00', client: 'Miguel Torres', service: 'Revisión suspensión', vehicle: 'Volkswagen Jetta 2020' },
    { time: '16:30', client: 'Sofia Ruiz', service: 'Mantenimiento preventivo', vehicle: 'Hyundai Elantra 2019' },
  ];

  const quickStats = [
    { label: 'Trabajos Completados Hoy', value: '8', icon: CheckCircle, color: 'text-emerald-600' },
    { label: 'Técnicos Disponibles', value: '5/8', icon: Users, color: 'text-blue-600' },
    { label: 'Tiempo Promedio', value: '2.3h', icon: Clock, color: 'text-purple-600' },
    { label: 'Satisfacción Cliente', value: '4.8★', icon: Activity, color: 'text-orange-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'En proceso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pendiente': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-amber-500';
    return 'bg-gray-300';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600 mt-1">Resumen general de tu taller mecánico</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Última actualización</p>
          <p className="text-sm font-medium text-gray-900">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${metric.textColor}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {metric.positive ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-semibold ${metric.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Rápidas</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h3>
                  <p className="text-sm text-gray-600">Últimas órdenes de trabajo</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <span>Ver todas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-bold text-gray-500">#{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{order.client}</h4>
                      <p className="text-sm text-gray-600 mb-1">{order.vehicle}</p>
                      <p className="text-sm font-medium text-gray-800">{order.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Técnico</p>
                      <p className="text-sm font-medium text-gray-900">{order.technician}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.estimatedTime}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(order.progress)}`}
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{order.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Citas de Hoy</h3>
                <p className="text-sm text-gray-600">Próximas citas programadas</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 bg-purple-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-purple-600">{appointment.time}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 truncate">{appointment.client}</h4>
                    <p className="text-sm text-gray-600 truncate">{appointment.service}</p>
                    <p className="text-xs text-gray-500 truncate">{appointment.vehicle}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 text-purple-600 hover:text-purple-700 text-sm font-medium hover:bg-purple-50 rounded-xl transition-colors flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Ver calendario completo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Wrench className="w-8 h-8" />
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-2">Control de Taller</h3>
          <p className="text-blue-100 text-sm mb-4">Gestiona las estaciones de trabajo y técnicos</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Ir al Taller
          </button>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8" />
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-2">Nueva Orden</h3>
          <p className="text-emerald-100 text-sm mb-4">Crear una nueva orden de trabajo</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Crear Orden
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-2">Agendar Cita</h3>
          <p className="text-purple-100 text-sm mb-4">Programar nueva cita con cliente</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Nueva Cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;