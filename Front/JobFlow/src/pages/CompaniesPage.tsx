import { useEffect, useState, type FormEvent } from 'react'
import { Plus, Pencil, Trash2, Building2, Globe, MapPin, Search } from 'lucide-react'
import { getCompanies, createCompany, updateCompany, deleteCompany } from '@/lib/api'
import type { Company, CompanyRequest } from '@/lib/types'
import Modal from '@/components/Modal'

const EMPTY: CompanyRequest = { name: '', industry: '', website: '', location: '' }

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Company | null>(null)
  const [form, setForm] = useState<CompanyRequest>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await getCompanies(0, 200)
      setCompanies(res.content ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (c: Company) => {
    setEditing(c)
    setForm({ name: c.name, industry: c.industry ?? '', website: c.website ?? '', location: c.location ?? '' })
    setFormError('')
    setShowModal(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      const payload: CompanyRequest = {
        name: form.name,
        industry: form.industry || undefined,
        website: form.website || undefined,
        location: form.location || undefined,
      }
      if (editing) {
        await updateCompany(editing.id, payload)
      } else {
        await createCompany(payload)
      }
      setShowModal(false)
      await load()
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this company?')) return
    try {
      await deleteCompany(id)
      setCompanies(prev => prev.filter(c => c.id !== id))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete')
    }
  }

  const filtered = companies.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase()),
  )

  const inputStyle = { backgroundColor: '#080e1c', borderColor: '#1a2740', color: '#e2e8f0' }

  const industries = ['Technology', 'Finance', 'Healthcare', 'Consulting', 'E-commerce', 'Media', 'Education', 'Other']

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>Companies</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            {companies.length} companies tracked
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
          style={{ backgroundColor: '#3b82f6', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3b82f6')}
        >
          <Plus size={15} /> Add Company
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
          {error}
        </div>
      )}

      <div className="mb-5 relative w-72">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
        <input
          type="text"
          placeholder="Search companies…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border pl-8 pr-3 py-2 text-xs outline-none"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#3b82f6')}
          onBlur={e => (e.target.style.borderColor = '#1a2740')}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="size-6 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Building2 size={32} className="mx-auto mb-3" style={{ color: '#1a2740' }} />
          <p className="text-sm" style={{ color: '#64748b' }}>
            {search ? 'No companies match your search.' : 'No companies yet. Add your first one.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(c => (
            <div
              key={c.id}
              className="rounded-xl border p-5 group hover:border-blue-500/30 transition-colors"
              style={{ backgroundColor: '#0c1525', borderColor: '#1a2740' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: '#111e33', color: '#64748b' }}
                  >
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{c.name}</p>
                    {c.industry && (
                      <p className="text-xs" style={{ color: '#64748b' }}>{c.industry}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(c)}
                    className="rounded-lg p-1.5 hover:bg-white/5 transition-colors"
                    style={{ color: '#64748b' }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="rounded-lg p-1.5 hover:bg-red-500/10 transition-colors"
                    style={{ color: '#64748b' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                {c.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} style={{ color: '#334155' }} />
                    <span className="text-xs" style={{ color: '#64748b' }}>{c.location}</span>
                  </div>
                )}
                {c.website && (
                  <div className="flex items-center gap-1.5">
                    <Globe size={11} style={{ color: '#334155' }} />
                    <a
                      href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs truncate transition-colors"
                      style={{ color: '#64748b' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                    >
                      {c.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Company' : 'Add Company'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
              Company name *
            </label>
            <input
              required
              type="text"
              placeholder="Acme Corporation"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#3b82f6')}
              onBlur={e => (e.target.style.borderColor = '#1a2740')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                Industry
              </label>
              <select
                value={form.industry}
                onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#1a2740')}
              >
                <option value="">Select…</option>
                {industries.map(i => (
                  <option key={i} value={i} style={{ backgroundColor: '#0c1525' }}>{i}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                Location
              </label>
              <input
                type="text"
                placeholder="Paris, France"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#1a2740')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
              Website
            </label>
            <input
              type="text"
              placeholder="https://acme.com"
              value={form.website}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
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
              {submitting ? 'Saving…' : editing ? 'Save changes' : 'Add Company'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
