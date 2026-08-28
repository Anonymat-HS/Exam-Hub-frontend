import { api } from './api';

export const studentService = {
  getStudents: () => api.get('/students'),
  createStudent: ({ firstName, lastName, email, password }) =>
    api.post('/students', { firstName, lastName, email, password }),
  updateStudent: (id, { email, password }) =>
    api.put(`/students/${id}`, {
      email,
      ...(password && password.trim() && { password }),
    }),
  deactivateStudent: (id) => api.delete(`/students/${id}`),
  activateStudent: (id) => api.post(`/students/${id}/activate`),
};
