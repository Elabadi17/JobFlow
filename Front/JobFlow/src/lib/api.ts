import type {
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  Company,
  CompanyRequest,
  CV,
  JobApplication,
  JobApplicationRequest,
  ApplicationStatus,
  Page,
  UpdateUserRequest,
  UserResponse,
  AgentStatus,
} from './types'

export const API_BASE = import.meta.env.VITE_API_BASE
export function getToken(): string | null {
  return localStorage.getItem('jf_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const isFormData = options.body instanceof FormData

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>),
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    localStorage.removeItem('jf_token')
    window.location.href = '/login'
    throw new Error('Session expired')
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }

  const ct = res.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) return res.json() as Promise<T>
  return undefined as T
}

// Auth
export const login = (data: AuthRequest) =>
  request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const register = (data: RegisterRequest) =>
  request<void>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// Applications
export const getUserApplications = (page = 0, size = 100) =>
  request<Page<JobApplication>>(`/api/applications/user?page=${page}&size=${size}`)

export const getAllApplications = (page = 0, size = 20) =>
  request<Page<JobApplication>>(`/api/applications?page=${page}&size=${size}`)

export const createApplication = (data: JobApplicationRequest) =>
  request<JobApplication>('/api/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updateApplicationStatus = (id: string, status: ApplicationStatus) =>
  request<void>(`/api/applications/${id}/status?status=${status}`, {
    method: 'PATCH',
  })

export const deleteApplication = (id: string) =>
  request<void>(`/api/applications/${id}`, { method: 'DELETE' })

// Companies
export const getCompanies = (page = 0, size = 50) =>
  request<Page<Company>>(`/api/companies?page=${page}&size=${size}`)

export const getCompanyById = (id: string) =>
  request<Company>(`/api/companies/${id}`)

export const createCompany = (data: CompanyRequest) =>
  request<Company>('/api/companies', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updateCompany = (id: string, data: CompanyRequest) =>
  request<Company>(`/api/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const deleteCompany = (id: string) =>
  request<void>(`/api/companies/${id}`, { method: 'DELETE' })

// CVs
export const getCVs = () => request<CV[]>('/api/cv')

export const getDefaultCV = () => request<CV>('/api/cv/default')

export const uploadCV = async (file: File,  label?: string, note?: string): Promise<CV> => {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)
  formData.append(
    'data',
    new Blob([JSON.stringify({label,  note })], { type: 'application/json' }),
  )

  const res = await fetch(`${API_BASE}/api/cv`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }

  return res.json()
}

export const setDefaultCV = (id: string) =>
  request<void>(`/api/cv/${id}/default`, { method: 'PATCH' })

export const deleteCV = (id: string) =>
  request<void>(`/api/cv/${id}`, { method: 'DELETE' })


export const updateUser = (
  id: string,
  data: UpdateUserRequest
) =>
  request<UserResponse>(`/api/auth/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })



export const getCurrentUser = () =>
  request<UserResponse>('/api/auth/me')


export const getAgentStatus = () =>
  request<AgentStatus>('/api/agent/status')