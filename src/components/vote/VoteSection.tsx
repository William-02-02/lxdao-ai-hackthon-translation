'use client'

import { useState, useEffect } from 'react'
import { Vote, VoteStats, VoteType, MOCK_ACCOUNTS } from '@/src/types/vote'
import { Paragraph } from '@/src/types/task'
import { CheckCircleIcon, XCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline'

interface VoteSectionProps {
  paragraph: Paragraph
  taskId: string
  reviewerId: string
  reviewId: string
  votes: Vote[]
  onVote: (voteType: VoteType, comment: string) => Promise<void>
}

export default function VoteSection({
  paragraph,
  taskId,
  reviewerId,
  reviewId,
  votes,
  onVote
}: VoteSectionProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [comment, setComment] = useState('')
  const [stats, setStats] = useState<VoteStats>({
    approves: 0,
    rejects: 0,
    voters: [],
    threshold: 3, // 需要至少3个投票
    isApproved: false,
    isRejected: false
  })

  useEffect(() => {
    // 计算投票统计
    const approves = votes.filter(v => v.voteType === 'approve').length
    const rejects = votes.filter(v => v.voteType === 'reject').length
    const voters = [...new Set(votes.map(v => v.voterId))]
    const totalRequired = Math.ceil(stats.threshold * 2 / 3) // 2/3 多数决

    setStats({
      approves,
      rejects,
      voters,
      threshold: stats.threshold,
      isApproved: approves >= totalRequired,
      isRejected: rejects >= totalRequired
    })
  }, [votes])

  // 监听用户切换事件，强制重新计算投票状态
  useEffect(() => {
    const handleUserChanged = () => {
      // 重新计算投票状态
      const voters = [...new Set(votes.map(v => v.voterId))]
      setStats(prev => ({
        ...prev,
        voters
      }))
    }

    window.addEventListener('userChanged', handleUserChanged)
    return () => {
      window.removeEventListener('userChanged', handleUserChanged)
    }
  }, [votes])

  const handleVote = async (voteType: VoteType) => {
    try {
      await onVote(voteType, comment)
      setIsVoting(false)
      setComment('')
    } catch (error) {
      console.error('Failed to submit vote:', error)
    }
  }

  // 检查当前用户是否已投票
  const hasVoted = stats.voters.includes(MOCK_ACCOUNTS.activeUser)
  // 检查当前用户是否是审核者本人
  const isReviewer = MOCK_ACCOUNTS.activeUser === reviewerId

  // 计算投票进度百分比（基于阈值而不是总投票数）
  const approvePercent = (stats.approves / stats.threshold) * 100
  const rejectPercent = (stats.rejects / stats.threshold) * 100

  return (
    <div className="mt-4 border-t pt-4">
      {/* 投票状态和进度 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Vote Progress</h4>
          <div className="text-sm text-gray-500">
            {stats.approves + stats.rejects} / {stats.threshold} votes
          </div>
        </div>
        
        {/* 投票进度条 */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-300"
               style={{ width: `${Math.min(approvePercent, 100)}%` }} />
          <div className="h-full bg-red-500 transition-all duration-300 -mt-2"
               style={{ width: `${Math.min(rejectPercent, 100)}%` }} />
        </div>

        {/* 投票详情 */}
        <div className="flex items-center justify-between mt-2 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            <span>{stats.approves} Approve{stats.approves !== 1 && 's'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircleIcon className="h-4 w-4 text-red-500" />
            <span>{stats.rejects} Reject{stats.rejects !== 1 && 's'}</span>
          </div>
        </div>
      </div>

      {/* 投票结果 */}
      {(stats.isApproved || stats.isRejected) && (
        <div className={`flex items-center space-x-2 mb-4 ${
          stats.isApproved ? 'text-green-600' : 'text-red-600'
        }`}>
          {stats.isApproved ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <XCircleIcon className="h-5 w-5" />
          )}
          <span className="font-medium">
            {stats.isApproved ? 'Review approved by vote' : 'Review rejected by vote'}
          </span>
        </div>
      )}

      {/* 投票操作区域 */}
      {!hasVoted && !isReviewer && (
        isVoting ? (
          <div className="space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full min-h-[80px] p-2 text-sm border rounded-md"
              placeholder="Add your comment (optional)..."
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVote('approve')}
                className="flex items-center px-3 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Approve Review
              </button>
              <button
                onClick={() => handleVote('reject')}
                className="flex items-center px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Reject Review
              </button>
              <button
                onClick={() => {
                  setIsVoting(false)
                  setComment('')
                }}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsVoting(true)}
            className="px-3 py-1 text-sm text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
          >
            Vote on Review
          </button>
        )
      )}

      {/* 投票列表 */}
      {votes.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Vote History</h4>
          {votes.map((vote) => (
            <div
              key={vote.id}
              className="flex items-start space-x-2 text-sm border-b pb-2"
            >
              <div className={`flex-shrink-0 ${
                vote.voteType === 'approve' ? 'text-green-500' : 'text-red-500'
              }`}>
                {vote.voteType === 'approve' ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  <XCircleIcon className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{vote.voterId}</span>
                  </div>
                  <span className="text-gray-500">
                    {new Date(vote.createdAt).toLocaleString()}
                  </span>
                </div>
                {vote.comment && (
                  <p className="mt-1 text-gray-600">{vote.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 