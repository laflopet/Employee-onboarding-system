import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const employeeService = {
  getAllEmployees: async () => {
    const response = await axios.get(`${API_BASE}/employees/`);
    return response.data.data || [];
  },

  createEmployee: async (employeeData) => {
    const response = await axios.post(`${API_BASE}/employees/`, employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await axios.put(`${API_BASE}/employees/${id}/`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await axios.delete(`${API_BASE}/employees/${id}/`);
    return response.data;
  }
};

export default employeeService;