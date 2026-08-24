import { api } from './api';

export const courseService = {
  getCourses: () => api.get('/courses'),
  createCourse: ({ code, name, description }) => api.post('/courses', { code, name, description }),
};
