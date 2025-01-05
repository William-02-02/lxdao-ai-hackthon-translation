'use client'

import { useEffect } from 'react'
import { initializeStorage, initializeMockData } from '@/src/services/storage'
import { MOCK_TASKS } from '@/src/mocks/data/tasks'

export default function StorageInitializer() {
  useEffect(() => {
    initializeStorage()
    // initializeMockData(MOCK_TASKS)
  }, [])

  return null
} 