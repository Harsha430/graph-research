import { Cpu } from 'lucide-react'
import { AppStatus } from '../types/agent'

interface HeaderProps {
  status: AppStatus
  mockMode: boolean
  totalTokens: number
  onToggleMock: () => void
}

export default function Header({ status, mockMode, totalTokens, onToggleMock }: HeaderProps) {
  const agentPillStatus = status === 'idle' ? 'idle' : status === 'researching' ? 'running' : status === 'complete' ? 'done' : 'idle'
  const agentLabel = status === 'idle' ? 'Idle' : status === 'researching' ? 'Running' : status === 'complete' ? 'Done' : 'Error'

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-icon">
          <Cpu size={16} color="#7c6af7" />
        </div>
        <div className="logo-text">
          <span className="logo-name">ResearchAgent</span>
          <span className="logo-sub">powered by LangGraph</span>
        </div>
      </div>

      <div className="header-right">
        <div className="status-pill status-pill-usage">
          <span className="dot" style={{ background: '#3b82f6' }} />
          <span className="pill-label">{totalTokens.toLocaleString()} tokens</span>
        </div>
        <div className="status-pill">
          <span className="dot" style={{ background: '#22c55e' }} />
          <span className="pill-label">Groq LLM</span>
        </div>
        <div className="status-pill">
          <span className="dot" style={{ background: '#22c55e' }} />
          <span className="pill-label">Tavily Search</span>
        </div>
        <div className="status-pill">
          <span
            className={agentPillStatus === 'running' ? 'dot dot-pulse' : 'dot'}
            style={{
              background:
                agentPillStatus === 'running' ? '#7c6af7' :
                agentPillStatus === 'done' ? '#22c55e' : '#ef4444',
            }}
          />
          <span className="pill-label">Agent: {agentLabel}</span>
        </div>
        <button
          onClick={onToggleMock}
          className={`mock-toggle ${mockMode ? 'mock-active' : ''}`}
        >
          {mockMode ? 'Mock Mode' : 'Live Mode'}
        </button>
      </div>
    </header>
  )
}
