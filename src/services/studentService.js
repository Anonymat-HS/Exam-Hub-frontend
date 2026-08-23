import { api } from './api';

export const studentService = {
  getStudents: () => api.get('/students'),
  createStudent: ({ firstName, lastName, email, password }) =>
    api.post('/students', { firstName, lastName, email, password }),
  deactivateStudent: (id) => api.delete(`/students/${id}`),
  activateStudent: (id) => api.patch(`/students/${id}/activate`),
};
