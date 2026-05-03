import React, { useState } from 'react';
import { Save, Upload, Download, RefreshCw, Shield, Database, Mail, Bell, Palette, Globe, Key, Users, Building, Calendar, DollarSign, Printer, FileText, Settings as SettingsIcon, AlertTriangle, CheckCircle, X, Package } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [settings, setSettings] = useState({
    // Configuración General
    companyName: 'GESTBOX - Sistema de Gestión',
    companyAddress: 'Av. Principal 123, Ciudad, País',
    companyPhone: '+52 555 123 4567',
    companyEmail: 'info@gestbox.com',
    companyWebsite: 'www.gestbox.com',
    taxId: 'RFC123456789',
    currency: 'MXN',
    timezone: 'America/Mexico_City',
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    
    // Configuración de Seguridad
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChars: true,
    enableTwoFactor: false,
    maxLoginAttempts: 3,
    lockoutDuration: 15,
    
    // Configuración de Base de Datos
    backupFrequency: 'daily',
    retentionDays: 30,
    autoBackup: true,
    compressionEnabled: true,
    
    // Configuración de Email
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    emailFrom: 'noreply@gestbox.com',
    enableEmailNotifications: true,
    
    // Configuración de Notificaciones
    lowStockAlert: true,
    appointmentReminders: true,
    paymentDueAlerts: true,
    systemMaintenanceAlerts: true,
    
    // Configuración de Facturación
    invoicePrefix: 'FAC-',
    invoiceStartNumber: 1,
    taxRate: 16,
    enableElectronicInvoicing: false,
    invoiceTemplate: 'standard',
    
    // Configuración de Taller
    workingHours: {
      start: '08:00',
      end: '18:00'
    },
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    appointmentDuration: 60,
    maxConcurrentJobs: 6,
    
    // Configuración de Inventario
    lowStockThreshold: 10,
    autoReorderEnabled: false,
    stockValuationMethod: 'FIFO',
    enableBarcodeScanning: true
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Building },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'database', name: 'Base de Datos', icon: Database },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'invoicing', name: 'Facturación', icon: FileText },
    { id: 'workshop', name: 'Taller', icon: SettingsIcon },
    { id: 'inventory', name: 'Inventario', icon: Package },
    { id: 'appearance', name: 'Apariencia', icon: Palette }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedSettingChange = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Aquí iría la lógica para guardar las configuraciones
    console.log('Guardando configuraciones:', settings);
    setShowSaveModal(true);
    setTimeout(() => setShowSaveModal(false), 2000);
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'gestbox-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const SaveModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Configuración Guardada
          </h3>
          <p className="text-gray-600">
            Los cambios se han aplicado correctamente
          </p>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Información de la Empresa</h4>
        <p className="text-sm text-blue-700">
          Configura los datos básicos de tu empresa que aparecerán en facturas y documentos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Empresa
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => handleSettingChange('companyName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RFC / ID Fiscal
          </label>
          <input
            type="text"
            value={settings.taxId}
            onChange={(e) => handleSettingChange('taxId', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <textarea
          rows={3}
          value={settings.companyAddress}
          onChange={(e) => handleSettingChange('companyAddress', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="text"
            value={settings.companyPhone}
            onChange={(e) => handleSettingChange('companyPhone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={settings.companyEmail}
            onChange={(e) => handleSettingChange('companyEmail', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Moneda
          </label>
          <select
            value={settings.currency}
            onChange={(e) => handleSettingChange('currency', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="MXN">Peso Mexicano (MXN)</option>
            <option value="USD">Dólar Americano (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="COP">Peso Colombiano (COP)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zona Horaria
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/Mexico_City">México (GMT-6)</option>
            <option value="America/Bogota">Colombia (GMT-5)</option>
            <option value="America/New_York">Nueva York (GMT-5)</option>
            <option value="Europe/Madrid">Madrid (GMT+1)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Formato de Fecha
          </label>
          <select
            value={settings.dateFormat}
            onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-900 mb-2">Configuración de Seguridad</h4>
        <p className="text-sm text-red-700">
          Estas configuraciones afectan la seguridad de todo el sistema. Modifica con precaución.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiempo de Sesión (minutos)
          </label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitud Mínima de Contraseña
          </label>
          <input
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Requerir Caracteres Especiales</h5>
            <p className="text-sm text-gray-600">Las contraseñas deben incluir símbolos especiales</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requireSpecialChars}
              onChange={(e) => handleSettingChange('requireSpecialChars', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Autenticación de Dos Factores</h5>
            <p className="text-sm text-gray-600">Requiere verificación adicional para acceder</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableTwoFactor}
              onChange={(e) => handleSettingChange('enableTwoFactor', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Máximo Intentos de Login
          </label>
          <input
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración de Bloqueo (minutos)
          </label>
          <input
            type="number"
            value={settings.lockoutDuration}
            onChange={(e) => handleSettingChange('lockoutDuration', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Respaldos y Mantenimiento</h4>
        <p className="text-sm text-green-700">
          Configura los respaldos automáticos para proteger tu información.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frecuencia de Respaldo
          </label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="hourly">Cada Hora</option>
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Días de Retención
          </label>
          <input
            type="number"
            value={settings.retentionDays}
            onChange={(e) => handleSettingChange('retentionDays', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Respaldo Automático</h5>
            <p className="text-sm text-gray-600">Ejecutar respaldos según la frecuencia configurada</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Compresión de Respaldos</h5>
            <p className="text-sm text-gray-600">Comprimir archivos de respaldo para ahorrar espacio</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.compressionEnabled}
              onChange={(e) => handleSettingChange('compressionEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="flex space-x-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Crear Respaldo Manual</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Restaurar Respaldo</span>
        </button>
      </div>
    </div>
  );

  const renderWorkshopSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Configuración del Taller</h4>
        <p className="text-sm text-blue-700">
          Define los horarios de trabajo y capacidad operativa del taller.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de Inicio
          </label>
          <input
            type="time"
            value={settings.workingHours.start}
            onChange={(e) => handleNestedSettingChange('workingHours', 'start', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de Cierre
          </label>
          <input
            type="time"
            value={settings.workingHours.end}
            onChange={(e) => handleNestedSettingChange('workingHours', 'end', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Días de Trabajo
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'monday', name: 'Lunes' },
            { id: 'tuesday', name: 'Martes' },
            { id: 'wednesday', name: 'Miércoles' },
            { id: 'thursday', name: 'Jueves' },
            { id: 'friday', name: 'Viernes' },
            { id: 'saturday', name: 'Sábado' },
            { id: 'sunday', name: 'Domingo' }
          ].map(day => (
            <label key={day.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={settings.workingDays.includes(day.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleSettingChange('workingDays', [...settings.workingDays, day.id]);
                  } else {
                    handleSettingChange('workingDays', settings.workingDays.filter(d => d !== day.id));
                  }
                }}
                className="text-blue-600"
              />
              <span className="text-sm">{day.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración de Cita (minutos)
          </label>
          <select
            value={settings.appointmentDuration}
            onChange={(e) => handleSettingChange('appointmentDuration', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={30}>30 minutos</option>
            <option value={60}>1 hora</option>
            <option value={90}>1.5 horas</option>
            <option value={120}>2 horas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trabajos Simultáneos Máximos
          </label>
          <input
            type="number"
            value={settings.maxConcurrentJobs}
            onChange={(e) => handleSettingChange('maxConcurrentJobs', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'database':
        return renderDatabaseSettings();
      case 'workshop':
        return renderWorkshopSettings();
      default:
        return (
          <div className="text-center py-12">
            <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Configuración en Desarrollo
            </h3>
            <p className="text-gray-600">
              Esta sección estará disponible próximamente
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-1">Panel de configuración para usuario master</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportSettings}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          <button
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <div>
            <h4 className="font-medium text-yellow-800">Acceso Restringido</h4>
            <p className="text-sm text-yellow-700">
              Solo usuarios con permisos de administrador pueden modificar estas configuraciones.
              Los cambios afectan todo el sistema.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* System Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Información del Sistema</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Versión:</span>
              <span className="font-medium">GESTBOX v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base de Datos:</span>
              <span className="font-medium">PostgreSQL 14.2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Último Respaldo:</span>
              <span className="font-medium">Hoy 03:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Usuarios Activos:</span>
              <span className="font-medium">8</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Servidor</span>
              <span className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Base de Datos</span>
              <span className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Conectada
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email</span>
              <span className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Configurado
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Respaldos</span>
              <span className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Activos
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Reiniciar Sistema</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Database className="w-4 h-4" />
              <span>Optimizar BD</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <FileText className="w-4 h-4" />
              <span>Ver Logs</span>
            </button>
          </div>
        </div>
      </div>

      {showSaveModal && <SaveModal />}
    </div>
  );
};

export default Settings;