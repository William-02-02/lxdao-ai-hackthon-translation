export interface Earning {
  id: string
  taskId: string
  taskTitle: string
  type: 'translation' | 'review'
  amount: number
  status: 'pending' | 'completed'
  createdAt: string
  address: string
  details: {
    wordCount?: number
    ratePerWord?: number
    reviewedParagraphs?: number
    ratePerParagraph?: number
  }
} 