export type TaskStatus = 'pending' | 'translating' | 'translated' | 'reviewing' | 'voting' | 'completed' | 'failed' | 'stopped'
export type ParagraphStatus = 'pending' | 'translated' | 'reviewed' | 'voting' | 'approved' | 'rejected'

export interface Paragraph {
  id: string
  content: string
  translation: string | null
  originalTranslation?: string | null  // 保存修改前的译文
  status: ParagraphStatus
  reviewers: string[]
  reviewId?: string      // 当前审核ID
  reviewerId?: string    // 当前审核者
  reviewComment?: string // 审核评论
  reviewedAt?: string   // 审核时间
}

export interface Task {
  id: string
  title: string
  sourceContent: string
  sourceLang: string
  targetLang: string
  bounty: number
  status: TaskStatus
  createdAt: string
  createdBy: string
  translatedBy?: string
  reviewedBy: string[]
  reviewScore?: number
  paragraphs: Paragraph[]
} 