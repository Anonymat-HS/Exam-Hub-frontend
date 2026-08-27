import { api } from './api';

export const studentService = {
  getStudents: () => api.get('/students'),
  createStudent: ({ firstName, lastName, email, password }) =>
    api.post('/students', { firstName, lastName, email, password }),
  updateStudent: (id, { firstName, lastName, email, password }) =>
    api.put(`/students/${id}`, {
      firstName,
      lastName,
      email,
      ...(password && password.trim() && { password }),
    }),
  deactivateStudent: (id) => api.delete(`/students/${id}`),
  activateStudent: (id) => api.patch(`/students/${id}/activate`),
};
