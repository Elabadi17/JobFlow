import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#070b12' }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26,39,64,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(26,39,64,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="inline-flex size-12 rounded-2xl items-center justify-center text-lg font-bold mb-4"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #818cf8)', color: '#fff' }}
          >
            JF
          </div>
          <h1 className="text-xl font-semibold" style={{ color: '#e2e8f0' }}>
            Create account
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Start tracking your job applications
          </p>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: '#0c1525',
            borderColor: '#1a2740',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          {success ? (
            <div className="text-center py-6">
              <div
                className="inline-flex size-12 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}
              >
                <Check size={20} style={{ color: '#22c55e' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#e2e8f0' }}>
                Account created!
              </p>
              <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                Redirecting to login…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'username', label: 'Username', type: 'text', placeholder: 'your_username', autocomplete: 'username' },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com', autocomplete: 'email' },
              ].map(({ key, label, type, placeholder, autocomplete }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    autoComplete={autocomplete}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                    style={{ backgroundColor: '#080e1c', borderColor: '#1a2740', color: '#e2e8f0' }}
                    onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={e => (e.target.style.borderColor = '#1a2740')}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none transition-colors"
                    style={{ backgroundColor: '#080e1c', borderColor: '#1a2740', color: '#e2e8f0' }}
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
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#2563eb' }}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3b82f6')}
              >
                {loading ? (
                  <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>Create account <ArrowRight size={14} /></>
                )}
              </button>
            </form>
          )}

          {!success && (
            <p className="mt-5 text-center text-xs" style={{ color: '#64748b' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-medium" style={{ color: '#60a5fa' }}>
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
