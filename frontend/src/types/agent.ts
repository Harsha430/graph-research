export type AgentStep = 'planner' | 'searcher' | 'summarizer' | 'critic' | 'report_generator'
export type StepStatus = 'idle' | 'active' | 'completed' | 'retry'
export type AppStatus = 'idle' | 'researching' | 'complete' | 'error'

export interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export interface AgentState {
  status: AppStatus
  currentStep: AgentStep | null
  stepStatuses: Record<AgentStep, StepStatus>
  subQuestions: string[]
  completedQuestions: string[]
  logs: LogEntry[]
  finalReport: string
  topic: string
  retryCount: number
  total_tokens: number
  wordCount: number
}

export interface UsageMetrics {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface SSEFrame {
  type: 'step_start' | 'step_complete' | 'log' | 'report_chunk' | 'done' | 'questions' | 'usage'
  node?: AgentStep
  data?: {
    message?: string
    type?: LogEntry['type']
  } | string[] | string | UsageMetrics
}
