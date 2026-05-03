import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, User, Mail, Phone, Shield, Settings, Check, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserType {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  last_login: string | null;
  permissions: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('Cargando usuarios desde Supabase...');

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Respuesta de carga:', { data, error });

      if (error) {
        console.error('Error al cargar:', error);
        throw error;
      }

      console.log(`Usuarios cargados: ${data?.length || 0}`);
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error completo al cargar usuarios:', error);
      alert(`Error al cargar usuarios: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (formData: any) => {
    try {
      setSaving(true);

      // Validación
      if (!formData.name || !formData.email || !formData.role) {
        alert('Por favor completa todos los campos requeridos (Nombre, Email y Rol)');
        setSaving(false);
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Por favor ingresa un email válido');
        setSaving(false);
        return;
      }

      console.log('Guardando usuario:', formData);

      if (selectedUser) {
        const { data, error } = await supabase
          .from('users')
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            role: formData.role,
            status: formData.status,
            permissions: formData.permissions
          })
          .eq('id', selectedUser.id)
          .select();

        console.log('Respuesta de actualización:', { data, error });

        if (error) {
          console.error('Error de Supabase:', error);
          throw error;
        }
        alert('Usuario actualizado correctamente');
      } else {
        const { data, error } = await supabase
          .from('users')
          .insert({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            role: formData.role,
            status: formData.status,
            permissions: formData.permissions
          })
          .select();

        console.log('Respuesta de inserción:', { data, error });

        if (error) {
          console.error('Error de Supabase:', error);
          throw error;
        }
        alert('Usuario creado correctamente');
      }

      await loadUsers();
      setShowModal(false);
      setSelectedUser(null);
      setActiveTab('info');
    } catch (error: any) {
      console.error('Error completo al guardar usuario:', error);
      alert(`Error al guardar usuario: ${error.message || 'Error desconocido'}\n\nRevisa la consola del navegador para más detalles.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      alert('Usuario eliminado correctamente');
      await loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Error al eliminar usuario');
    }
  };

  const menuOptions = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'appointments', name: 'Citas', icon: '📅' },
    { id: 'workshop', name: 'Taller', icon: '🔧' },
    { id: 'sales', name: 'Ventas', icon: '💰' },
    { id: 'inventory', name: 'Inventario', icon: '📦' },
    { id: 'clients', name: 'Clientes', icon: '👥' },
    { id: 'invoicing', name: 'Facturación', icon: '📄' },
    { id: 'accounting', name: 'Contabilidad', icon: '🧮' },
    { id: 'banks', name: 'Bancos', icon: '🏦' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
    { id: 'employees', name: 'Empleados', icon: '👨‍💼' },
    { id: 'reports', name: 'Reportes', icon: '📊' },
    { id: 'users', name: 'Usuarios', icon: '👤' },
    { id: 'settings', name: 'Configuración', icon: '⚙️' }
  ];

  const roles = ['Administrador', 'Técnico', 'Recepcionista', 'Contador', 'Vendedor'];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      case 'suspendido': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador': return 'bg-purple-100 text-purple-800';
      case 'Técnico': return 'bg-blue-100 text-blue-800';
      case 'Recepcionista': return 'bg-green-100 text-green-800';
      case 'Contador': return 'bg-orange-100 text-orange-800';
      case 'Vendedor': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const UserModal = () => {
    const [formData, setFormData] = useState({
      name: selectedUser?.name || '',
      email: selectedUser?.email || '',
      phone: selectedUser?.phone || '',
      role: selectedUser?.role || '',
      status: selectedUser?.status || 'activo',
      password: '',
      confirmPassword: '',
      permissions: selectedUser?.permissions || {}
    });

    const handleInputChange = (field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handlePermissionChange = (permission: string, value: boolean) => {
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permission]: value
        }
      }));
    };

    const handleRoleChange = (role: string) => {
      let defaultPermissions = {};
      
      switch (role) {
        case 'Administrador':
          defaultPermissions = Object.fromEntries(menuOptions.map(option => [option.id, true]));
          break;
        case 'Técnico':
          defaultPermissions = {
            dashboard: true,
            appointments: true,
            workshop: true,
            inventory: true,
            clients: true,
            reports: true,
            sales: false,
            invoicing: false,
            accounting: false,
            banks: false,
            marketing: false,
            employees: false,
            users: false,
            settings: false
          };
          break;
        case 'Recepcionista':
          defaultPermissions = {
            dashboard: true,
            appointments: true,
            clients: true,
            sales: true,
            invoicing: true,
            workshop: false,
            inventory: false,
            accounting: false,
            banks: false,
            marketing: false,
            employees: false,
            reports: false,
            users: false,
            settings: false
          };
          break;
        default:
          defaultPermissions = Object.fromEntries(menuOptions.map(option => [option.id, false]));
      }

      setFormData(prev => ({
        ...prev,
        role,
        permissions: defaultPermissions
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                  setActiveTab('info');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'permissions'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Permisos del Menú
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'info' && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre completo del usuario"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="correo@gestbox.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+52 555 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar rol</option>
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña {!selectedUser && '*'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={selectedUser ? 'Dejar vacío para mantener actual' : 'Contraseña segura'}
                      required={!selectedUser}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Contraseña {!selectedUser && '*'}
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirmar contraseña"
                      required={!selectedUser}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>
              </form>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Asignación de Permisos del Menú</h4>
                  <p className="text-sm text-blue-700">
                    Selecciona las opciones del menú a las que este usuario tendrá acceso. 
                    Los permisos se asignan automáticamente según el rol seleccionado, pero puedes personalizarlos.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuOptions.map(option => (
                    <div key={option.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-sm font-medium text-gray-900">{option.name}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions[option.id] || false}
                          onChange={(e) => handlePermissionChange(option.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Resumen de Permisos</h5>
                  <div className="flex flex-wrap gap-2">
                    {menuOptions.filter(option => formData.permissions[option.id]).map(option => (
                      <span key={option.id} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <Check className="w-3 h-3 mr-1" />
                        {option.name}
                      </span>
                    ))}
                  </div>
                  {menuOptions.filter(option => formData.permissions[option.id]).length === 0 && (
                    <p className="text-sm text-gray-500">No hay permisos asignados</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                  setActiveTab('info');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSaveUser(formData)}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{selectedUser ? 'Actualizar' : 'Crear'} Usuario</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {users.filter(user => user.status === 'activo').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {users.filter(user => user.role === 'Administrador').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Roles Diferentes</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                {new Set(users.map(user => user.role)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar usuarios por nombre, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Cargando usuarios...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {user.last_login ? new Date(user.last_login).toLocaleString('es-MX') : 'Nunca'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="text-gray-600 hover:text-gray-700 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <UserModal />}
    </div>
  );
};

export default Users;