import React, { useState } from 'react';
import { Save, Info, ChevronDown } from 'lucide-react';

const ScheduleConfiguration: React.FC = () => {
  const [selectedMechanic, setSelectedMechanic] = useState('Demo');
  const [scheduleData, setScheduleData] = useState({
    domingo: { startTime: '8:00 AM', endTime: '5:30 PM', enabled: true },
    lunes: { startTime: '8:00 AM', endTime: '5:30 PM', enabled: true },
    martes: { startTime: '8:00 AM', endTime: '5:30 PM', enabled: true },
    miercoles: { startTime: '8:00 AM', endTime: '5:30 PM', enabled: true },
    jueves: { startTime: '8:00 AM', endTime: '5:30 PM', enabled: true },
    viernes: { startTime: '8:00 AM', endTime: '5:30 PM', enabled: true },
    sabado: { startTime: '8:00 AM', endTime: '12:30 MD', enabled: true }
  });

  const mechanics = [
    'Demo',
    'Carlos Méndez',
    'Roberto Silva',
    'Miguel Torres',
    'Luis Ramírez',
    'Ana Fernández'
  ];

  const timeOptions = [
    '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM', '10:00 PM', '12:30 MD'
  ];

  const daysOfWeek = [
    { key: 'domingo', label: 'Domingo' },
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' }
  ];

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleToggleDay = (day: string) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        enabled: !prev[day as keyof typeof prev].enabled
      }
    }));
  };

  const handleSave = () => {
    console.log('Guardando configuración de horarios:', {
      mechanic: selectedMechanic,
      schedule: scheduleData
    });
    // Aquí iría la lógica para guardar en la base de datos
    alert('Configuración de horarios guardada exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración de horarios</h1>
        <p className="text-gray-600 mt-1">Panel configuración de horarios</p>
      </div>

      {/* Alert Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800">Nota:</p>
            <p className="text-sm text-yellow-700">
              configure el horario para cada uno de los mecánicos para poder asignar citas tanto desde la aplicación como Web.
            </p>
          </div>
        </div>
      </div>

      {/* Main Configuration Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Mechanic Selector */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <select
              value={selectedMechanic}
              onChange={(e) => setSelectedMechanic(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {mechanics.map(mechanic => (
                <option key={mechanic} value={mechanic}>{mechanic}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Schedule Table */}
        <div className="p-6">
          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-sm font-medium text-gray-700">Días de la semana</div>
              <div className="text-sm font-medium text-gray-700">Hora Inicio</div>
              <div className="text-sm font-medium text-gray-700">Hora Final</div>
              <div className="text-sm font-medium text-gray-700">Habilitar</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-3">
              {daysOfWeek.map((day) => (
                <div key={day.key} className="grid grid-cols-4 gap-4 items-center py-2">
                  {/* Day Name */}
                  <div className="text-sm text-gray-900 font-medium">
                    {day.label}
                  </div>

                  {/* Start Time */}
                  <div className="relative">
                    <select
                      value={scheduleData[day.key as keyof typeof scheduleData].startTime}
                      onChange={(e) => handleTimeChange(day.key, 'startTime', e.target.value)}
                      disabled={!scheduleData[day.key as keyof typeof scheduleData].enabled}
                      className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* End Time */}
                  <div className="relative">
                    <select
                      value={scheduleData[day.key as keyof typeof scheduleData].endTime}
                      onChange={(e) => handleTimeChange(day.key, 'endTime', e.target.value)}
                      disabled={!scheduleData[day.key as keyof typeof scheduleData].enabled}
                      className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Enable Toggle */}
                  <div className="flex justify-start">
                    <button
                      onClick={() => handleToggleDay(day.key)}
                      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        scheduleData[day.key as keyof typeof scheduleData].enabled
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          scheduleData[day.key as keyof typeof scheduleData].enabled
                            ? 'translate-x-9'
                            : 'translate-x-1'
                        }`}
                      />
                      <span
                        className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${
                          scheduleData[day.key as keyof typeof scheduleData].enabled
                            ? 'text-white'
                            : 'text-gray-600'
                        }`}
                      >
                        {scheduleData[day.key as keyof typeof scheduleData].enabled ? 'On' : 'Off'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
          >
            <Save className="w-4 h-4" />
            <span>Guardar</span>
          </button>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Información Adicional</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Los horarios configurados se aplicarán para el agendamiento de citas</li>
          <li>• Puede deshabilitar días específicos usando el toggle "On/Off"</li>
          <li>• Los cambios se guardan automáticamente al presionar "Guardar"</li>
          <li>• Configure horarios diferentes para cada mecánico según su disponibilidad</li>
        </ul>
      </div>
    </div>
  );
};

export default ScheduleConfiguration;