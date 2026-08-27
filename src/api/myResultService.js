import { api } from './api';

export const myResultService = {
  getResults: () => api.get('/my/results'),
};
