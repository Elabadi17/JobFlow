import { useEffect, useState, useRef, type DragEvent } from 'react'
import { Upload, Star, Trash2, FileText, CheckCircle } from 'lucide-react'
import { getCVs, uploadCV, setDefaultCV, deleteCV } from '@/lib/api'
import type { CV } from '@/lib/types'

export default function CVsPage() {
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [cvName, setCvName] = useState('')
  const [cvLabel, setCvLabel] = useState('')
  const [cvNote, setCvNote] = useState('')  
  const load = async () => {
    setLoading(true)
    try {
      const res = await getCVs()
      setCvs(res ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setUploadError('Only PDF and Word documents are accepted.')
      return
    }
    setUploadError('')
    setUploadSuccess('')
    setUploading(true)
    try {
      const name = cvName.trim() || file.name.replace(/\.[^.]+$/, '')
      await uploadCV(file,   cvLabel.trim(), cvNote.trim())
      setUploadSuccess(`"${name}" uploaded successfully!`)
      setCvName('')
      await load()
      setTimeout(() => setUploadSuccess(''), 4000)
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultCV(id)
      setCvs(prev => prev.map(cv => ({ ...cv, isDefault: cv.id === id })))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to set default')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this CV?')) return
    try {
      await deleteCV(id)
      setCvs(prev => prev.filter(cv => cv.id !== id))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete')
    }
  }


  const formatSize = (name: string) => name.split('.').pop()?.toUpperCase() ?? 'FILE'

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>My CVs</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
          Upload and manage your CVs. Set one as default to use it for new applications.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* Upload area */}
      <div
        className="rounded-xl border-2 border-dashed mb-6 transition-all"
        style={{ borderColor: dragging ? '#3b82f6' : '#1a2740', backgroundColor: dragging ? 'rgba(59,130,246,0.05)' : '#0c1525' }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <div
            className="inline-flex size-12 rounded-xl items-center justify-center mb-4 transition-colors"
            style={{ backgroundColor: dragging ? 'rgba(59,130,246,0.15)' : '#111e33' }}
          >
            <Upload size={20} style={{ color: dragging ? '#3b82f6' : '#64748b' }} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#e2e8f0' }}>
            Drop your CV here or{' '}
            <button
              onClick={() => fileRef.current?.click()}
              className="font-semibold transition-colors"
              style={{ color: '#60a5fa' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#3b82f6')}
              onMouseLeave={e => (e.currentTarget.style.color = '#60a5fa')}
            >
              browse files
            </button>
          </p>
          <p className="text-xs" style={{ color: '#64748b' }}>PDF, DOC, DOCX accepted</p>

          <div className="mt-5 flex flex-col gap-3 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Label (optional)"
              value={cvLabel}
              onChange={e => setCvLabel(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-xs outline-none"
              style={{
                backgroundColor: '#080e1c',
                borderColor: '#1a2740',
                color: '#e2e8f0',
              }}
              onFocus={e => (e.target.style.borderColor = '#3b82f6')}
              onBlur={e => (e.target.style.borderColor = '#1a2740')}
            />

            <textarea
              placeholder="Note (optional)"
              value={cvNote}
              onChange={e => setCvNote(e.target.value)}
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-xs outline-none resize-none"
              style={{
                backgroundColor: '#080e1c',
                borderColor: '#1a2740',
                color: '#e2e8f0',
              }}
              onFocus={e => (e.target.style.borderColor = '#3b82f6')}
              onBlur={e => (e.target.style.borderColor = '#1a2740')}
            />

            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all disabled:opacity-60"
              style={{ backgroundColor: '#3b82f6', color: '#fff' }}
              onMouseEnter={e => {
                if (!uploading) e.currentTarget.style.backgroundColor = '#2563eb'
              }}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3b82f6')}
            >
              {uploading ? (
                <span className="size-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Upload size={12} />
              )}
              Upload
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
        </div>

        {uploadError && (
          <div className="px-6 pb-4">
            <p className="text-xs rounded-lg px-3 py-2 text-center" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
              {uploadError}
            </p>
          </div>
        )}

        {uploadSuccess && (
          <div className="px-6 pb-4">
            <p className="text-xs rounded-lg px-3 py-2 text-center flex items-center justify-center gap-1.5" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>
              <CheckCircle size={12} /> {uploadSuccess}
            </p>
          </div>
        )}
      </div>

      {/* CV list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="size-6 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
        </div>
      ) : cvs.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={32} className="mx-auto mb-3" style={{ color: '#1a2740' }} />
          <p className="text-sm" style={{ color: '#64748b' }}>No CVs uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {cvs.map(cv => (
            <div
              key={cv.id}
              className="rounded-xl border flex items-center gap-4 px-5 py-4 group transition-colors"
              style={{
                backgroundColor: '#0c1525',
                borderColor: cv.default ? 'rgba(59,130,246,0.4)' : '#1a2740',
              }}
            >
              <div
                className="size-10 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
                style={{
                  backgroundColor: cv.default ? 'rgba(59,130,246,0.15)' : '#111e33',
                  color: cv.default ? '#60a5fa' : '#64748b',
                }}
              >
                {formatSize(cv.fileName)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>
                    {cv.label ?? cv.fileName}
                  </p>
                  {cv.default && (
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}
                    >
                      DEFAULT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[11px] font-mono" style={{ color: '#334155' }}>
                    {cv.fileName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!cv.default && (
                  <button
                    onClick={() => handleSetDefault(cv.id)}
                    title="Set as default"
                    className="rounded-lg p-2 transition-colors hover:bg-yellow-500/10"
                    style={{ color: '#64748b' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f59e0b')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(cv.id)}
                  title="Delete"
                  className="rounded-lg p-2 transition-colors hover:bg-red-500/10"
                  style={{ color: '#64748b' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
