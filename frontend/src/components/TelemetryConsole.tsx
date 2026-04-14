import { LogEntry, AppStatus } from '../types/agent'
import { useAutoScroll } from '../hooks/useAutoScroll'

interface TelemetryConsoleProps {
  logs: LogEntry[]
  status: AppStatus
}

const LOG_COLORS: Record<LogEntry['type'], string> = {
  info: '#38bdf8',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
}

export default function TelemetryConsole({ logs, status }: TelemetryConsoleProps) {
  const scrollRef = useAutoScroll(logs)
  const isActive = status === 'researching'

  return (
    <div className="section section-flex">
      <div className="section-title-row">
        <span className="section-title">Live Telemetry</span>
        {isActive && <span className="dot dot-pulse" style={{ background: '#22c55e', width: 6, height: 6 }} />}
      </div>
      <div ref={scrollRef} className="console">
        {logs.length === 0 ? (
          <div className="console-empty">Agent idle. Start a research task to see logs.</div>
        ) : (
          logs.map(entry => (
            <div key={entry.id} className="log-entry slide-up">
              <span className="log-timestamp">[{entry.timestamp}]</span>{' '}
              <span style={{ color: LOG_COLORS[entry.type] }}>{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
