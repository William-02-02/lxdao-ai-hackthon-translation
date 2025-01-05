import { getTranslation } from './coze'
import { getTaskFromStorage, updateTaskInStorage } from './storage'
import { Task, TaskStatus } from '@/src/types'

const TRANSLATION_TASKS = new Map<string, AbortController>()

export async function startTranslation(taskId: string) {
  // 如果已经在翻译，先停止
  if (TRANSLATION_TASKS.has(taskId)) {
    await stopTranslation(taskId)
  }

  const task = getTaskFromStorage(taskId)
  if (!task) return

  const abortController = new AbortController()
  TRANSLATION_TASKS.set(taskId, abortController)

  try {
    // 更新任务状态为翻译中
    updateTaskInStorage({
      ...task,
      status: 'translating'
    })

    // 翻译每个段落
    for (const paragraph of task.paragraphs) {
      // 检查是否被取消
      if (abortController.signal.aborted) {
        throw new Error('Translation cancelled')
      }

      if (!paragraph.translation) {
        const translation = await getTranslation({
          sourceContent: paragraph.content,
          sourceLang: task.sourceLang,
          targetLang: task.targetLang
        })

        // 更新段落翻译
        const updatedParagraphs = task.paragraphs.map(p =>
          p.id === paragraph.id
            ? { ...p, translation, status: 'translated' }
            : p
        )

        // 更新存储
        updateTaskInStorage({
          ...task,
          paragraphs: updatedParagraphs
        })
      }
    }

    // 更新任务状态为已翻译
    updateTaskInStorage({
      ...task,
      status: 'translated'
    })
  } catch (error) {
    // 更新任务状态为失败或已停止
    updateTaskInStorage({
      ...task,
      status: abortController.signal.aborted ? 'stopped' : 'failed'
    })
    throw error
  } finally {
    TRANSLATION_TASKS.delete(taskId)
  }
}

export async function stopTranslation(taskId: string) {
  const abortController = TRANSLATION_TASKS.get(taskId)
  if (abortController) {
    abortController.abort()
    TRANSLATION_TASKS.delete(taskId)
    
    const task = getTaskFromStorage(taskId)
    if (task) {
      updateTaskInStorage({
        ...task,
        status: 'stopped'
      })
    }
  }
}

export function isTranslating(taskId: string): boolean {
  return TRANSLATION_TASKS.has(taskId)
} 