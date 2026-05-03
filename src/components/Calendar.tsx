import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Clock, User, Car, Calendar as CalendarIcon } from 'lucide-react';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showModal, setShowModal] = useState(false);

  const appointments = [
    {
      id: 1,
      title: 'Cambio de aceite',
      client: 'Juan Pérez',
      vehicle: 'Toyota Corolla 2020',
      date: '2024-01-15',
      time: '09:00',
      duration: 60,
      status: 'confirmada',
      type: 'mantenimiento'
    },
    {
      id: 2,
      title: 'Revisión general',
      client: 'María García',
      vehicle: 'Honda Civic 2019',
      date: '2024-01-15',
      time: '11:30',
      duration: 120,
      status: 'pendiente',
      type: 'diagnóstico'
    },
    {
      id: 3,
      title: 'Reparación frenos',
      client: 'Carlos López',
      vehicle: 'Ford Focus 2021',
      date: '2024-01-16',
      time: '14:00',
      duration: 180,
      status: 'confirmada',
      type: 'reparación'
    },
    {
      id: 4,
      title: 'Cambio de llantas',
      client: 'Ana Martínez',
      vehicle: 'Chevrolet Spark 2018',
      date: '2024-01-16',
      time: '16:30',
      duration: 90,
      status: 'completada',
      type: 'mantenimiento'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mantenimiento': return 'bg-blue-500';
      case 'reparación': return 'bg-red-500';
      case 'diagnóstico': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Next month days to fill the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let day = 1; days.length < totalCells; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const AppointmentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Nueva Cita</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Seleccionar cliente</option>
                <option value="Juan Pérez">Juan Pérez González</option>
                <option value="María García">María García López</option>
                <option value="Carlos López">Carlos López</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehículo
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Seleccionar vehículo</option>
                <option value="Toyota Corolla 2020">Toyota Corolla 2020</option>
                <option value="Honda Civic 2019">Honda Civic 2019</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la Cita
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Cambio de aceite, Revisión general"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos)
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">1.5 horas</option>
                <option value="120">2 horas</option>
                <option value="180">3 horas</option>
                <option value="240">4 horas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Servicio
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="mantenimiento">Mantenimiento</option>
                <option value="reparación">Reparación</option>
                <option value="diagnóstico">Diagnóstico</option>
                <option value="emergencia">Emergencia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Técnico Asignado
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Asignar automáticamente</option>
                <option value="Carlos Méndez">Carlos Méndez</option>
                <option value="Roberto Silva">Roberto Silva</option>
                <option value="Miguel Torres">Miguel Torres</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notas adicionales sobre la cita"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Programar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendario de Citas</h2>
          <p className="text-gray-600 mt-1">Programa y gestiona las citas del taller</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Cita</span>
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Hoy
            </button>
          </div>
          <div className="flex space-x-2">
            {(['month', 'week', 'day'] as const).map(viewType => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  view === viewType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {viewType === 'month' ? 'Mes' : viewType === 'week' ? 'Semana' : 'Día'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {view === 'month' && (
          <>
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {dayNames.map(day => (
                <div key={day} className="p-4 text-center text-sm font-medium text-gray-500 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {getDaysInMonth(currentDate).map((day, index) => {
                const dayAppointments = getAppointmentsForDate(day.date);
                const isToday = day.date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border-r border-b border-gray-100 ${
                      !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                    } ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm ${
                        !day.isCurrentMonth ? 'text-gray-400' :
                        isToday ? 'font-bold text-blue-600' : 'text-gray-900'
                      }`}>
                        {day.date.getDate()}
                      </span>
                      {dayAppointments.length > 0 && (
                        <span className="text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                          {dayAppointments.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map(appointment => (
                        <div
                          key={appointment.id}
                          className={`text-xs p-1 rounded border ${getStatusColor(appointment.status)}`}
                        >
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${getTypeColor(appointment.type)}`} />
                            <span className="font-medium">{appointment.time}</span>
                          </div>
                          <div className="truncate">{appointment.title}</div>
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500 p-1">
                          +{dayAppointments.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Citas de Hoy</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).map(appointment => (
              <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-4 h-4 rounded-full ${getTypeColor(appointment.type)}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {appointment.time} ({appointment.duration} min)
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {appointment.client}
                    </div>
                    <div className="flex items-center">
                      <Car className="w-4 h-4 mr-1" />
                      {appointment.vehicle}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && <AppointmentModal />}
    </div>
  );
};

export default Calendar;