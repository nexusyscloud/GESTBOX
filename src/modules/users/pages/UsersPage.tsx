import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, User, Edit, UserX, Loader2, AlertCircle, X, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

type UserStatus = 'activo' | 'inactivo';

type UserRole = 'Administrador' | 'Asesor' | 'Técnico' | 'Recepcionista';

type UserType = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  permissions: Record<string, boolean>;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};

const DEFAULT_PERMISSIONS: Record<UserRole, Record<string, boolean>> = {
  Administrador: {
    dashboard: true,
    clients: true,
    vehicles: true,
    'vehicle-reception': true,
    'work-orders': true,
    users: true,
    settings: true
  },
  Asesor: {
    dashboard: true,
    clients: true,
    vehicles: true,
    'vehicle-reception': true,
    'work-orders': true,
    users: false,
    settings: false
  },
  Técnico: {
    dashboard: true,
    clients: false,
    vehicles: true,
    'vehicle-reception': false,
    'work-orders': true,
    users: false,
    settings: false
  },
  Recepcionista: {
    dashboard: true,
    clients: true,
    vehicles: true,
    'vehicle-reception': true,
    'work-orders': true,
    users: false,
    settings: false
  }
};

const ROLE_OPTIONS: UserRole[] = ['Administrador', 'Asesor', 'Técnico', 'Recepcionista'];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  role: 'Recepcionista' as UserRole,
  status: 'activo' as UserStatus
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('id, name, email, phone, role, status, permissions, last_login, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setUsers(data || []);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return users;

    return users.filter(user =>
      [user.name, user.email, user.phone, user.role, user.status]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(term))
    );
  }, [users, searchTerm]);

  const openCreateModal = () => {
    setSelectedUser(null);
    setFormData(emptyForm);
    setShowModal(true);
    setError(null);
  };

  const openEditModal = (user: UserType) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: (ROLE_OPTIONS.includes(user.role as UserRole) ? user.role : 'Recepcionista') as UserRole,
      status: (user.status === 'inactivo' ? 'inactivo' : 'activo') as UserStatus
    });
    setShowModal(true);
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'El nombre es obligatorio.';
    if (!formData.email.trim()) return 'El email es obligatorio.';
    if (!formData.role.trim()) return 'El rol es obligatorio.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) return 'El email no tiene un formato válido.';

    return null;
  };

  const handleSaveUser = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        role: formData.role,
        status: formData.status,
        permissions: DEFAULT_PERMISSIONS[formData.role]
      };

      if (selectedUser) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            ...payload,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedUser.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('users')
          .insert(payload);

        if (insertError) throw insertError;
      }

      await loadUsers();
      setShowModal(false);
      setSelectedUser(null);
      setFormData(emptyForm);
    } catch (err: any) {
      console.error('Error guardando usuario:', err);
      setError(err?.message || 'No se pudo guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateUser = async (user: UserType) => {
    if (!confirm(`¿Deseas inactivar al usuario ${user.name}?`)) return;

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('users')
        .update({
          status: 'inactivo',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await loadUsers();
    } catch (err: any) {
      console.error('Error inactivando usuario:', err);
      setError(err?.message || 'No se pudo inactivar el usuario.');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador':
        return 'bg-purple-100 text-purple-800';
      case 'Asesor':
        return 'bg-blue-100 text-blue-800';
      case 'Técnico':
        return 'bg-orange-100 text-orange-800';
      case 'Recepcionista':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'activo'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Administración básica de usuarios del sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">Usuarios</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">Activos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {users.filter(user => user.status === 'activo').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">Administradores</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {users.filter(user => user.role === 'Administrador').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre, email, teléfono o rol..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex items-center justify-center text-gray-500">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Cargando usuarios...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron usuarios.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map(user => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.phone && (
                      <p className="text-xs text-gray-400">{user.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => openEditModal(user)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Editar usuario"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {user.status === 'activo' && (
                    <button
                      type="button"
                      onClick={() => handleDeactivateUser(user)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Inactivar usuario"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedUser ? 'Editar usuario' : 'Nuevo usuario'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData(prev => ({ ...prev, name: event.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData(prev => ({ ...prev, email: event.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData(prev => ({ ...prev, phone: event.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(event) => setFormData(prev => ({
                      ...prev,
                      role: event.target.value as UserRole
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ROLE_OPTIONS.map(role => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(event) => setFormData(prev => ({
                      ...prev,
                      status: event.target.value as UserStatus
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveUser}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
