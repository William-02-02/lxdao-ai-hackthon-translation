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
  currentVoterId: string
  onVote: (voteType: VoteType, comment: string) => Promise<void>
}

export default function VoteSection({
  paragraph,
  taskId,
  reviewerId,
  reviewId,
  votes,
  currentVoterId,
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
  const hasVoted = stats.voters.includes(currentVoterId)
  // 检查当前用户是否是审核者本人
  const isReviewer = currentVoterId === reviewerId

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Votes on Review:</span>
          <span className="text-sm text-gray-500">
            {stats.approves} approve{stats.approves !== 1 ? 's' : ''} /
            {stats.rejects} reject{stats.rejects !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {stats.voters.map((voter, index) => (
            <UserCircleIcon
              key={index}
              className="h-6 w-6 text-gray-400"
              title={`Voter: ${voter}`}
            />
          ))}
        </div>
      </div>

      {/* 投票进度条 */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-green-500 h-2.5 rounded-full transition-all"
          style={{
            width: `${(stats.approves / stats.threshold) * 100}%`
          }}
        />
      </div>

      {/* 投票状态 */}
      {(stats.isApproved || stats.isRejected) ? (
        <div className={`flex items-center space-x-2 ${
          stats.isApproved ? 'text-green-600' : 'text-red-600'
        }`}>
          {stats.isApproved ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <XCircleIcon className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">
            {stats.isApproved ? 'Review approved by vote' : 'Review rejected by vote'}
          </span>
        </div>
      ) : isVoting ? (
        <div className="space-y-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[80px] p-2 text-sm border rounded-md"
            placeholder="Add your comment on this review..."
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote('approve')}
              className="px-3 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Approve Review
            </button>
            <button
              onClick={() => handleVote('reject')}
              className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
            >
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
      ) : !hasVoted && !isReviewer ? (
        <button
          onClick={() => setIsVoting(true)}
          className="px-3 py-1 text-sm text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
        >
          Vote on Review
        </button>
      ) : isReviewer ? (
        <div className="text-sm text-gray-500">
          You cannot vote on your own review
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          You have already voted on this review
        </div>
      )}

      {/* 投票列表 */}
      {votes.length > 0 && (
        <div className="mt-4 space-y-2">
          {votes.map((vote, index) => (
            <div
              key={vote.id}
              className={`flex items-start space-x-2 text-sm ${
                index !== votes.length - 1 ? 'border-b pb-2' : ''
              }`}
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
                  <span className="font-medium">{vote.voterId}</span>
                  <span className="text-gray-500">
                    {new Date(vote.createdAt).toLocaleDateString()}
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