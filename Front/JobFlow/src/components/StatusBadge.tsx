import type { ApplicationStatus } from '@/lib/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/types'

interface Props {
  status: ApplicationStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const colors = STATUS_COLORS[status]
  const label = STATUS_LABELS[status]

  return (
    <span
      style={{ backgroundColor: colors.bg, color: colors.text }}
      className={`inline-flex items-center gap-1.5 rounded font-mono font-medium tracking-wide ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
      }`}
    >
      <span
        style={{ backgroundColor: colors.dot }}
        className={`rounded-full flex-shrink-0 ${size === 'sm' ? 'size-1' : 'size-1.5'}`}
      />
      {label}
    </span>
  )
}
