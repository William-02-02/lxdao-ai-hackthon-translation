import { format } from 'date-fns'

export function formatDate(dateString: string, formatStr: string = 'MM/dd/yyyy') {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ''
    }
    return format(date, formatStr)
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
} 