import { api } from './api';

export const myExamApi = {
  getMyExams: (status) => {
    const params = status ? `?status=${status}` : '';
    return api.get(`/my/exams${params}`);
  },
  getMyExamDetail: (id) => api.get(`/my/exams/${id}`),
  submitExam: (id, answers) => api.post(`/my/exams/${id}/submit`, { answers }),
  getMyExamResult: (id) => api.get(`/my/exams/${id}/result`),
  getMyResults: () => api.get('/my/results'),
};
