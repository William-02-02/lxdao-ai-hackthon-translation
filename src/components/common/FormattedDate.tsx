'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/src/utils/format'

interface FormattedDateProps {
  date?: string
  format?: string
}

export default function FormattedDate({ date, format }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    if (!date) {
      setFormattedDate('')
      return
    }
    setFormattedDate(formatDate(date, format))
  }, [date, format])

  if (!date) return null
  return <>{formattedDate}</>
} 