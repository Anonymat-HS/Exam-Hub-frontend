import { api } from './api';

export const resultService = {
  getExamResults: (examId) => api.get(`/exams/${examId}/results`),
};
