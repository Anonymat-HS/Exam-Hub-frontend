import { api } from './api';

export const courseService = {
  getCourses: () => api.get('/courses'),
  createCourse: ({ code, name, description }) => api.post('/courses', { code, name, description }),
  updateCourse: (id, { code, name, description }) => api.put(`/courses/${id}`, { code, name, description }),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};
