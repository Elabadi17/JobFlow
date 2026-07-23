import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#070b12' }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26,39,64,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(26,39,64,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex size-12 rounded-2xl items-center justify-center text-lg font-bold mb-4"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #818cf8)', color: '#fff' }}
          >
            JF
          </div>
          <h1 className="text-xl font-semibold" style={{ color: '#e2e8f0' }}>
            Welcome back
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Sign in to your JobFlow account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: '#0c1525',
            borderColor: '#1a2740',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                Email
              </label>
              <input
                type="text"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your_email"
                required
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: '#080e1c',
                  borderColor: '#1a2740',
                  color: '#e2e8f0',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#1a2740')}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none transition-colors"
                  style={{
                    backgroundColor: '#080e1c',
                    borderColor: '#1a2740',
                    color: '#e2e8f0',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                  onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={e => (e.target.style.borderColor = '#1a2740')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#64748b' }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-xs rounded-lg px-3 py-2"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all disabled:opacity-60"
              style={{ backgroundColor: '#3b82f6', color: '#fff' }}
              onMouseEnter={e => {
                if (!loading) (e.currentTarget.style.backgroundColor = '#2563eb')
              }}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3b82f6')}
            >
              {loading ? (
                <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs" style={{ color: '#64748b' }}>
            No account?{' '}
            <Link to="/register" className="font-medium" style={{ color: '#60a5fa' }}>
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] font-mono" style={{ color: '#334155' }}>
          JOBFLOW v1.0 · AI-POWERED JOB TRACKING
        </p>
      </div>
    </div>
  )
}
