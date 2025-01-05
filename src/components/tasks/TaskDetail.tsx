'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon, 
  UserIcon,
  LanguageIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Task } from '@/src/types'
import { getTaskFromStorage, updateTaskInStorage, deleteTaskFromStorage } from '@/src/services/storage'
import { getTranslation } from '@/src/services/coze'
import FormattedDate from '@/src/components/common/FormattedDate'
import dynamic from 'next/dynamic'
import TranslationStatus from '@/src/components/translation/TranslationStatus'
import { startTranslation, stopTranslation, isTranslating } from '@/src/services/translation'
import { useRouter } from 'next/navigation'
import { createCozeClient, RoleType, ChatEventType } from '@/src/services/coze'

// 动态导入 Toast 组件
const Toast = dynamic(() => import('@/src/components/common/Toast'), {
  ssr: false
})

interface TaskDetailProps {
  taskId: string
}

interface TranslationStatusDetail {
  status: 'created' | 'in_progress' | 'completed' | 'failed'
  content?: string
  error?: string
}

export default function TaskDetail({ taskId }: TaskDetailProps) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [translatingParagraph, setTranslatingParagraph] = useState<string | null>(null)
  const [toastConfig, setToastConfig] = useState({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  })
  const [translationStatus, setTranslationStatus] = useState<{
    status: TranslationStatusDetail['status']
    show: boolean
    content?: string
  }>({
    status: 'created',
    show: false
  })
  const [isBatchTranslating, setIsBatchTranslating] = useState(false)
  const [batchProgress, setBatchProgress] = useState({
    total: 0,
    completed: 0
  })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadTask = () => {
      const taskData = getTaskFromStorage(taskId)
      setTask(taskData)
      setLoading(false)
    }

    loadTask()

    // 监听存储变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'translation_dao_tasks') {
        loadTask()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [taskId])

  useEffect(() => {
    const handleTranslationStatus = (event: CustomEvent<TranslationStatusDetail>) => {
      const { status, content, error } = event.detail
      setTranslationStatus({
        status,
        show: true,
        content
      })

      if (status === 'failed') {
        setToastConfig({
          show: true,
          message: error || 'Translation failed',
          type: 'error'
        })
      }
    }

    window.addEventListener('translation_status', handleTranslationStatus as EventListener)
    return () => {
      window.removeEventListener('translation_status', handleTranslationStatus as EventListener)
    }
  }, [])

  const handleTranslate = async (paragraphId: string, content: string) => {
    if (!task) return

    setTranslatingParagraph(paragraphId)
    setTranslationStatus({
      status: 'created',
      show: true
    })

    try {
      setTranslationStatus({
        status: 'in_progress',
        show: true
      })

      let translation = ''
      const cozeClient = createCozeClient() // 使用 OAuth 客户端
      
      const stream = await cozeClient.chat.stream({
        bot_id: process.env.NEXT_PUBLIC_COZE_BOT_ID!,
        additional_messages: [
          {
            role: RoleType.User,
            content: `Translate from ${task.sourceLang} to ${task.targetLang}: ${content}`,
            content_type: 'text'
          }
        ]
      })

      // 处理流式响应
      for await (const part of stream) {
        if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
          translation += part.data.content
          // 实时更新翻译状态
          setTranslationStatus(prev => ({
            ...prev,
            content: translation
          }))
        }
      }

      // 更新段落的翻译
      const updatedTask = {
        ...task,
        paragraphs: task.paragraphs.map(p => {
          if (p.id === paragraphId) {
            return {
              ...p,
              translation,
              status: 'translated' as const
            }
          }
          return p
        })
      }

      // 保存到存储
      updateTaskInStorage(updatedTask)
      setTask(updatedTask)

      setTranslationStatus({
        status: 'completed',
        show: true,
        content: translation
      })

      setTimeout(() => {
        setTranslationStatus(prev => ({ ...prev, show: false }))
      }, 3000)
    } catch (error) {
      console.error('Translation failed:', error)
      setTranslationStatus({
        status: 'failed',
        show: true
      })
      setToastConfig({
        show: true,
        message: error instanceof Error ? error.message : 'Translation failed',
        type: 'error'
      })
    } finally {
      setTranslatingParagraph(null)
    }
  }

  const handleBatchTranslate = async () => {
    if (!task) return

    const untranslatedParagraphs = task.paragraphs.filter(p => !p.translation)
    if (untranslatedParagraphs.length === 0) {
      setToastConfig({
        show: true,
        message: 'All paragraphs are already translated',
        type: 'info'
      })
      return
    }

    setIsBatchTranslating(true)
    setBatchProgress({
      total: untranslatedParagraphs.length,
      completed: 0
    })

    try {
      const cozeClient = createCozeClient() // 使用 OAuth 客户端
      const updatedParagraphs = [...task.paragraphs]
      
      for (const [index, paragraph] of untranslatedParagraphs.entries()) {
        if (!paragraph.translation) {
          try {
            let translation = ''
            const stream = await cozeClient.chat.stream({
              bot_id: process.env.NEXT_PUBLIC_COZE_BOT_ID!,
              additional_messages: [
                {
                  role: RoleType.User,
                  content: `Translate from ${task.sourceLang} to ${task.targetLang}: ${paragraph.content}`,
                  content_type: 'text'
                }
              ]
            })

            for await (const part of stream) {
              if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
                translation += part.data.content
                setTranslationStatus({
                  status: 'in_progress',
                  show: true,
                  content: translation
                })
              }
            }

            const paragraphIndex = updatedParagraphs.findIndex(p => p.id === paragraph.id)
            if (paragraphIndex !== -1) {
              updatedParagraphs[paragraphIndex] = {
                ...paragraph,
                translation,
                status: 'translated' as const
              }
            }

            setBatchProgress(prev => ({
              ...prev,
              completed: index + 1
            }))

            // 实时更新任务状态
            const updatedTask = {
              ...task,
              paragraphs: updatedParagraphs
            }
            updateTaskInStorage(updatedTask)
            setTask(updatedTask)
          } catch (error) {
            console.error(`Failed to translate paragraph ${paragraph.id}:`, error)
            // 继续翻译其他段落
          }
        }
      }

      setTranslationStatus({
        status: 'completed',
        show: true
      })
    } catch (error) {
      console.error('Batch translation failed:', error)
      setTranslationStatus({
        status: 'failed',
        show: true
      })
      setToastConfig({
        show: true,
        message: error instanceof Error ? error.message : 'Batch translation failed',
        type: 'error'
      })
    } finally {
      setIsBatchTranslating(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!task) {
    return <div>Task not found</div>
  }

  return (
    <div>
      {/* 返回按钮 */}
      <div className="mb-8">
        <Link href="/tasks" className="text-indigo-600 hover:text-indigo-900 flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Tasks
        </Link>
      </div>

      {/* 任务标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
      </div>

      {/* 任务信息卡片 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Bounty</div>
              <div className="text-lg font-semibold">{task.bounty} USDT</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DocumentTextIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Languages</div>
              <div className="text-sm">
                {task.sourceLang.toUpperCase()} → {task.targetLang.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <UserIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Created By</div>
              <div className="text-sm font-mono">{task.createdBy}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Created At</div>
              <div className="text-sm">
                <FormattedDate date={task.createdAt} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 段落内容 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Content
            </h3>
            <button
              onClick={handleBatchTranslate}
              disabled={isBatchTranslating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <LanguageIcon className="h-4 w-4 mr-2" />
              {isBatchTranslating ? 'Translating...' : 'Translate All'}
            </button>
          </div>
          
          {/* 批量翻译进度条 */}
          {isBatchTranslating && batchProgress.total > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">
                  Translating paragraphs...
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {batchProgress.completed}/{batchProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${(batchProgress.completed / batchProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {task.paragraphs.map((paragraph, index) => (
                <div key={paragraph.id} className="space-y-4">
                  <div className="prose max-w-none">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-gray-500">
                        Paragraph {index + 1}
                      </h4>
                      {!paragraph.translation && (
                        <button
                          onClick={() => handleTranslate(paragraph.id, paragraph.content)}
                          disabled={translatingParagraph === paragraph.id}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          <LanguageIcon className="h-4 w-4 mr-1" />
                          {translatingParagraph === paragraph.id ? 'Translating...' : 'Translate'}
                        </button>
                      )}
                    </div>
                    <p className="text-gray-900">{paragraph.content}</p>
                    {paragraph.translation && (
                      <div className="mt-4 pl-4 border-l-4 border-indigo-100">
                        <h4 className="text-sm font-medium text-gray-500">
                          Translation
                        </h4>
                        <p className="text-gray-900">{paragraph.translation}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${getStatusColor(paragraph.status)}
                    `}>
                      {paragraph.status.charAt(0).toUpperCase() + paragraph.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TranslationStatus
        status={translationStatus.status}
        show={translationStatus.show}
      />

      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        show={toastConfig.show}
        onClose={() => setToastConfig(prev => ({ ...prev, show: false }))}
      />
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'translated':
      return 'bg-blue-100 text-blue-800'
    case 'reviewing':
      return 'bg-purple-100 text-purple-800'
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
} 