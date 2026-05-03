import React, { useState } from 'react';
import { Save, Upload, Download, RefreshCw, Building, Globe, DollarSign, Calendar, Clock, Palette, Shield, Database, Mail, Printer, FileText, Settings as SettingsIcon, AlertTriangle, CheckCircle, X, Info } from 'lucide-react';

const GeneralParameters: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [parameters, setParameters] = useState({
    // Información de la Empresa
    companyName: 'GESTBOX - Sistema de Gestión',
    businessName: 'GESTBOX Talleres Mecánicos S.A.',
    taxId: 'RFC123456789',
    address: 'Av. Principal 123, Ciudad, País',
    phone: '+52 555 123 4567',
    email: 'info@gestbox.com',
    website: 'www.gestbox.com',
    logo: '',
    
    // Configuración Regional
    country: 'México',
    currency: 'MXN',
    currencySymbol: '$',
    timezone: 'America/Mexico_City',
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    
    // Configuración de Facturación
    invoicePrefix: 'FAC-',
    invoiceStartNumber: 1,
    invoiceDigits: 6,
    taxRate: 16,
    enableElectronicInvoicing: false,
    invoiceTemplate: 'standard',
    invoiceFooter: 'Gracias por su preferencia',
    
    // Configuración de Taller
    workshopName: 'Taller Mecánico GESTBOX',
    maxConcurrentJobs: 6,
    defaultAppointmentDuration: 60,
    workingHours: {
      start: '08:00',
      end: '18:00'
    },
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    
    // Configuración de Inventario
    lowStockThreshold: 10,
    autoReorderEnabled: false,
    stockValuationMethod: 'FIFO',
    enableBarcodeScanning: true,
    defaultUnit: 'Unid',
    
    // Configuración de Sistema
    systemName: 'GESTBOX',
    version: '2.1.0',
    maintenanceMode: false,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    
    // Configuración de Notificaciones
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    appointmentReminders: true,
    paymentDueAlerts: true,
    
    // Configuración de Apariencia
    theme: 'light',
    primaryColor: '#0891b2',
    secondaryColor: '#64748b',
    accentColor: '#06b6d4',
    logoPosition: 'left',
    showCompanyInfo: true
  });

  const tabs = [
    { id: 'company', name: 'Empresa', icon: Building },
    { id: 'regional', name: 'Regional', icon: Globe },
    { id: 'invoicing', name: 'Facturación', icon: FileText },
    { id: 'workshop', name: 'Taller', icon: SettingsIcon },
    { id: 'inventory', name: 'Inventario', icon: Database },
    { id: 'system', name: 'Sistema', icon: Shield },
    { id: 'notifications', name: 'Notificaciones', icon: Mail },
    { id: 'appearance', name: 'Apariencia', icon: Palette }
  ];

  const handleParameterChange = (key: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedParameterChange = (parent: string, key: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveParameters = () => {
    console.log('Guardando parámetros generales:', parameters);
    setShowSaveModal(true);
    setTimeout(() => setShowSaveModal(false), 2000);
  };

  const handleExportParameters = () => {
    const dataStr = JSON.stringify(parameters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'gestbox-parameters.json';
    
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
            Parámetros Guardados
          </h3>
          <p className="text-gray-600">
            Los parámetros generales se han actualizado correctamente
          </p>
        </div>
      </div>
    </div>
  );

  const renderCompanyTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Información de la Empresa</h4>
        <p className="text-sm text-blue-700">
          Configure los datos básicos de su empresa que aparecerán en documentos oficiales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Comercial *
          </label>
          <input
            type="text"
            value={parameters.companyName}
            onChange={(e) => handleParameterChange('companyName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Razón Social *
          </label>
          <input
            type="text"
            value={parameters.businessName}
            onChange={(e) => handleParameterChange('businessName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RFC / ID Fiscal *
          </label>
          <input
            type="text"
            value={parameters.taxId}
            onChange={(e) => handleParameterChange('taxId', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono Principal *
          </label>
          <input
            type="text"
            value={parameters.phone}
            onChange={(e) => handleParameterChange('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección Fiscal *
        </label>
        <textarea
          rows={3}
          value={parameters.address}
          onChange={(e) => handleParameterChange('address', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Corporativo
          </label>
          <input
            type="email"
            value={parameters.email}
            onChange={(e) => handleParameterChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sitio Web
          </label>
          <input
            type="url"
            value={parameters.website}
            onChange={(e) => handleParameterChange('website', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo de la Empresa
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Arrastra tu logo aquí o haz clic para seleccionar</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 2MB</p>
        </div>
      </div>
    </div>
  );

  const renderRegionalTab = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Configuración Regional</h4>
        <p className="text-sm text-green-700">
          Configure los parámetros regionales que afectan formatos y monedas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            País
          </label>
          <select
            value={parameters.country}
            onChange={(e) => handleParameterChange('country', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="México">México</option>
            <option value="Colombia">Colombia</option>
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
            <option value="Perú">Perú</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Idioma
          </label>
          <select
            value={parameters.language}
            onChange={(e) => handleParameterChange('language', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Moneda
          </label>
          <select
            value={parameters.currency}
            onChange={(e) => handleParameterChange('currency', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="MXN">Peso Mexicano (MXN)</option>
            <option value="USD">Dólar Americano (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="COP">Peso Colombiano (COP)</option>
            <option value="ARS">Peso Argentino (ARS)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Símbolo de Moneda
          </label>
          <input
            type="text"
            value={parameters.currencySymbol}
            onChange={(e) => handleParameterChange('currencySymbol', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zona Horaria
          </label>
          <select
            value={parameters.timezone}
            onChange={(e) => handleParameterChange('timezone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/Mexico_City">México (GMT-6)</option>
            <option value="America/Bogota">Colombia (GMT-5)</option>
            <option value="America/Argentina/Buenos_Aires">Argentina (GMT-3)</option>
            <option value="America/Santiago">Chile (GMT-3)</option>
            <option value="America/Lima">Perú (GMT-5)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Formato de Fecha
          </label>
          <select
            value={parameters.dateFormat}
            onChange={(e) => handleParameterChange('dateFormat', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Formato de Hora
          </label>
          <select
            value={parameters.timeFormat}
            onChange={(e) => handleParameterChange('timeFormat', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">24 Horas (14:30)</option>
            <option value="12h">12 Horas (2:30 PM)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderInvoicingTab = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-2">Configuración de Facturación</h4>
        <p className="text-sm text-purple-700">
          Configure los parámetros para la generación de facturas y documentos fiscales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prefijo de Factura
          </label>
          <input
            type="text"
            value={parameters.invoicePrefix}
            onChange={(e) => handleParameterChange('invoicePrefix', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número Inicial
          </label>
          <input
            type="number"
            value={parameters.invoiceStartNumber}
            onChange={(e) => handleParameterChange('invoiceStartNumber', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dígitos en Numeración
          </label>
          <select
            value={parameters.invoiceDigits}
            onChange={(e) => handleParameterChange('invoiceDigits', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={4}>4 dígitos (0001)</option>
            <option value={5}>5 dígitos (00001)</option>
            <option value={6}>6 dígitos (000001)</option>
            <option value={7}>7 dígitos (0000001)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tasa de Impuesto (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={parameters.taxRate}
            onChange={(e) => handleParameterChange('taxRate', parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plantilla de Factura
          </label>
          <select
            value={parameters.invoiceTemplate}
            onChange={(e) => handleParameterChange('invoiceTemplate', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="standard">Estándar</option>
            <option value="modern">Moderna</option>
            <option value="classic">Clásica</option>
            <option value="minimal">Minimalista</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pie de Página de Facturas
        </label>
        <textarea
          rows={3}
          value={parameters.invoiceFooter}
          onChange={(e) => handleParameterChange('invoiceFooter', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Mensaje que aparecerá al final de las facturas"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h5 className="font-medium text-gray-900">Facturación Electrónica</h5>
          <p className="text-sm text-gray-600">Habilitar generación de facturas electrónicas</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={parameters.enableElectronicInvoicing}
            onChange={(e) => handleParameterChange('enableElectronicInvoicing', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderWorkshopTab = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-medium text-orange-900 mb-2">Configuración del Taller</h4>
        <p className="text-sm text-orange-700">
          Configure los parámetros operativos del taller mecánico.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Taller
        </label>
        <input
          type="text"
          value={parameters.workshopName}
          onChange={(e) => handleParameterChange('workshopName', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trabajos Simultáneos Máximos
          </label>
          <input
            type="number"
            value={parameters.maxConcurrentJobs}
            onChange={(e) => handleParameterChange('maxConcurrentJobs', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración Cita por Defecto (min)
          </label>
          <select
            value={parameters.defaultAppointmentDuration}
            onChange={(e) => handleParameterChange('defaultAppointmentDuration', parseInt(e.target.value))}
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
            Umbral Stock Bajo
          </label>
          <input
            type="number"
            value={parameters.lowStockThreshold}
            onChange={(e) => handleParameterChange('lowStockThreshold', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de Inicio
          </label>
          <input
            type="time"
            value={parameters.workingHours.start}
            onChange={(e) => handleNestedParameterChange('workingHours', 'start', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de Cierre
          </label>
          <input
            type="time"
            value={parameters.workingHours.end}
            onChange={(e) => handleNestedParameterChange('workingHours', 'end', e.target.value)}
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
                checked={parameters.workingDays.includes(day.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleParameterChange('workingDays', [...parameters.workingDays, day.id]);
                  } else {
                    handleParameterChange('workingDays', parameters.workingDays.filter(d => d !== day.id));
                  }
                }}
                className="text-blue-600"
              />
              <span className="text-sm">{day.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-900 mb-2">Configuración del Sistema</h4>
        <p className="text-sm text-red-700">
          Parámetros críticos del sistema. Modifique con precaución.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Sistema
          </label>
          <input
            type="text"
            value={parameters.systemName}
            onChange={(e) => handleParameterChange('systemName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Versión
          </label>
          <input
            type="text"
            value={parameters.version}
            onChange={(e) => handleParameterChange('version', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiempo de Sesión (minutos)
          </label>
          <input
            type="number"
            value={parameters.sessionTimeout}
            onChange={(e) => handleParameterChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frecuencia de Respaldo
          </label>
          <select
            value={parameters.backupFrequency}
            onChange={(e) => handleParameterChange('backupFrequency', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="hourly">Cada Hora</option>
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h5 className="font-medium text-gray-900">Modo Mantenimiento</h5>
          <p className="text-sm text-gray-600">Deshabilitar acceso al sistema para mantenimiento</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={parameters.maintenanceMode}
            onChange={(e) => handleParameterChange('maintenanceMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return renderCompanyTab();
      case 'regional':
        return renderRegionalTab();
      case 'invoicing':
        return renderInvoicingTab();
      case 'workshop':
        return renderWorkshopTab();
      case 'system':
        return renderSystemTab();
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
          <h1 className="text-2xl font-bold text-gray-900">Parámetros Generales</h1>
          <p className="text-gray-600 mt-1">Configuración global del sistema</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportParameters}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          <button
            onClick={handleSaveParameters}
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
            <h4 className="font-medium text-yellow-800">Configuración Crítica</h4>
            <p className="text-sm text-yellow-700">
              Estos parámetros afectan el funcionamiento global del sistema. Los cambios se aplicarán inmediatamente.
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
          <h3 className="font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Base de Datos</span>
              <span className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Conectada
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Último Respaldo</span>
              <span className="text-sm font-medium">Hoy 03:00 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Usuarios Activos</span>
              <span className="text-sm font-medium">8</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Configuración Actual</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Empresa:</span>
              <span className="font-medium">{parameters.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Moneda:</span>
              <span className="font-medium">{parameters.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Zona Horaria:</span>
              <span className="font-medium">{parameters.timezone.split('/')[1]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Idioma:</span>
              <span className="font-medium">{parameters.language.toUpperCase()}</span>
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

export default GeneralParameters;