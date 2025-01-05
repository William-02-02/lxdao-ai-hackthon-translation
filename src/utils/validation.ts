export function validateTask(data: any) {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push('Title is required')
  }

  if (!data.sourceContent?.trim()) {
    errors.push('Source content is required')
  }

  if (!data.sourceLang || !data.targetLang) {
    errors.push('Source and target languages are required')
  }

  if (data.sourceLang === data.targetLang) {
    errors.push('Source and target languages must be different')
  }

  if (!data.bounty || Number(data.bounty) <= 0) {
    errors.push('Bounty must be greater than 0')
  }

  return errors
} 