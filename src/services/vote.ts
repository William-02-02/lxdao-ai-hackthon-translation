import { Vote } from '@/src/types/vote'

const VOTES_KEY = 'translation_dao_votes'

// 获取任务的所有投票
export function getVotesForTask(taskId: string): Vote[] {
  try {
    const votesStr = localStorage.getItem(VOTES_KEY)
    if (!votesStr) return []
    const votes: Vote[] = JSON.parse(votesStr)
    return votes.filter(vote => vote.taskId === taskId)
  } catch (error) {
    console.error('Failed to get votes:', error)
    return []
  }
}

// 获取段落的所有投票
export function getVotesForParagraph(paragraphId: string): Vote[] {
  try {
    const votesStr = localStorage.getItem(VOTES_KEY)
    if (!votesStr) return []
    const votes: Vote[] = JSON.parse(votesStr)
    return votes.filter(vote => vote.paragraphId === paragraphId)
  } catch (error) {
    console.error('Failed to get votes:', error)
    return []
  }
}

// 保存新投票
export function saveVote(vote: Vote): Vote {
  try {
    const votes = getAllVotes()
    const updatedVotes = [...votes, vote]
    localStorage.setItem(VOTES_KEY, JSON.stringify(updatedVotes))
    
    // 触发自定义事件
    window.dispatchEvent(new Event('votesUpdated'))
    return vote
  } catch (error) {
    console.error('Failed to save vote:', error)
    throw error
  }
}

// 获取所有投票
export function getAllVotes(): Vote[] {
  try {
    const votesStr = localStorage.getItem(VOTES_KEY)
    if (!votesStr) return []
    return JSON.parse(votesStr)
  } catch (error) {
    console.error('Failed to get all votes:', error)
    return []
  }
}

// 初始化投票存储
export function initializeVoteStorage() {
  if (!localStorage.getItem(VOTES_KEY)) {
    localStorage.setItem(VOTES_KEY, JSON.stringify([]))
  }
} 