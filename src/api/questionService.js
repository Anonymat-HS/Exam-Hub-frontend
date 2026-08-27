import { api } from './api';

export const questionService = {
  getQuestions: (examId) => api.get(`/exams/${examId}/questions`),
  createQuestion: (examId, data) => api.post(`/exams/${examId}/questions`, data),
  updateQuestion: (questionId, data) => api.put(`/questions/${questionId}`, data),
  deleteQuestion: (questionId) => api.delete(`/questions/${questionId}`),
};
