import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MoreVertical, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EMPRESA_ID = 'b4061d6f-5ff5-4a89-8c73-5dd39e33305e';

interface OrdenTrabajo {
  id: string;
  numero: string | null;
  descripcion: string | null;
  estado: string | null;
  total: number | null;
  created_at: string | null;
  clientes: {
    nombre: string;
  } | null;
  vehiculos: {
    placa: string | null;
    marca: string | null;
    modelo: string | null;
  } | null;
}

interface TechnicianColumn {
  name: string;
  date: string;
  orders: {
    id: string;
    numero: string;
    client: string;
    color: string;
    position: { row: number; height: number };
    startTime: string;
    endTime: string;
  }[];
}

const WorkflowBoard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianColumn[]>([]);

  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const defaultTechnicians = [
    'Estacion 1',
    'Estacion 2',
    'Estacion 3',
    'Estacion 4',
    'Estacion 5',
    'Estacion 6'
  ];

  const fetchOrdenes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('ordenes_trabajo')
      .select(`
        id,
        numero_ot,
        descripcion,
        estado,
        total,
        created_at,
        clientes (
          nombre
        ),
        vehiculos (
          placa,
          marca,
          modelo
        )
      `)
      .eq('empresa_id', EMPRESA_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ordenes:', error);
      setOrdenes([]);
    } else {
      setOrdenes(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  useEffect(() => {
    const formattedDate = formatWorkflowDate(selectedDate);

    const getColorByEstado = (estado: string | null): string => {
      switch (estado) {
        case 'pendiente': return 'bg-yellow-300';
        case 'en_proceso':
        case 'en-proceso': return 'bg-blue-200';
        case 'completada':
        case 'completado': return 'bg-green-300';
        case 'cancelada':
        case 'cancelado': return 'bg-red-200';
        default: return 'bg-gray-200';
      }
    };

    const techColumns: TechnicianColumn[] = defaultTechnicians.map((techName, techIndex) => {
      const assignedOrders = ordenes
        .filter((_, orderIndex) => orderIndex % defaultTechnicians.length === techIndex)
        .slice(0, 4)
        .map((orden, orderIndex) => {
          const startHour = 8 + orderIndex;
          return {
            id: orden.id,
            numero: orden.numero_ot || '-',
            client: orden.clientes?.nombre || 'Sin cliente',
            color: getColorByEstado(orden.estado),
            position: { row: startHour, height: 1 },
            startTime: `${startHour}:00`,
            endTime: `${startHour + 1}:00`
          };
        });

      return {
        name: techName,
        date: formattedDate,
        orders: assignedOrders
      };
    });

    setTechnicians(techColumns);
  }, [ordenes, selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

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

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const formatWorkflowDate = (date: Date) => {
    const dayNamesSpanish = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
    const dayName = dayNamesSpanish[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    return `${dayName}, ${day}`;
  };

  const pendingCount = ordenes.filter(o => o.estado === 'pendiente').length;
  const inProgressCount = ordenes.filter(o => o.estado === 'en_proceso' || o.estado === 'en-proceso').length;
  const completedCount = ordenes.filter(o => o.estado === 'completada' || o.estado === 'completado').length;
  const totalOrdenes = ordenes.length;

  const technicianStats = defaultTechnicians.map((name, index) => ({
    name: name,
    progress: totalOrdenes > 0 ? Math.round((ordenes.filter((_, i) => i % defaultTechnicians.length === index).filter(o => o.estado === 'completada' || o.estado === 'completado').length / Math.max(1, ordenes.filter((_, i) => i % defaultTechnicians.length === index).length)) * 100) : 0,
    color: 'bg-green-500'
  }));

  const timeSlots: string[] = [];
  for (let hour = 8; hour <= 17; hour++) {
    timeSlots.push(`${hour}:00`);
    if (hour < 17) {
      timeSlots.push(`${hour}:30`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando tablero de trabajo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
      <div className="flex-1 flex flex-col">
        <div className="bg-white/98 backdrop-blur-md border-b border-gray-200/80 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/80 border border-blue-200/60 rounded-2xl cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-lg">P</span>
                </div>
                <span className="text-sm font-bold text-blue-900 tracking-wide">Planificar</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 rounded-2xl cursor-pointer hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-lg">$</span>
                </div>
                <span className="text-sm font-bold text-emerald-900 text-center leading-tight tracking-wide">Presupuesto<br/>y Reserva</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/80 border border-orange-200/60 rounded-2xl cursor-pointer hover:from-orange-100 hover:to-orange-200 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-lg">O</span>
                </div>
                <span className="text-sm font-bold text-orange-900 text-center leading-tight tracking-wide">Orden<br/>Servicio</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-gradient-to-br from-teal-50 to-teal-100/80 border border-teal-200/60 rounded-2xl cursor-pointer hover:from-teal-100 hover:to-teal-200 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-lg">F</span>
                </div>
                <span className="text-sm font-bold text-teal-900 tracking-wide">Prefactura</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-gradient-to-br from-red-50 to-red-100/80 border border-red-200/60 rounded-2xl cursor-pointer hover:from-red-100 hover:to-red-200 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-lg">||</span>
                </div>
                <span className="text-sm font-bold text-red-900 text-center leading-tight tracking-wide">Ver OT<br/>Paralizadas</span>
              </div>
            </div>

            <button
              onClick={fetchOrdenes}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-x-auto bg-white/50 backdrop-blur-sm">
            <div className="flex min-w-full border border-gray-200/60 rounded-2xl overflow-hidden shadow-xl">
              <div className="w-24 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-md border-r border-gray-300/60 flex-shrink-0 shadow-lg">
                <div className="h-24 border-b border-gray-300/60 bg-gradient-to-br from-gray-100 to-gray-200/80 flex items-center justify-center">
                </div>
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="h-8 border-b border-gray-200/40 flex items-center justify-center text-sm text-gray-800 font-bold bg-white/90 hover:bg-gray-50/90 transition-all duration-200 backdrop-blur-sm"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {technicians.map((tech, index) => (
                <div key={index} className="w-44 border-r border-gray-300/60 bg-gradient-to-b from-white to-gray-50/60 backdrop-blur-md flex-shrink-0 shadow-lg">
                  <div className="h-24 border-b border-gray-300/60 p-4 bg-gradient-to-br from-gray-100 to-gray-200/80 backdrop-blur-sm">
                    <div className="text-base font-bold text-gray-900 truncate mb-2 tracking-wide">{tech.name}</div>
                    <div className="text-sm font-semibold text-gray-700 bg-white/90 px-3 py-1.5 rounded-xl text-center shadow-sm border border-gray-200/60">{tech.date}</div>
                  </div>

                  <div className="relative">
                    {timeSlots.map((time) => (
                      <div key={time} className="h-8 border-b border-gray-200/30 relative hover:bg-blue-50/40 transition-all duration-200">
                        {tech.orders
                          .filter(order => order.startTime === time)
                          .map((order, orderIndex) => (
                            <div
                              key={orderIndex}
                              className={`absolute left-2 right-2 ${order.color} border-2 border-white/80 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group backdrop-blur-md hover:scale-105`}
                              style={{
                                top: '4px',
                                height: `${(order.position.height * 32) - 8}px`,
                                zIndex: 10
                              }}
                              title={`OT ${order.numero} - ${order.client}\n${order.startTime} - ${order.endTime}`}
                            >
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="w-6 h-6 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border-2 border-white/80 hover:scale-110 transition-transform duration-200">
                                  <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </div>
                              </div>

                              <div className="p-2 h-full flex flex-col justify-between">
                                <div className="text-xs font-black text-gray-900 leading-tight tracking-wider truncate">
                                  {order.numero}
                                </div>
                                <div className="text-xs font-semibold text-gray-800 leading-tight truncate flex-1 flex items-center">
                                  {order.client}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-96 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-md border-l border-gray-300/60 flex flex-col shadow-2xl">
        <div className="p-8 border-b border-gray-300/60 bg-gradient-to-br from-gray-50 to-white backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-3 hover:bg-white/90 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-gray-900 tracking-wide">{monthNames[currentDate.getMonth()]}</span>
              <span className="text-2xl font-bold text-gray-900 tracking-wide">{currentDate.getFullYear()}</span>
            </div>
            <button
              onClick={() => navigateMonth('next')}
              className="p-3 hover:bg-white/90 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-3 text-sm mb-6">
            {dayNames.map((day, dayIndex) => (
              <div key={dayIndex} className="text-center text-gray-600 font-bold p-3 bg-white/60 rounded-xl shadow-sm">
                {day}
              </div>
            ))}

            {getDaysInMonth(currentDate).map((day, dayIndex) => (
              <div
                key={dayIndex}
                onClick={() => setSelectedDate(day.date)}
                className={`text-center p-3 rounded-xl cursor-pointer transition-all duration-300 font-bold shadow-sm hover:shadow-lg ${
                  !day.isCurrentMonth
                    ? 'text-gray-300 hover:bg-white/60 bg-gray-100/40'
                    : isSelectedDate(day.date)
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl scale-110'
                    : isToday(day.date)
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900 font-black shadow-lg border-2 border-blue-300'
                    : 'text-gray-800 hover:bg-white/80 hover:shadow-md hover:scale-105 bg-white/40'
                }`}
              >
                {day.date.getDate()}
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <button
              onClick={goToToday}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl text-base hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:scale-105 tracking-wide"
            >
              Hoy
            </button>
          </div>

          <div className="text-center bg-white/90 rounded-xl p-4 shadow-lg border border-gray-200/60 backdrop-blur-sm">
            <div className="text-sm font-semibold text-gray-600 mb-2 tracking-wide">Fecha seleccionada:</div>
            <div className="text-base font-bold text-gray-900 tracking-wide">
              {selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-gray-300/60 bg-gradient-to-br from-gray-50 to-white backdrop-blur-sm">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-bold text-gray-900 tracking-wide">Estaciones</span>
              <button className="p-3 hover:bg-white/90 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110">
                <MoreVertical className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            {technicianStats.map((tech, techIndex) => (
              <div key={techIndex} className="flex items-center justify-between py-4 px-4 bg-white/90 rounded-xl mb-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/60 backdrop-blur-sm hover:scale-102">
                <span className="text-base font-bold text-gray-800 tracking-wide">{tech.name}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-24 bg-gray-200 rounded-full h-4 shadow-inner border border-gray-300/60">
                    <div
                      className={`h-4 ${tech.color} rounded-full shadow-lg transition-all duration-500 border border-green-400/60`}
                      style={{ width: `${tech.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-base font-black text-gray-700 min-w-[4rem] tracking-wide">{tech.progress}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
              <div className="text-xs text-yellow-600 font-medium">Pendientes</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{inProgressCount}</div>
              <div className="text-xs text-blue-600 font-medium">En Proceso</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
              <div className="text-2xl font-bold text-green-700">{completedCount}</div>
              <div className="text-xs text-green-600 font-medium">Completadas</div>
            </div>
          </div>

          <div className="text-center bg-white/90 rounded-xl p-6 shadow-lg border border-gray-200/60 backdrop-blur-sm">
            <div className="text-2xl font-black text-gray-900 tracking-wide">Total: {totalOrdenes} ordenes</div>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-gray-50 to-white border-t border-gray-300/60 backdrop-blur-sm">
          <h3 className="text-2xl font-black text-gray-900 mb-6 text-center tracking-wide">
            ESTADOS DE ORDENES
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/90 rounded-xl p-4 shadow-lg border border-gray-200/60 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-yellow-300 rounded-full border-2 border-yellow-400 shadow-lg"></div>
                <span className="text-base font-bold text-gray-800 tracking-wide">Pendiente</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-green-500 shadow-lg"></div>
                <span className="text-base font-bold text-gray-800 tracking-wide">Completada</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/90 rounded-xl p-4 shadow-lg border border-gray-200/60 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-blue-300 rounded-full border-2 border-blue-400 shadow-lg"></div>
                <span className="text-base font-bold text-gray-800 tracking-wide">En Proceso</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-red-300 rounded-full border-2 border-red-400 shadow-lg"></div>
                <span className="text-base font-bold text-gray-800 tracking-wide">Cancelada</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300/60">
            <div className="text-base text-gray-700 text-center bg-white/90 rounded-xl p-5 shadow-lg border border-gray-200/60 backdrop-blur-sm">
              <div className="mb-3">
                <span className="font-black tracking-wide">Datos en tiempo real</span>
              </div>
              <div className="font-semibold">
                Las ordenes se cargan desde Supabase
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBoard;
