const API_BASE = '/api';

async function request(endpoint, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem('token');

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || `Erreur HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
