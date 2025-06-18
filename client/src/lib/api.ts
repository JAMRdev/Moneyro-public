// API client to replace Supabase calls
const API_BASE = "/api";

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: () => apiRequest('/auth/login', { method: 'POST' }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
  create: (data: any) => apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Transactions API
export const transactionsAPI = {
  getAll: (params?: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return apiRequest(`/transactions${query ? `?${query}` : ''}`);
  },
  create: (data: any) => apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/transactions/${id}`, {
    method: 'DELETE',
  }),
};

// Fixed Monthly Expenses API
export const fixedExpensesAPI = {
  getAll: (params?: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return apiRequest(`/fixed-monthly-expenses${query ? `?${query}` : ''}`);
  },
  create: (data: any) => apiRequest('/fixed-monthly-expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/fixed-monthly-expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/fixed-monthly-expenses/${id}`, {
    method: 'DELETE',
  }),
};

// Expense Groups API
export const expenseGroupsAPI = {
  getAll: () => apiRequest('/expense-groups'),
  create: (data: any) => apiRequest('/expense-groups', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Budgets API
export const budgetsAPI = {
  getAll: () => apiRequest('/budgets'),
  create: (data: any) => apiRequest('/budgets', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/budgets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/budgets/${id}`, {
    method: 'DELETE',
  }),
};

// Logs API
export const logsAPI = {
  getAll: () => apiRequest('/logs'),
  create: (data: any) => apiRequest('/logs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Initialize database
export const initializeDatabase = () => apiRequest('/init');