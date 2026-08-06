const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const getToken = () => localStorage.getItem('access_token');

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to application/json if it's not a FormData request
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || errorMsg;
    } catch (e) {
      errorMsg = response.statusText;
    }
    throw new ApiError(errorMsg, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // Auth
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });
    
    if (!response.ok) {
      let errorMsg = 'Login failed';
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorMsg;
      } catch(e) {}
      throw new ApiError(errorMsg, response.status);
    }
    return response.json();
  },

  register: (data) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  googleLogin: (data) => apiRequest('/auth/google-login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  guestLogin: () => apiRequest('/auth/guest-login', {
    method: 'POST'
  }),
  
  getMe: () => apiRequest('/auth/me'),

  // Chat History
  getConversations: () => apiRequest('/chat/conversations'),
  createConversation: (title) => apiRequest('/chat/conversations', {
    method: 'POST',
    body: JSON.stringify({ title })
  }),
  getConversation: (id) => apiRequest(`/chat/conversations/${id}`),
  saveChatMessage: (convId, message) => apiRequest(`/chat/conversations/${convId}/messages`, {
    method: 'POST',
    body: JSON.stringify(message)
  }),
  deleteConversation: (id) => apiRequest(`/chat/conversations/${id}`, {
    method: 'DELETE'
  }),

  // Documents
  getDocuments: () => apiRequest('/documents'),
  getDocument: (id) => apiRequest(`/documents/${id}`),
  deleteDocument: (id) => apiRequest(`/documents/${id}`, { method: 'DELETE' }),
  uploadDocument: (file, roles) => {
    const formData = new FormData();
    formData.append('file', file);
    if (roles) formData.append('access_roles', roles);
    
    return apiRequest('/documents/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // Query
  queryRAG: (question) => apiRequest('/query', {
    method: 'POST',
    body: JSON.stringify({ question })
  }),

  // Metrics
  getMetrics: () => apiRequest('/metrics'),
  getMetricsSummary: () => apiRequest('/metrics/summary'),

  // Health
  checkHealth: () => apiRequest('/health'),
};
