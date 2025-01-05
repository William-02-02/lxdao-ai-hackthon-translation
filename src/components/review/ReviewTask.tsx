'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Task, ParagraphStatus, TaskStatus, Paragraph } from '@/src/types/task'
import { MOCK_ACCOUNTS } from '@/src/types/vote'
import ParagraphReview from './ParagraphReview'
import FormattedDate from '@/src/components/common/FormattedDate'
import { getTaskFromStorage, updateTaskInStorage } from '@/src/services/storage'
import Toast from '@/src/components/common/Toast'
import { v4 as uuidv4 } from 'uuid'

interface ReviewTaskProps {
  taskId: string
}

// 模拟当前用户，在实际应用中应该从钱包或认证系统获取
const CURRENT_USER = MOCK_ACCOUNTS.REVIEWER_1

export default function ReviewTask({ taskId }: ReviewTaskProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [toastConfig, setToastConfig] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error'
  }>({
    show: false,
    message: '',
    type: 'success'
  })

  useEffect(() => {
    const loadTask = async () => {
      const loadedTask = getTaskFromStorage(taskId)
      if (loadedTask) {
        setTask(loadedTask)
      }
      setLoading(false)
    }
    loadTask()
  }, [taskId])

  const handleReviewSubmit = async (
    paragraphId: string,
    comment: string,
    editedTranslation?: string
  ) => {
    if (!task) return

    try {
      // 更新段落状态
      const updatedParagraphs: Paragraph[] = task.paragraphs.map(p => {
        if (p.id === paragraphId) {
          const hasChanges = editedTranslation && editedTranslation !== p.translation
          return {
            ...p,
            originalTranslation: hasChanges ? p.translation : undefined,  // 如果有修改，保存原始译文
            translation: editedTranslation || p.translation || null,
            status: 'reviewed' as ParagraphStatus,
            reviewers: [...p.reviewers, CURRENT_USER],
            reviewId: uuidv4(),
            reviewerId: CURRENT_USER,
            reviewComment: comment,
            reviewedAt: new Date().toISOString()
          }
        }
        return p
      })

      // 检查是否所有段落都已审核完成
      const allReviewed = updatedParagraphs.every(p => p.status === 'reviewed')

      // 更新任务状态
      const updatedTask: Task = {
        ...task,
        status: allReviewed ? 'voting' as TaskStatus : 'reviewing' as TaskStatus,
        paragraphs: updatedParagraphs,
        reviewedBy: [...new Set([...task.reviewedBy, CURRENT_USER])]
      }

      // 保存更新后的任务
      await updateTaskInStorage(updatedTask)
      setTask(updatedTask)

      // 显示成功提示
      setToastConfig({
        show: true,
        message: `Translation approved successfully`,
        type: 'success'
      })
    } catch (error) {
      console.error('Failed to submit review:', error)
      setToastConfig({
        show: true,
        message: 'Failed to submit review',
        type: 'error'
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!task) {
    return <div>Task not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href="/review"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Review List
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="border-b border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {task.title}
            </h3>
            <div className="mt-2 text-sm text-gray-500 flex items-center space-x-4">
              <span>{task.sourceLang.toUpperCase()} → {task.targetLang.toUpperCase()}</span>
              <span>•</span>
              <span>Bounty: {task.bounty} USDT</span>
              <span>•</span>
              <div className="mt-2 text-sm text-gray-500">
                Created: <FormattedDate date={task.createdAt} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-6">
          <div className="prose max-w-none">
            {task.paragraphs.map((paragraph, index) => (
              <div key={paragraph.id} className="mb-8">
                <div className="text-gray-900 mb-2">
                  {paragraph.content}
                </div>
                
                <ParagraphReview
                  paragraph={paragraph}
                  index={index}
                  onReviewSubmit={async (comment, editedTranslation) => {
                    await handleReviewSubmit(paragraph.id, comment, editedTranslation)
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Toast
        show={toastConfig.show}
        message={toastConfig.message}
        type={toastConfig.type}
        onClose={() => setToastConfig(prev => ({ ...prev, show: false }))}
      />
    </div>
  )
} 