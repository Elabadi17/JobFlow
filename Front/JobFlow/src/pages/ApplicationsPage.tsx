import { useEffect, useState, type FormEvent } from 'react'
import { Plus, Trash2, ChevronDown, Search } from 'lucide-react'
import {
  getUserApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  getCompanies,
  getCVs,
} from '@/lib/api'
import type { JobApplication, Company, CV, ApplicationStatus, JobApplicationRequest } from '@/lib/types'
import { APPLICATION_STATUSES, STATUS_LABELS } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'
import Modal from '@/components/Modal'

const ALL = 'ALL' as const
type Filter = ApplicationStatus | typeof ALL

export default function ApplicationsPage() {
  const [apps, setApps] = useState<JobApplication[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>(ALL)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [form, setForm] = useState<JobApplicationRequest>({
    companyId: '',
    position: '',
    cvId: '',
    notes: '',
    appliedDate: new Date().toISOString().split('T')[0],
  })

  const load = async () => {
    setLoading(true)
    try {
      const [appsRes, compRes, cvsRes] = await Promise.all([
        getUserApplications(0, 200),
        getCompanies(0, 200),
        getCVs(),
      ])
      setApps(appsRes.content ?? [])
      setCompanies(compRes.content ?? [])
      setCvs(cvsRes ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = apps.filter(a => {
    const matchFilter = filter === ALL || a.status === filter
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      a.position.toLowerCase().includes(q) ||
      a.company.name.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const counts = APPLICATION_STATUSES.reduce((acc, s) => {
    acc[s] = apps.filter(a => a.status === s).length
    return acc
  }, {} as Record<ApplicationStatus, number>)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      const payload: JobApplicationRequest = {
        companyId: form.companyId,
        position: form.position,
        appliedDate: form.appliedDate,
        notes: form.notes || undefined,
        cvId: form.cvId || undefined,
      }
      await createApplication(payload)
      setShowModal(false)
      setForm({ companyId: '', position: '', cvId: '', notes: '', appliedDate: new Date().toISOString().split('T')[0] })
      await load()
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, status)
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application?')) return
    try {
      await deleteApplication(id)
      setApps(prev => prev.filter(a => a.id !== id))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete')
    }
  }

  const inputStyle = {
    backgroundColor: '#080e1c',
    borderColor: '#1a2740',
    color: '#e2e8f0',
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>Applications</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            {apps.length} total · {apps.filter(a => ['APPLIED','UNDER_REVIEW','INTERVIEW_SCHEDULED'].includes(a.status)).length} active
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
          style={{ backgroundColor: '#3b82f6', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3b82f6')}
        >
          <Plus size={15} /> New Application
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search position or company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded-lg border pl-8 pr-3 py-2 text-xs outline-none"
            style={{ ...inputStyle, width: 220 }}
            onFocus={e => (e.target.style.borderColor = '#3b82f6')}
            onBlur={e => (e.target.style.borderColor = '#1a2740')}
          />
        </div>

        <div className="flex items-center gap-1 ml-2">
          {([ALL, ...APPLICATION_STATUSES] as Filter[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all font-mono"
              style={
                filter === s
                  ? { backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }
                  : { backgroundColor: 'transparent', color: '#64748b', border: '1px solid #1a2740' }
              }
            >
              {s === ALL ? 'All' : STATUS_LABELS[s]}
              {s !== ALL && counts[s] > 0 && (
                <span className="ml-1.5 opacity-70">{counts[s]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0c1525', borderColor: '#1a2740' }}>
        <div
          className="grid text-[11px] font-mono uppercase tracking-wider px-5 py-3 border-b"
          style={{ gridTemplateColumns: '1fr 1fr 160px 140px 90px 40px', color: '#334155', borderColor: '#1a2740', backgroundColor: '#080e1c' }}
        >
          <span>Position</span>
          <span>Company</span>
          <span>Status</span>
          <span>Applied</span>
          <span>CV</span>
          <span />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="size-6 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: '#64748b' }}>No applications found.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1a2740' }}>
            {filtered.map(app => (
              <div
                key={app.id}
                className="grid items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors group"
                style={{ gridTemplateColumns: '1fr 1fr 160px 140px 90px 40px' }}
              >
                <p className="text-sm font-medium truncate pr-3" style={{ color: '#e2e8f0' }}>
                  {app.position}
                </p>
                <p className="text-sm truncate pr-3" style={{ color: '#94a3b8' }}>
                  {app.company.name}
                </p>
                <div className="relative">
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className="w-full appearance-none rounded-lg border-0 py-1 pl-2 pr-6 text-[11px] font-mono outline-none cursor-pointer"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'inherit',
                    }}
                  >
                    {APPLICATION_STATUSES.map(s => (
                      <option key={s} value={s} style={{ backgroundColor: '#0c1525', color: '#e2e8f0' }}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <StatusBadge status={app.status} size="sm" />
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  >
                    {APPLICATION_STATUSES.map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <span className="text-xs font-mono" style={{ color: '#64748b' }}>
                  {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-xs truncate" style={{ color: '#334155' }}>
                  {app.cvFile?.label || app.cvFile?.fileName || '—'}                
                </span>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1.5 hover:bg-red-500/10"
                  style={{ color: '#64748b' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Application Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Application">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
              Company *
            </label>
            <div className="relative">
              <select
                required
                value={form.companyId}
                onChange={e => setForm(f => ({ ...f, companyId: e.target.value }))}
                className="w-full appearance-none rounded-lg border px-3 py-2.5 text-sm outline-none pr-8"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#1a2740')}
              >
                <option value="">Select company…</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id} style={{ backgroundColor: '#0c1525' }}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
              Position *
            </label>
            <input
              required
              type="text"
              placeholder="Software Engineer"
              value={form.position}
              onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#3b82f6')}
              onBlur={e => (e.target.style.borderColor = '#1a2740')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                CV
              </label>
              <div className="relative">
                <select
                  value={form.cvId}
                  onChange={e => setForm(f => ({ ...f, cvId: e.target.value }))}
                  className="w-full appearance-none rounded-lg border px-3 py-2.5 text-sm outline-none pr-8"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={e => (e.target.style.borderColor = '#1a2740')}
                >
                  <option value="">None</option>
                  {cvs.map(cv => (
                    <option key={cv.id} value={cv.id} style={{ backgroundColor: '#0c1525' }}>
                      {cv.label ?? cv.fileName}{cv.default ? ' ★' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                Applied date
              </label>
              <input
                type="date"
                value={form.appliedDate}
                onChange={e => setForm(f => ({ ...f, appliedDate: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#1a2740')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
              Notes
            </label>
            <textarea
              rows={3}
              placeholder="Any relevant notes…"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none resize-none"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#3b82f6')}
              onBlur={e => (e.target.style.borderColor = '#1a2740')}
            />
          </div>

          {formError && (
            <p className="text-xs rounded-lg px-3 py-2" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
              {formError}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 rounded-lg border py-2.5 text-sm transition-colors hover:bg-white/5"
              style={{ borderColor: '#1a2740', color: '#64748b' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all disabled:opacity-60"
              style={{ backgroundColor: '#3b82f6', color: '#fff' }}
            >
              {submitting ? 'Saving…' : 'Add Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
