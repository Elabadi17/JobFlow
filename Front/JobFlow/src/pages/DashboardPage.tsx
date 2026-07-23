import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase, TrendingUp, Award, XCircle, Bot, RefreshCw,
  ArrowUpRight, Clock
} from 'lucide-react'
import { getUserApplications } from '@/lib/api'
import type { JobApplication, ApplicationStatus } from '@/lib/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'
import { useAuth } from '@/lib/auth'
import { getAgentStatus } from '@/lib/api'

const PIPELINE: ApplicationStatus[] = [
  'APPLIED',
  'INTERVIEW',
  'TECHNICAL_TEST',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',]

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ElementType
  label: string
  value: number | string
  sub?: string
  color: string
}) {
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3"
      style={{ backgroundColor: '#0c1525', borderColor: '#1a2740' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: '#64748b' }}>
          {label}
        </span>
        <div
          className="size-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold font-mono" style={{ color: '#e2e8f0' }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [apps, setApps] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [agentActive, setAgentActive] =
    useState(false)

      useEffect(() => {


    const checkAgent = async () => {

      try {

        const response =
          await getAgentStatus()


        setAgentActive(
          response.active
        )


      } catch (error) {

        setAgentActive(false)

      }

    }



    // premier check immédiat
    checkAgent()



    const interval =
      setInterval(
        checkAgent,
        10000
      )



    return () =>
      clearInterval(interval)



  }, [])


  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getUserApplications(0, 100)
      setApps(res.content ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const counts = PIPELINE.reduce((acc, s) => {
    acc[s] = apps.filter(a => a.status === s).length
    return acc
  }, {} as Record<ApplicationStatus, number>)

  const total = apps.length
  const active = counts.APPLIED + counts.INTERVIEW + counts.TECHNICAL_TEST
  const offers = counts.OFFER
  const rejRate = total > 0 ? Math.round((counts.REJECTED / total) * 100) : 0
  const recent = [...apps]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>
            Good morning, {user?.email ?? 'there'} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Here's your job search overview
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors hover:bg-white/5 disabled:opacity-50"
          style={{ borderColor: '#1a2740', color: '#64748b' }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div
          className="mb-6 rounded-lg px-4 py-3 text-sm"
          style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          {error}
        </div>
      )}

{/* Agent banner */}
<div
  className="rounded-xl border p-4 mb-6 flex items-center gap-3"
  style={{
    backgroundColor: agentActive
      ? 'rgba(34,197,94,0.05)'
      : 'rgba(239,68,68,0.05)',

    borderColor: agentActive
      ? 'rgba(34,197,94,0.2)'
      : 'rgba(239,68,68,0.2)',
  }}
>

  <div
    className="size-9 rounded-lg flex items-center justify-center"
    style={{
      backgroundColor: agentActive
        ? 'rgba(34,197,94,0.15)'
        : 'rgba(239,68,68,0.15)',
    }}
  >
    <Bot
      size={16}
      style={{
        color: agentActive
          ? '#22c55e'
          : '#ef4444'
      }}
    />
  </div>


  <div className="flex-1">

    <p
      className="text-sm font-medium"
      style={{
        color: agentActive
          ? '#4ade80'
          : '#f87171'
      }}
    >
      {
       agentActive
            ? 'AI Agent is monitoring your inbox'
            : 'AI Agent is offline'
      }
    </p>


    <p
      className="text-xs"
      style={{ color:'#64748b' }}
    >
      {
        agentActive
          ? 'Application statuses are updated automatically as emails arrive'
          : 'Start the Python agent to enable automatic updates'
      }
    </p>

  </div>



  <span
    className="text-[10px] font-mono px-2 py-1 rounded"
    style={{
      backgroundColor: agentActive
        ? 'rgba(34,197,94,0.1)'
        : 'rgba(239,68,68,0.1)',

      color: agentActive
        ? '#4ade80'
        : '#f87171'
    }}
  >
    {
       agentActive
          ? 'ACTIVE'
          : 'OFFLINE'
    }
  </span>


  <span
    className={`size-1.5 rounded-full ${
      agentActive ? 'animate-pulse' : ''
    }`}
    style={{
      backgroundColor: agentActive
        ? '#22c55e'
        : '#ef4444'
    }}
  />

</div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Briefcase} label="Total Applied" value={total} sub="all time" color="#3b82f6" />
        <StatCard icon={Clock} label="Active" value={active} sub="in pipeline" color="#818cf8" />
        <StatCard icon={Award} label="Offers" value={offers} sub="received" color="#22c55e" />
        <StatCard icon={XCircle} label="Rejection Rate" value={`${rejRate}%`} sub="of total" color="#ef4444" />
      </div>

      {/* Pipeline breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div
          className="lg:col-span-2 rounded-xl border p-5"
          style={{ backgroundColor: '#0c1525', borderColor: '#1a2740' }}
        >
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#e2e8f0' }}>
            Pipeline breakdown
          </h2>
          <div className="space-y-2.5">
            {PIPELINE.map(s => {
              const count = counts[s]
              const pct = total > 0 ? (count / total) * 100 : 0
              const c = STATUS_COLORS[s]
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="text-xs font-mono w-28 shrink-0" style={{ color: '#64748b' }}>
                    {STATUS_LABELS[s]}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#0a1020' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: c.dot }}
                    />
                  </div>
                  <span className="text-xs font-mono w-6 text-right" style={{ color: '#94a3b8' }}>
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#0c1525', borderColor: '#1a2740' }}
        >
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#e2e8f0' }}>
            Quick stats
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Interview rate', value: total > 0 ? `${Math.round((counts.INTERVIEW / total) * 100)}%` : '—' },
              { label: 'Offer rate', value: total > 0 ? `${Math.round((offers / total) * 100)}%` : '—' },
              { label: 'Under review', value: counts.APPLIED },
              { label: 'Withdrawn', value: counts.WITHDRAWN },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#64748b' }}>{label}</span>
                <span className="text-xs font-mono font-medium" style={{ color: '#94a3b8' }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#1a2740' }}>
            <Link
              to="/applications"
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: '#60a5fa' }}
            >
              <TrendingUp size={12} />
              View all applications
              <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent applications */}
      <div
        className="rounded-xl border"
        style={{ backgroundColor: '#0c1525', borderColor: '#1a2740' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#1a2740' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
            Recent applications
          </h2>
          <Link
            to="/applications"
            className="text-xs flex items-center gap-1 transition-colors"
            style={{ color: '#64748b' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            View all <ArrowUpRight size={11} />
          </Link>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center">
            <span className="inline-block size-5 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
          </div>
        ) : recent.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm" style={{ color: '#64748b' }}>No applications yet.</p>
            <Link to="/applications" className="text-xs mt-1 inline-block" style={{ color: '#60a5fa' }}>
              Add your first application →
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1a2740' }}>
            {recent.map(app => (
              <div
                key={app.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className="size-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: '#111e33', color: '#64748b' }}
                >
                  {app.company.name?.slice(0, 2).toUpperCase() ?? '??'}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>
                    {app.position}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#64748b' }}>
                    {app.company.name?? 'Unknown company'}
                  </p>
                </div>
                <StatusBadge status={app.status} size="sm" />
                <span className="text-[11px] font-mono shrink-0" style={{ color: '#334155' }}>
                  {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
