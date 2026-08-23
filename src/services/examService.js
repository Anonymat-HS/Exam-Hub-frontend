import { api } from './api';

export const examService = {
  getExams: () => api.get('/exams'),
};
