import { Grid3x3 as Grid3X3, Search, FileText, ShieldCheck, BarChart2 } from 'lucide-react'
import { AgentStep, StepStatus } from '../types/agent'

interface WorkflowTrackerProps {
  stepStatuses: Record<AgentStep, StepStatus>
  retryCount: number
}

const STEPS: Array<{ key: AgentStep; label: string; icon: React.ReactNode }> = [
  { key: 'planner', label: 'Plan', icon: <Grid3X3 size={16} /> },
  { key: 'searcher', label: 'Search', icon: <Search size={16} /> },
  { key: 'summarizer', label: 'Summarize', icon: <FileText size={16} /> },
  { key: 'critic', label: 'Critique', icon: <ShieldCheck size={16} /> },
  { key: 'report_generator', label: 'Report', icon: <BarChart2 size={16} /> },
]

const STATUS_LABELS: Record<StepStatus, string> = {
  idle: 'Waiting',
  active: 'Running now',
  completed: 'Completed',
  retry: 'Retrying',
}

interface StepRowProps {
  step: typeof STEPS[number]
  status: StepStatus
  retryCount: number
  isLast: boolean
}

function StepRow({ step, status, retryCount, isLast }: StepRowProps) {
  const isActive = status === 'active'
  const isCompleted = status === 'completed'
  const isRetry = status === 'retry'

  const iconBg = isActive
    ? 'rgba(124,106,247,0.15)'
    : isCompleted
    ? 'rgba(34,197,94,0.12)'
    : isRetry
    ? 'rgba(245,158,11,0.12)'
    : 'rgba(255,255,255,0.04)'

  const iconColor = isActive
    ? '#7c6af7'
    : isCompleted
    ? '#22c55e'
    : isRetry
    ? '#f59e0b'
    : '#4b5563'

  const nameColor = isActive
    ? '#f3f4f6'
    : isCompleted
    ? '#9ca3af'
    : isRetry
    ? '#f59e0b'
    : '#6b7280'

  const rowBg = isActive ? 'rgba(124,106,247,0.06)' : 'transparent'

  return (
    <div className="step-wrapper">
      <div
        className={`step-row ${isActive ? 'step-row-active' : ''}`}
        style={{ background: rowBg }}
      >
        <div className="step-icon" style={{ background: iconBg, color: iconColor }}>
          {step.icon}
        </div>
        <div className="step-info">
          <span className="step-name" style={{ color: nameColor }}>{step.label}</span>
          <span className="step-status-text">{STATUS_LABELS[status]}</span>
        </div>
        <div className="step-badge">
          {isActive && (
            <div className="badge-running">
              <span className="dot dot-pulse" style={{ background: '#7c6af7', width: 6, height: 6 }} />
              <span style={{ color: '#7c6af7', fontSize: 11 }}>Running</span>
            </div>
          )}
          {isCompleted && (
            <div className="badge-complete">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="7" fill="rgba(34,197,94,0.15)" />
                <path d="M4 7l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          {isRetry && (
            <span className="badge-retry">Retry {retryCount}/2</span>
          )}
        </div>
      </div>
      {!isLast && <div className="step-connector" />}
    </div>
  )
}

export default function WorkflowTracker({ stepStatuses, retryCount }: WorkflowTrackerProps) {
  return (
    <div className="section">
      <div className="section-title">Agent Workflow</div>
      <div className="steps-list">
        {STEPS.map((step, idx) => (
          <StepRow
            key={step.key}
            step={step}
            status={stepStatuses[step.key]}
            retryCount={retryCount}
            isLast={idx === STEPS.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
