'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Task, ParagraphStatus, TaskStatus } from '@/src/types/task'
import { Vote, VoteType, MOCK_ACCOUNTS } from '@/src/types/vote'
import VoteSection from './VoteSection'
import FormattedDate from '@/src/components/common/FormattedDate'
import { getTaskFromStorage, updateTaskInStorage } from '@/src/services/storage'
import { getVotesForTask, saveVote } from '@/src/services/vote'
import Toast from '@/src/components/common/Toast'
import { v4 as uuidv4 } from 'uuid'

interface VoteTaskProps {
  taskId: string
}

export default function VoteTask({ taskId }: VoteTaskProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [, forceUpdate] = useState({})  // 用于强制更新组件

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
      const taskVotes = getVotesForTask(taskId)
      if (loadedTask) {
        setTask(loadedTask)
        setVotes(taskVotes)
      }
      setLoading(false)
    }
    loadTask()

    // 监听用户切换事件
    const handleUserChanged = () => forceUpdate({})
    window.addEventListener('userChanged', handleUserChanged)
    return () => window.removeEventListener('userChanged', handleUserChanged)
  }, [taskId])

  const handleVoteSubmit = async (
    paragraphId: string,
    reviewerId: string,
    reviewId: string,
    voteType: VoteType,
    comment: string
  ) => {
    if (!task) return

    try {
      // 检查用户是否已经对这个审核投过票
      const existingVote = votes.find(v => 
        v.paragraphId === paragraphId && 
        v.reviewId === reviewId && 
        v.voterId === MOCK_ACCOUNTS.activeUser
      )

      if (existingVote) {
        setToastConfig({
          show: true,
          message: 'You have already voted on this review',
          type: 'error'
        })
        return
      }

      // 检查是否是审核者本人
      if (reviewerId === MOCK_ACCOUNTS.activeUser) {
        setToastConfig({
          show: true,
          message: 'You cannot vote on your own review',
          type: 'error'
        })
        return
      }

      // 创建新投票
      const newVote: Vote = {
        id: uuidv4(),
        taskId,
        paragraphId,
        reviewId,
        reviewerId,
        voterId: MOCK_ACCOUNTS.activeUser,
        voteType,
        comment,
        createdAt: new Date().toISOString()
      }

      // 保存投票
      await saveVote(newVote)
      const updatedVotes = [...votes, newVote]
      setVotes(updatedVotes)

      // 检查是否达到投票阈值
      const paragraphVotes = updatedVotes.filter(
        v => v.paragraphId === paragraphId && v.reviewId === reviewId
      )
      const approves = paragraphVotes.filter(v => v.voteType === 'approve').length
      const rejects = paragraphVotes.filter(v => v.voteType === 'reject').length
      const threshold = 3 // 需要至少3个投票
      const totalRequired = Math.ceil(threshold * 2 / 3) // 2/3 多数决

      if (approves >= totalRequired || rejects >= totalRequired) {
        // 更新段落状态
        const updatedParagraphs = task.paragraphs.map(p => {
          if (p.id === paragraphId) {
            return {
              ...p,
              status: approves >= totalRequired ? 'approved' : 'rejected' as ParagraphStatus
            }
          }
          return p
        })

        // 检查是否所有段落都已完成投票
        const allVoted = updatedParagraphs.every(
          p => p.status === 'approved' || p.status === 'rejected'
        )

        // 更新任务状态
        const updatedTask: Task = {
          ...task,
          status: allVoted ? 'completed' as TaskStatus : 'voting' as TaskStatus,
          paragraphs: updatedParagraphs
        }

        await updateTaskInStorage(updatedTask)
        setTask(updatedTask)
      }

      // 显示成功提示
      setToastConfig({
        show: true,
        message: 'Vote submitted successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Failed to submit vote:', error)
      setToastConfig({
        show: true,
        message: 'Failed to submit vote',
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
          href="/vote"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Vote List
        </Link>
        <div className="ml-auto flex items-center space-x-2">
          <span className="text-sm text-gray-500">Current User: {MOCK_ACCOUNTS.activeUser}</span>
          <select
            className="text-sm border rounded-md px-2 py-1"
            value={MOCK_ACCOUNTS.activeUser}
            onChange={(e) => MOCK_ACCOUNTS.setActiveUser(e.target.value)}
          >
            <option value={MOCK_ACCOUNTS.VOTER_1}>Voter 1</option>
            <option value={MOCK_ACCOUNTS.VOTER_2}>Voter 2</option>
            <option value={MOCK_ACCOUNTS.VOTER_3}>Voter 3</option>
          </select>
        </div>
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
                  <h4 className="text-sm font-medium text-gray-500">Original</h4>
                  <p>{paragraph.content}</p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Translation</h4>
                  <p className="text-gray-900">{paragraph.translation}</p>
                </div>

                {paragraph.reviewerId && paragraph.reviewId && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500">Review by {paragraph.reviewerId}</h4>
                    {paragraph.reviewComment && (
                      <p className="text-gray-600 mt-1">{paragraph.reviewComment}</p>
                    )}
                    
                    <VoteSection
                      paragraph={paragraph}
                      taskId={taskId}
                      reviewerId={paragraph.reviewerId}
                      reviewId={paragraph.reviewId}
                      votes={votes.filter(v => 
                        v.paragraphId === paragraph.id && 
                        v.reviewId === paragraph.reviewId
                      )}
                      onVote={async (voteType, comment) => {
                        await handleVoteSubmit(
                          paragraph.id,
                          paragraph.reviewerId,
                          paragraph.reviewId,
                          voteType,
                          comment
                        )
                      }}
                    />
                  </div>
                )}
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