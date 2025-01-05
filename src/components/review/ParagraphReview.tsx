'use client'

import { useState, useMemo } from 'react'
import { Paragraph } from '@/src/types/task'
import { CheckCircleIcon, PencilIcon } from '@heroicons/react/24/outline'
import DiffMatchPatch from 'diff-match-patch'

interface ParagraphReviewProps {
  paragraph: Paragraph
  index: number
  onReviewSubmit: (comment: string, editedTranslation?: string) => Promise<void>
}

// 计算文本差异并返回带有样式的 JSX 元素
function getTextDiff(oldText: string, newText: string) {
  const dmp = new DiffMatchPatch()
  const diffs = dmp.diff_main(oldText, newText)
  dmp.diff_cleanupSemantic(diffs)

  return diffs.map((diff, index) => {
    const [type, text] = diff
    switch (type) {
      case -1: // 删除
        return (
          <span key={index} className="bg-red-100 text-red-700 line-through px-1 mx-0.5 rounded">
            {text}
          </span>
        )
      case 1: // 添加
        return (
          <span key={index} className="bg-green-100 text-green-700 px-1 mx-0.5 rounded">
            {text}
          </span>
        )
      default: // 不变
        return <span key={index}>{text}</span>
    }
  })
}

export default function ParagraphReview({
  paragraph,
  index,
  onReviewSubmit
}: ParagraphReviewProps) {
  const [isReviewing, setIsReviewing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [comment, setComment] = useState('')
  const [editedTranslation, setEditedTranslation] = useState(paragraph.translation || '')

  const handleApprove = async () => {
    try {
      await onReviewSubmit(comment, isEditing ? editedTranslation : undefined)
      setIsReviewing(false)
      setIsEditing(false)
      setComment('')
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }

  // 计算文本差异
  const diffElements = useMemo(() => {
    if (paragraph.status === 'reviewed' && paragraph.originalTranslation && paragraph.translation) {
      return getTextDiff(paragraph.originalTranslation, paragraph.translation)
    }
    return null
  }, [paragraph.status, paragraph.originalTranslation, paragraph.translation])

  return (
    <div className="group relative pl-4 border-l-4 border-transparent hover:border-gray-200">
      {/* 译文内容 */}
      <div className={`text-gray-600 ${
        paragraph.status === 'reviewed' ? 'text-green-600' : ''
      }`}>
        {isEditing ? (
          <textarea
            value={editedTranslation}
            onChange={(e) => setEditedTranslation(e.target.value)}
            className="w-full min-h-[100px] p-2 border rounded-md"
            placeholder="Edit translation..."
          />
        ) : (
          <div>
            {/* 如果是已审核状态且有修改，显示差异对比 */}
            {paragraph.status === 'reviewed' && diffElements ? (
              <div className="space-y-2">
                <div className="text-sm text-gray-500 font-medium">Translation changes:</div>
                <div className="p-3 bg-gray-50 rounded-md leading-relaxed">
                  {diffElements}
                </div>
              </div>
            ) : (
              <p>{paragraph.translation}</p>
            )}
          </div>
        )}
      </div>

      {/* 审核状态标识 */}
      {paragraph.status === 'reviewed' && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2">
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
        </div>
      )}

      {/* 审核操作区域 */}
      {paragraph.status === 'translated' && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white">
          {isReviewing ? (
            <div className="space-y-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[80px] p-2 text-sm border rounded-md"
                placeholder="Add your review comments (optional)..."
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleApprove}
                  className="px-3 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Approve Translation
                </button>
                <button
                  onClick={() => {
                    setIsReviewing(false)
                    setIsEditing(false)
                    setComment('')
                    setEditedTranslation(paragraph.translation || '')
                  }}
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {/* 直接批准按钮 */}
              <button
                onClick={() => setIsReviewing(true)}
                className="px-3 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Approve
              </button>
              {/* 修改后批准按钮 */}
              <button
                onClick={() => {
                  setIsReviewing(true)
                  setIsEditing(true)
                }}
                className="flex items-center px-3 py-1 text-sm text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit & Approve
              </button>
            </div>
          )}
        </div>
      )}

      {/* 显示审核结果 */}
      {paragraph.status === 'reviewed' && paragraph.reviewComment && (
        <div className="mt-4 bg-gray-50 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-700">Review Comment:</h4>
          <p className="mt-1 text-sm text-gray-600">{paragraph.reviewComment}</p>
          {paragraph.reviewedAt && (
            <p className="mt-2 text-xs text-gray-500">
              Reviewed at: {new Date(paragraph.reviewedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
} 