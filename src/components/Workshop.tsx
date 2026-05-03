import React, { useState, useEffect } from 'react';
import { Wrench, Car, Users, Calendar, BarChart3, AlertTriangle, CheckCircle, Clock, Plus, Play, Pause, Square, CreditCard as Edit, Eye, MoreVertical, Filter, Search, RefreshCw, Loader2 } from 'lucide-react';
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
    telefono: string | null;
  } | null;
  vehiculos: {
    placa: string | null;
    marca: string | null;
    modelo: string | null;
    anio: number | null;
  } | null;
}

interface Workstation {
  id: number;
  name: string;
  orden: OrdenTrabajo | null;
  status: 'disponible' | 'en-proceso' | 'completado' | 'pendiente' | 'mantenimiento';
  progress: number;
}

const Workshop: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [ordenesPendientes, setOrdenesPendientes] = useState<OrdenTrabajo[]>([]);
  const [ordenesEnProceso, setOrdenesEnProceso] = useState<OrdenTrabajo[]>([]);
  const [ordenesCompletadas, setOrdenesCompletadas] = useState<OrdenTrabajo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Workstation | null>(null);

  const [workstations, setWorkstations] = useState<Workstation[]>([
    { id: 1, name: 'Estacion 1', orden: null, status: 'disponible', progress: 0 },
    { id: 2, name: 'Estacion 2', orden: null, status: 'disponible', progress: 0 },
    { id: 3, name: 'Estacion 3', orden: null, status: 'disponible', progress: 0 },
    { id: 4, name: 'Estacion 4', orden: null, status: 'disponible', progress: 0 },
    { id: 5, name: 'Estacion 5', orden: null, status: 'disponible', progress: 0 },
    { id: 6, name: 'Estacion 6', orden: null, status: 'disponible', progress: 0 }
  ]);

  const fetchOrdenes = async () => {
    setLoading(true);

    const { data: pendientes } = await supabase
      .from('ordenes_trabajo')
      .select(`
        id, numero_ot, descripcion, estado, total, created_at,
        clientes ( nombre, telefono ),
        vehiculos ( placa, marca, modelo, anio )
      `)
      .eq('empresa_id', EMPRESA_ID)
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: false });

    const { data: enProceso } = await supabase
      .from('ordenes_trabajo')
      .select(`
        id, numero_ot, descripcion, estado, total, created_at,
        clientes ( nombre, telefono ),
        vehiculos ( placa, marca, modelo, anio )
      `)
      .eq('empresa_id', EMPRESA_ID)
      .in('estado', ['en_proceso', 'en-proceso'])
      .order('created_at', { ascending: false });

    const { data: completadas } = await supabase
      .from('ordenes_trabajo')
      .select(`
        id, numero_ot, descripcion, estado, total, created_at,
        clientes ( nombre, telefono ),
        vehiculos ( placa, marca, modelo, anio )
      `)
      .eq('empresa_id', EMPRESA_ID)
      .in('estado', ['completada', 'completado'])
      .order('created_at', { ascending: false })
      .limit(5);

    setOrdenesPendientes(pendientes || []);
    setOrdenesEnProceso(enProceso || []);
    setOrdenesCompletadas(completadas || []);

    if (enProceso && enProceso.length > 0) {
      setWorkstations(prev => {
        const updated = [...prev];
        enProceso.forEach((orden, index) => {
          if (index < updated.length) {
            updated[index] = {
              ...updated[index],
              orden,
              status: 'en-proceso',
              progress: 50
            };
          }
        });
        return updated;
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const handleStationAction = async (stationId: number, action: string) => {
    const station = workstations.find(s => s.id === stationId);
    if (!station || !station.orden) return;

    let newEstado = station.orden.estado;
    if (action === 'start') newEstado = 'en_proceso';
    if (action === 'complete') newEstado = 'completada';

    if (action === 'start' || action === 'complete') {
      await supabase
        .from('ordenes_trabajo')
        .update({ estado: newEstado })
        .eq('id', station.orden.id);
    }

    setWorkstations(prev => prev.map(s => {
      if (s.id === stationId) {
        switch (action) {
          case 'start':
            return { ...s, status: 'en-proceso' };
          case 'pause':
            return { ...s, status: 'pendiente' };
          case 'complete':
            return { ...s, status: 'completado', progress: 100 };
          case 'stop':
            return { ...s, status: 'disponible', orden: null, progress: 0 };
          default:
            return s;
        }
      }
      return s;
    }));

    if (action === 'stop' || action === 'complete') {
      fetchOrdenes();
    }
  };

  const handleProgressUpdate = (stationId: number, newProgress: number) => {
    setWorkstations(prev => prev.map(station =>
      station.id === stationId
        ? { ...station, progress: Math.min(100, Math.max(0, newProgress)) }
        : station
    ));
  };

  const handleAssignOrder = (orden: OrdenTrabajo) => {
    if (!selectedStation) return;

    setWorkstations(prev => prev.map(station =>
      station.id === selectedStation.id
        ? { ...station, orden, status: 'pendiente', progress: 0 }
        : station
    ));

    setOrdenesPendientes(prev => prev.filter(o => o.id !== orden.id));
    setShowAssignModal(false);
    setSelectedStation(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800 border-green-200';
      case 'en-proceso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completado': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'mantenimiento': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponible': return <CheckCircle className="w-5 h-5" />;
      case 'en-proceso': return <Wrench className="w-5 h-5" />;
      case 'completado': return <CheckCircle className="w-5 h-5" />;
      case 'pendiente': return <Clock className="w-5 h-5" />;
      case 'mantenimiento': return <AlertTriangle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const AssignWorkModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Asignar Trabajo a {selectedStation?.name}</h3>
          <button
            onClick={() => {
              setShowAssignModal(false);
              setSelectedStation(null);
            }}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            x
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Ordenes Pendientes ({ordenesPendientes.length})</h4>
            {ordenesPendientes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay ordenes pendientes</p>
            ) : (
              <div className="space-y-3">
                {ordenesPendientes.map(orden => (
                  <div key={orden.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{orden.numero_ot || '-'}</div>
                        <div className="text-sm text-gray-600">{orden.clientes?.nombre || 'Sin cliente'}</div>
                        <div className="text-sm text-gray-600">
                          {orden.vehiculos ? `${orden.vehiculos.marca || ''} ${orden.vehiculos.modelo || ''} - ${orden.vehiculos.placa || ''}` : 'Sin vehiculo'}
                        </div>
                        <div className="text-sm font-medium text-blue-600">{orden.descripcion || '-'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          ${(orden.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </div>
                        <button
                          onClick={() => handleAssignOrder(orden)}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Asignar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
          <button
            onClick={() => {
              setShowAssignModal(false);
              setSelectedStation(null);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando datos del taller...</span>
        </div>
      </div>
    );
  }

  const activeStations = workstations.filter(w => w.status === 'en-proceso').length;
  const completedToday = ordenesCompletadas.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control de Taller</h1>
          <p className="text-gray-600 mt-1">Gestion en tiempo real de estaciones de trabajo</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchOrdenes}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por cliente o orden de trabajo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estaciones Activas</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{activeStations}/6</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ordenes Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{ordenesPendientes.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completadas Hoy</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{completedToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Proceso</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{ordenesEnProceso.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Estaciones de Trabajo</h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workstations.map((station) => (
              <div key={station.id} className={`border-2 rounded-xl p-6 transition-all hover:shadow-lg ${getStatusColor(station.status)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      {getStatusIcon(station.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{station.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{station.status.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {station.orden ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Orden de Trabajo</p>
                      <p className="text-sm font-bold text-blue-600">{station.orden.numero_ot_ot || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Cliente</p>
                      <p className="text-sm text-gray-900">{station.orden.clientes?.nombre || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Vehiculo</p>
                      <p className="text-sm text-gray-900">
                        {station.orden.vehiculos
                          ? `${station.orden.vehiculos.marca || ''} ${station.orden.vehiculos.modelo || ''} - ${station.orden.vehiculos.placa || ''}`
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Servicio</p>
                      <p className="text-sm text-gray-900">{station.orden.descripcion || '-'}</p>
                    </div>

                    {(station.status === 'en-proceso' || station.status === 'pendiente') && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progreso</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleProgressUpdate(station.id, station.progress - 10)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="font-medium min-w-[3rem] text-center">{station.progress}%</span>
                            <button
                              onClick={() => handleProgressUpdate(station.id, station.progress + 10)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${station.progress === 100 ? 'bg-green-500' :
                              station.progress >= 50 ? 'bg-blue-500' :
                                'bg-yellow-500'
                              }`}
                            style={{ width: `${station.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-3 border-t border-gray-200">
                      {station.status === 'pendiente' && (
                        <button
                          onClick={() => handleStationAction(station.id, 'start')}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Play className="w-4 h-4" />
                          <span>Iniciar</span>
                        </button>
                      )}

                      {station.status === 'en-proceso' && (
                        <>
                          <button
                            onClick={() => handleStationAction(station.id, 'pause')}
                            className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Pause className="w-4 h-4" />
                            <span>Pausar</span>
                          </button>
                          <button
                            onClick={() => handleStationAction(station.id, 'complete')}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Completar</span>
                          </button>
                        </>
                      )}

                      {station.status === 'completado' && (
                        <button
                          onClick={() => handleStationAction(station.id, 'stop')}
                          className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Square className="w-4 h-4" />
                          <span>Liberar</span>
                        </button>
                      )}

                      <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      {station.status === 'disponible' ? 'Estacion disponible' : 'En mantenimiento'}
                    </p>
                    {station.status === 'disponible' && (
                      <button
                        onClick={() => {
                          setSelectedStation(station);
                          setShowAssignModal(true);
                        }}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Asignar Trabajo</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Ordenes Pendientes de Asignacion ({ordenesPendientes.length})</h3>
        </div>
        <div className="p-6">
          {ordenesPendientes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay ordenes pendientes de asignacion</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ordenesPendientes.map(orden => (
                <div key={orden.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-blue-600">{orden.numero_ot || '-'}</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      pendiente
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Cliente:</strong> {orden.clientes?.nombre || '-'}</div>
                    <div>
                      <strong>Vehiculo:</strong>{' '}
                      {orden.vehiculos
                        ? `${orden.vehiculos.marca || ''} ${orden.vehiculos.modelo || ''} - ${orden.vehiculos.placa || ''}`
                        : '-'}
                    </div>
                    <div><strong>Servicio:</strong> {orden.descripcion || '-'}</div>
                    <div className="flex justify-end">
                      <span className="font-semibold text-green-600">
                        ${(orden.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const availableStation = workstations.find(s => s.status === 'disponible');
                      if (availableStation) {
                        setSelectedStation(availableStation);
                        setShowAssignModal(true);
                      }
                    }}
                    className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Asignar a Estacion
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAssignModal && <AssignWorkModal />}
    </div>
  );
};

export default Workshop;
