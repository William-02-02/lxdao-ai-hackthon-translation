import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWalletStore } from './useWallet'
import TranslationDAO from '../artifacts/contracts/TranslationDAO.sol/TranslationDAO.json'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string

export function useContract() {
  const { provider, signer } = useWalletStore()
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!provider || !signer) return

    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        TranslationDAO.abi,
        signer
      )

      setContract(contract)
      setError(null)
    } catch (err) {
      setError('Failed to load contract')
      console.error(err)
    }
  }, [provider, signer])

  return { contract, error }
} 