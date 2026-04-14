interface StatusPillProps {
  label: string
  status: 'connected' | 'disconnected' | 'idle' | 'running' | 'done'
}

export default function StatusPill({ label, status }: StatusPillProps) {
  const dotColor = {
    connected: '#22c55e',
    disconnected: '#ef4444',
    idle: '#6b7280',
    running: '#7c6af7',
    done: '#22c55e',
  }[status]

  const isPulsing = status === 'running'

  return (
    <div className="status-pill">
      <span
        className={isPulsing ? 'dot dot-pulse' : 'dot'}
        style={{ background: dotColor }}
      />
      <span className="pill-label">{label}</span>
    </div>
  )
}
