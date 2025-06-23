import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Building, Calendar, Mail } from 'lucide-react';
import employeeService from './assets/api/employeeService';


const EmployeeApp = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    primer_apellido: '',
    segundo_apellido: '',
    primer_nombre: '',
    otros_nombres: '',
    pais_empleo: 'Colombia',
    tipo_identificacion: 'Cédula de Ciudadanía',
    numero_identificacion: '',
    fecha_ingreso: '',
    area: 'Administración'
  });

  const PAIS_CHOICES = ['Colombia', 'Estados Unidos'];
  const TIPO_ID_CHOICES = ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Permiso Especial'];
  const AREA_CHOICES = ['Administración', 'Financiera', 'Compras', 'Infraestructura', 'Operación', 'Talento Humano', 'Servicios Varios'];

  // Cargar empleados al iniciar
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Obtener empleados
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar empleados');
    }
    setLoading(false);
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingEmployee) {
        // Actualizar empleado existente
        const result = await employeeService.updateEmployee(editingEmployee.id, formData);
        alert(result.message || 'Empleado actualizado exitosamente');
      } else {
        // Crear nuevo empleado
        const result = await employeeService.createEmployee(formData);
        alert(result.message || 'Empleado creado exitosamente');
      }
      
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.error.slice(20, -3) || 'Error al guardar empleado');
    }
    setLoading(false);
  };

  // Editar empleado
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      primer_apellido: employee.primer_apellido,
      segundo_apellido: employee.segundo_apellido,
      primer_nombre: employee.primer_nombre,
      otros_nombres: employee.otros_nombres || '',
      pais_empleo: employee.pais_empleo,
      tipo_identificacion: employee.tipo_identificacion,
      numero_identificacion: employee.numero_identificacion,
      fecha_ingreso: employee.fecha_ingreso,
      area: employee.area
    });
    setShowForm(true);
  };

  // Eliminar empleado
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
    
    setLoading(true);
    try {
      await employeeService.deleteEmployee(id);
      alert('Empleado eliminado exitosamente');
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar empleado');
    }
    setLoading(false);
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      primer_apellido: '',
      segundo_apellido: '',
      primer_nombre: '',
      otros_nombres: '',
      pais_empleo: 'Colombia',
      tipo_identificacion: 'Cédula de Ciudadanía',
      numero_identificacion: '',
      fecha_ingreso: '',
      area: 'Administración'
    });
    setEditingEmployee(null);
    setShowForm(false);
  };

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Validaciones específicas
    if (['primer_apellido', 'segundo_apellido', 'primer_nombre'].includes(name)) {
      processedValue = value.toUpperCase().replace(/[^A-Z]/g, '');
    } else if (name === 'otros_nombres') {
      processedValue = value.toUpperCase().replace(/[^A-Z ]/g, '');
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <Building className="mr-3 text-blue-600" />
            Sistema de Gestión de Empleados
          </h1>
          
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Empleado
            </button>
          </div>
        </div>

        {/* Formulario Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="primer_apellido"
                    placeholder="Primer Apellido *"
                    value={formData.primer_apellido}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength="20"
                  />
                  <input
                    type="text"
                    name="segundo_apellido"
                    placeholder="Segundo Apellido *"
                    value={formData.segundo_apellido}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength="20"
                  />
                  <input
                    type="text"
                    name="primer_nombre"
                    placeholder="Primer Nombre *"
                    value={formData.primer_nombre}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength="20"
                  />
                  <input
                    type="text"
                    name="otros_nombres"
                    placeholder="Otros Nombres"
                    value={formData.otros_nombres}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    maxLength="50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    name="pais_empleo"
                    value={formData.pais_empleo}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {PAIS_CHOICES.map(pais => (
                      <option key={pais} value={pais}>{pais}</option>
                    ))}
                  </select>
                  <select
                    name="tipo_identificacion"
                    value={formData.tipo_identificacion}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {TIPO_ID_CHOICES.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="numero_identificacion"
                    placeholder="Número de Identificación *"
                    value={formData.numero_identificacion}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength="20"
                  />
                  <input
                    type="date"
                    name="fecha_ingreso"
                    value={formData.fecha_ingreso}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <select
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {AREA_CHOICES.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : (editingEmployee ? 'Actualizar' : 'Crear')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Empleados */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Lista de Empleados ({employees.length.toLocaleString()})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron empleados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Identificación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Ingreso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.primer_nombre} {employee.primer_apellido}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.segundo_apellido}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.numero_identificacion}</div>
                        <div className="text-sm text-gray-500">{employee.tipo_identificacion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {employee.email || 'No disponible'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {employee.area}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(employee.fecha_ingreso).toLocaleDateString('es-CO')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeApp;