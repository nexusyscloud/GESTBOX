import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Phone, Mail, MapPin, Star } from 'lucide-react';

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const employees = [
    {
      id: 1,
      name: 'Carlos Méndez García',
      position: 'Mecánico Senior',
      department: 'Taller',
      email: 'carlos.mendez@gestbox.com',
      phone: '+52 555 123 4567',
      address: 'Av. Revolución 456, Col. San Ángel, CDMX',
      hireDate: '2020-03-15',
      salary: 18500,
      specialties: ['Motor', 'Transmisión', 'Diagnóstico'],
      rating: 4.8,
      completedJobs: 156,
      status: 'activo'
    },
    {
      id: 2,
      name: 'Roberto Silva Jiménez',
      position: 'Mecánico Junior',
      department: 'Taller',
      email: 'roberto.silva@gestbox.com',
      phone: '+52 555 234 5678',
      address: 'Calle Morelos 789, Col. Centro, CDMX',
      hireDate: '2022-01-10',
      salary: 12500,
      specialties: ['Frenos', 'Suspensión', 'Llantas'],
      rating: 4.5,
      completedJobs: 89,
      status: 'activo'
    },
    {
      id: 3,
      name: 'Miguel Torres López',
      position: 'Especialista Eléctrico',
      department: 'Taller',
      email: 'miguel.torres@gestbox.com',
      phone: '+52 555 345 6789',
      address: 'Blvd. Insurgentes 321, Col. Roma Norte, CDMX',
      hireDate: '2021-06-20',
      salary: 16800,
      specialties: ['Sistema Eléctrico', 'Aire Acondicionado', 'Audio'],
      rating: 4.9,
      completedJobs: 134,
      status: 'activo'
    },
    {
      id: 4,
      name: 'Luis Ramírez Vega',
      position: 'Auxiliar de Taller',
      department: 'Taller',
      email: 'luis.ramirez@gestbox.com',
      phone: '+52 555 456 7890',
      address: 'Av. Universidad 654, Col. Del Valle, CDMX',
      hireDate: '2023-02-01',
      salary: 10500,
      specialties: ['Mantenimiento Básico', 'Cambio de Aceite'],
      rating: 4.2,
      completedJobs: 45,
      status: 'activo'
    },
    {
      id: 5,
      name: 'Ana Fernández Cruz',
      position: 'Recepcionista',
      department: 'Administración',
      email: 'ana.fernandez@gestbox.com',
      phone: '+52 555 567 8901',
      address: 'Calle Juárez 987, Col. Doctores, CDMX',
      hireDate: '2021-09-15',
      salary: 9500,
      specialties: ['Atención al Cliente', 'Facturación'],
      rating: 4.7,
      completedJobs: 0,
      status: 'activo'
    },
  ];

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      case 'vacaciones': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Taller': return 'bg-blue-100 text-blue-800';
      case 'Administración': return 'bg-purple-100 text-purple-800';
      case 'Ventas': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EmployeeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {selectedEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h3>
          <button
            onClick={() => {
              setShowModal(false);
              setSelectedEmployee(null);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue={selectedEmployee?.name || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puesto
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Seleccionar puesto</option>
                <option value="Mecánico Senior">Mecánico Senior</option>
                <option value="Mecánico Junior">Mecánico Junior</option>
                <option value="Especialista Eléctrico">Especialista Eléctrico</option>
                <option value="Auxiliar de Taller">Auxiliar de Taller</option>
                <option value="Recepcionista">Recepcionista</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue={selectedEmployee?.email || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue={selectedEmployee?.phone || ''}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue={selectedEmployee?.address || ''}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="Taller">Taller</option>
                <option value="Administración">Administración</option>
                <option value="Ventas">Ventas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Contratación
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue={selectedEmployee?.hireDate || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salario Mensual
              </label>
              <input
                type="number"
                step="100"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue={selectedEmployee?.salary || ''}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidades
            </label>
            <input
              type="text"
              placeholder="Separar con comas (ej: Motor, Transmisión, Diagnóstico)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue={selectedEmployee?.specialties?.join(', ') || ''}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedEmployee(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {selectedEmployee ? 'Actualizar' : 'Crear'} Empleado
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Empleado</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Empleados</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{employees.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Técnicos</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {employees.filter(emp => emp.department === 'Taller').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {(employees.reduce((sum, emp) => sum + emp.rating, 0) / employees.length).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nómina Mensual</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${employees.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar empleados por nombre, puesto o email..."
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

      {/* Employees Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{employee.name}</h3>
                    <p className="text-gray-600">{employee.position}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(employee.department)}`}>
                        {employee.department}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{employee.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">{employee.completedJobs} trabajos</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{employee.address}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Especialidades</p>
                <div className="flex flex-wrap gap-1">
                  {employee.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm">
                  <p className="text-gray-600">Contratado: {employee.hireDate}</p>
                  <p className="font-medium text-green-600">${employee.salary.toLocaleString()}/mes</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 p-1">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowModal(true);
                    }}
                    className="text-gray-600 hover:text-gray-700 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <EmployeeModal />}
    </div>
  );
};

export default Employees;