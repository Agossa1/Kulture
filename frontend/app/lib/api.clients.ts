const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const PUBLIC_AUTH_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-otp',
  '/reset-password',

];

function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

async function apiClient<T>(
  endpoint: string,
  { body, ...customConfig }: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    credentials: 'include', // INDISPENSABLE pour envoyer/recevoir les cookies HttpOnly
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch {
    return Promise.reject(new Error('Impossible de contacter le serveur. Vérifiez que l\'API est démarrée.'));
  }

  if (response.status === 401 && typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (!isPublicAuthPath(path)) {
      window.location.href = '/login';
    }
  }

  const data = await response.json().catch(() => ({}));

  if (response.ok) {
    return data;
  } else {
    const error = new Error(data?.message || data?.error || 'API Error');
    (error as any).data = data;
    (error as any).status = response.status;
    return Promise.reject(error);
  }
}

export const api = {
  get: <T>(endpoint: string, config?: RequestInit) => apiClient<T>(endpoint, { ...config, method: 'GET' }),
  post: <T>(endpoint: string, body: any, config?: RequestInit) => apiClient<T>(endpoint, { ...config, method: 'POST', body }),
  patch: <T>(endpoint: string, body: any, config?: RequestInit) => apiClient<T>(endpoint, { ...config, method: 'PATCH', body }),
  put: <T>(endpoint: string, body: any, config?: RequestInit) => apiClient<T>(endpoint, { ...config, method: 'PUT', body }),
  delete: <T>(endpoint: string, config?: RequestInit) => apiClient<T>(endpoint, { ...config, method: 'DELETE' }),
};
