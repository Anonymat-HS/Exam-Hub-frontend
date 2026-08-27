import { api } from './api';

export const myExamService = {
  getExams: (status) => {
    const params = status ? `?status=${status}` : '';
    return api.get(`/my/exams${params}`);
  },
  getExamDetail: (id) => api.get(`/my/exams/${id}`),
  submitExam: (id, answers) => api.post(`/my/exams/${id}/submit`, { answers }),
  getExamResult: (id) => api.get(`/my/exams/${id}/result`),
};
