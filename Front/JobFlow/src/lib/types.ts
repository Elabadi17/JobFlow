export type ApplicationStatus =
  | 'APPLIED'
  | 'INTERVIEW'
  | 'TECHNICAL_TEST'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN'

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'APPLIED',
  'INTERVIEW',
  'TECHNICAL_TEST',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
]

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  TECHNICAL_TEST: 'Technical Test',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
}

export const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
  APPLIED: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', dot: '#3b82f6' },
  INTERVIEW: { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', dot: '#8b5cf6' },
  TECHNICAL_TEST: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', dot: '#f59e0b' },
  OFFER: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', dot: '#22c55e' },
  REJECTED: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', dot: '#ef4444' },
  WITHDRAWN: { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', dot: '#64748b' },
}

export interface User {
  id: string
  username: string
  email: string
  roles?: string[]
}

interface baseEntity{
  id: string
  createdAt: string
  modifiedAt: string
}

export interface Company extends baseEntity {
  name: string
  industry?: string
  website?: string
  location?: string
  description?: string
}

export interface CV extends baseEntity {
  label?: string
  fileName: string
  default: boolean
}

export interface JobApplication extends baseEntity {
  position: string
  status: ApplicationStatus
  notes?: string
  salaryMin?: number
  salaryMax?: number
  company: Company
  cvFile?: CV
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface AuthResponse {
  token: string
  username?: string
  email?: string
  id?: string
  roles?: string[]
}

export interface AuthRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface CompanyRequest {
  name: string
  industry?: string
  website?: string
  location?: string
}

export interface JobApplicationRequest {
  companyId: string
  position: string
  cvId?: string
  notes?: string
  appliedDate?: string
}


export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  password?: string
}

export interface UserResponse {
  id: string
  createdAt?: string
  modifiedAt?: string

  firstName: string
  lastName: string
  email: string

  enabled: boolean
}

export interface AgentStatus {
  active: boolean
}
