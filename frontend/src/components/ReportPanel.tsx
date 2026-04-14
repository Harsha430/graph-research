import { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Download, Copy, RotateCcw, Network } from 'lucide-react'
import { AppStatus } from '../types/agent'

interface ReportPanelProps {
  status: AppStatus
  topic: string
  report: string
  wordCount: number
  onReset: () => void
}

export default function ReportPanel({ status, topic, report, wordCount, onReset }: ReportPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [report])

  const handleCopy = () => {
    navigator.clipboard.writeText(report)
  }

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-report.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (status === 'idle' && !report) {
    return (
      <div className="right-panel">
        <div className="idle-state">
          <div className="idle-icon">
            <Network size={48} color="rgba(124,106,247,0.4)" />
          </div>
          <h2 className="idle-heading">Ready to research</h2>
          <p className="idle-subtext">Enter a topic above to start your autonomous research agent.</p>
          <div className="feature-pills">
            <span className="feature-pill">Multi-step reasoning</span>
            <span className="feature-pill">Parallel search</span>
            <span className="feature-pill">Auto-critique</span>
          </div>
        </div>
      </div>
    )
  }

  const isStreaming = status === 'researching'
  const isComplete = status === 'complete'

  return (
    <div className="right-panel">
      <div className="report-wrapper">
        <div className="report-card">
          <div className="report-header">
            <span className="report-title">{topic || 'Research Report'}</span>
            <span className="word-count-badge">~{wordCount} words</span>
          </div>

          <div ref={scrollRef} className="report-content">
            {report ? (
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
                {isStreaming && <span className="streaming-cursor" />}
              </div>
            ) : (
              <div className="report-placeholder">
                <div className="dot dot-pulse" style={{ background: '#7c6af7', width: 8, height: 8, margin: '0 auto 12px' }} />
                <p style={{ color: '#6b7280', fontSize: 13 }}>Generating report...</p>
              </div>
            )}
          </div>
        </div>

        {isComplete && (
          <div className="action-bar">
            <button className="action-btn-outline" onClick={handleDownload}>
              <Download size={14} />
              Download .md
            </button>
            <button className="action-btn-outline" onClick={handleCopy}>
              <Copy size={14} />
              Copy to clipboard
            </button>
            <button className="action-btn-primary" onClick={onReset}>
              <RotateCcw size={14} />
              New research
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
