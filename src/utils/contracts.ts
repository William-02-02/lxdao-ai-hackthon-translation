import { ethers } from 'ethers'

export async function createTask(
  contract: ethers.Contract,
  content: string[],
  bounty: number
) {
  try {
    const tx = await contract.createTask(content, ethers.parseEther(bounty.toString()))
    await tx.wait()
    return tx.hash
  } catch (error) {
    console.error('Failed to create task:', error)
    throw error
  }
}

export async function submitVote(
  contract: ethers.Contract,
  taskId: number,
  paragraphId: number,
  approved: boolean,
  comment: string
) {
  try {
    const tx = await contract.submitVote(taskId, paragraphId, approved, comment)
    await tx.wait()
    return tx.hash
  } catch (error) {
    console.error('Failed to submit vote:', error)
    throw error
  }
} 