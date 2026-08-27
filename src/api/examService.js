import { api } from './api';

export const examService = {
  getExams: (courseId) => {
    const params = courseId ? `?courseId=${courseId}` : '';
    return api.get(`/exams${params}`);
  },
  createExam: (data) => api.post('/exams', data),
  getExamDetail: (id) => api.get(`/exams/${id}`),
  updateExam: (id, data) => api.put(`/exams/${id}`, data),
  deleteExam: (id) => api.delete(`/exams/${id}`),
};
