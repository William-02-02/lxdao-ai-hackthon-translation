'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getTranslation } from '@/src/services/coze'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Toast from '@/src/components/common/Toast'
import { saveTask } from '@/src/mocks/data/tasks'
import { validateTask } from '@/src/utils/validation'
import { testCozeAPI } from '@/src/utils/test-coze'
import { CozeAPI, ChatEventType, RoleType, COZE_CN_BASE_URL } from '@coze/api'
import { TaskStatus, ParagraphStatus } from '@/src/types/index'
import { startTranslation } from '@/src/services/translation'
import { updateTaskInStorage } from '@/src/services/storage'
import { createCozeClient } from '@/src/services/coze'
import { v4 as uuidv4 } from 'uuid'

interface CreateTaskFormProps {
  onClose?: () => void
}

const COZE_BOT_ID = process.env.NEXT_PUBLIC_COZE_BOT_ID
const CREATOR_ADDRESS = process.env.NEXT_PUBLIC_CREATOR_ADDRESS || '0x123...789'

export default function CreateTaskForm({ onClose }: CreateTaskFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    sourceContent: '',
    sourceLang: 'en',
    targetLang: 'zh',
    bounty: ''
  })
  const [isTranslating, setIsTranslating] = useState(false)
  const [progress, setProgress] = useState({
    total: 0,
    completed: 0
  })
  const [toastConfig, setToastConfig] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    show: boolean
  }>({
    message: '',
    type: 'error',
    show: false
  })
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [translateImmediately, setTranslateImmediately] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])
    
    // 表单验证
    const errors = validateTask(formData)
    if (errors.length > 0) {
      setValidationErrors(errors)
      setToastConfig({
        message: errors[0],
        type: 'error',
        show: true
      })
      return
    }

    setIsTranslating(true)
    let finalTaskStatus: TaskStatus = 'pending'
    
    try {
      // 1. 创建任务基本信息
      const taskData = {
        id: uuidv4(),
        title: formData.title,
        sourceContent: formData.sourceContent,
        sourceLang: formData.sourceLang,
        targetLang: formData.targetLang,
        bounty: Number(formData.bounty),
        createdAt: new Date().toISOString(),
        createdBy: CREATOR_ADDRESS,
        status: 'pending' as TaskStatus,
        reviewedBy: [] as string[],
        paragraphs: formData.sourceContent
          .split('\n\n')
          .filter(p => p.trim())
          .map((content, index) => ({
            id: `p${Date.now()}-${index}`,
            content,
            translation: '',
            status: 'pending' as ParagraphStatus,
            reviewers: []
          }))
      }

      // 2. 保存任务
      const savedTask = saveTask(taskData)
      console.log('Task created:', savedTask)

      // 3. 如果选择立即翻译，启动翻译
      if (translateImmediately) {
        setProgress({ total: taskData.paragraphs.length, completed: 0 })
        
        // 更新任务状态为翻译中
        const updatedTask = {
          ...savedTask,
          status: 'translating' as TaskStatus
        }
        updateTaskInStorage(updatedTask)

        // 对每个段落进行翻译
        const updatedParagraphs = [...taskData.paragraphs]
        for (const [index, paragraph] of taskData.paragraphs.entries()) {
          try {
            const cozeClient = createCozeClient()
            let translation = ''
            
            const stream = await cozeClient.chat.stream({
              bot_id: process.env.NEXT_PUBLIC_COZE_BOT_ID!,
              additional_messages: [
                {
                  role: RoleType.User,
                  content: `Translate from ${taskData.sourceLang} to ${taskData.targetLang}: ${paragraph.content}`,
                  content_type: 'text'
                }
              ]
            })

            for await (const part of stream) {
              if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
                translation += part.data.content
              }
            }

            const paragraphIndex = updatedParagraphs.findIndex(p => p.id === paragraph.id)
            if (paragraphIndex !== -1) {
              updatedParagraphs[paragraphIndex] = {
                ...paragraph,
                translation,
                status: 'translated' as ParagraphStatus
              }
            }

            // 更新进度
            setProgress(prev => ({ ...prev, completed: index + 1 }))

            // 实时更新任务状态
            const taskWithTranslation = {
              ...updatedTask,
              paragraphs: updatedParagraphs
            }
            updateTaskInStorage(taskWithTranslation)
          } catch (error) {
            console.error(`Failed to translate paragraph ${index + 1}:`, error)
            throw new Error(`Failed to translate paragraph ${index + 1}`)
          }
        }

        // 检查是否所有段落都已翻译完成
        const allTranslated = updatedParagraphs.every(p => p.status === 'translated')
        finalTaskStatus = allTranslated ? ('reviewing' as TaskStatus) : ('failed' as TaskStatus)
        
        // 更新最终任务状态
        const finalTask = {
          ...updatedTask,
          status: finalTaskStatus,
          paragraphs: updatedParagraphs
        }
        updateTaskInStorage(finalTask)
      }

      // 4. 显示成功提示
      setToastConfig({
        message: `Task created successfully! ${translateImmediately ? (finalTaskStatus === ('reviewing' as TaskStatus) ? 'Translation completed and ready for review.' : 'Translation failed.') : ''}`,
        type: finalTaskStatus === ('reviewing' as TaskStatus) ? 'success' : 'error',
        show: true
      })

      // 5. 关闭表单并跳转
      setTimeout(() => {
        if (onClose) {
          onClose()
        }
        router.push('/tasks')
      }, 1000)
    } catch (error) {
      console.error('Failed to create task:', error)
      setToastConfig({
        message: error instanceof Error ? error.message : 'Failed to create task',
        type: 'error',
        show: true
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleTest = async () => {
    setToastConfig({
      message: 'Testing Coze API connection...',
      type: 'info',
      show: true
    })

    const success = await testCozeAPI()

    setToastConfig({
      message: success ? 'API test successful!' : 'API test failed. Check console for details.',
      type: success ? 'success' : 'error',
      show: true
    })
  }

  const handlePreviewTranslation = async () => {
    if (!formData.sourceContent) {
      setToastConfig({
        show: true,
        message: 'Please enter source content',
        type: 'error'
      })
      return
    }

    setIsTranslating(true)
    try {
      const cozeClient = createCozeClient()
      const stream = await cozeClient.chat.stream({
        bot_id: COZE_BOT_ID!,
        additional_messages: [
          {
            role: RoleType.User,
            content: `Translate from ${formData.sourceLang} to ${formData.targetLang}: ${formData.sourceContent}`,
            content_type: 'text'
          }
        ]
      })

      let translation = ''
      for await (const part of stream) {
        if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
          translation += part.data.content
          // 实时更新预览
          setFormData(prev => ({
            ...prev,
            previewTranslation: translation
          }))
        }
      }

      setToastConfig({
        show: true,
        message: 'Translation preview generated',
        type: 'success'
      })
    } catch (error) {
      console.error('Translation preview failed:', error)
      setToastConfig({
        show: true,
        message: error instanceof Error ? error.message : 'Translation preview failed',
        type: 'error'
      })
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationErrors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul role="list" className="list-disc space-y-1 pl-5">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="sourceContent" className="block text-sm font-medium text-gray-700">
          Source Content
        </label>
        <textarea
          id="sourceContent"
          rows={6}
          value={formData.sourceContent}
          onChange={(e) => setFormData({ ...formData, sourceContent: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sourceLang" className="block text-sm font-medium text-gray-700">
            Source Language
          </label>
          <select
            id="sourceLang"
            value={formData.sourceLang}
            onChange={(e) => {
              const newSourceLang = e.target.value
              setFormData(prev => ({
                ...prev,
                sourceLang: newSourceLang,
                targetLang: newSourceLang === prev.targetLang ? 
                  (newSourceLang === 'en' ? 'zh' : 'en') : 
                  prev.targetLang
              }))
            }}
            disabled={isTranslating}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
          >
            <option value="en">English</option>
            <option value="zh">Chinese</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <div>
          <label htmlFor="targetLang" className="block text-sm font-medium text-gray-700">
            Target Language
          </label>
          <select
            id="targetLang"
            value={formData.targetLang}
            onChange={(e) => {
              const newTargetLang = e.target.value
              setFormData(prev => ({
                ...prev,
                targetLang: newTargetLang
              }))
            }}
            disabled={isTranslating}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
          >
            {['zh', 'en', 'es'].filter(lang => lang !== formData.sourceLang).map(lang => (
              <option key={lang} value={lang}>
                {lang === 'en' ? 'English' : lang === 'zh' ? 'Chinese' : 'Spanish'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="bounty" className="block text-sm font-medium text-gray-700">
          Bounty (USDT)
        </label>
        <input
          type="number"
          id="bounty"
          value={formData.bounty}
          onChange={(e) => setFormData({ ...formData, bounty: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div className="flex items-center">
        <input
          id="translateImmediately"
          type="checkbox"
          checked={translateImmediately}
          onChange={(e) => setTranslateImmediately(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="translateImmediately" className="ml-2 block text-sm text-gray-900">
          Start translation immediately
        </label>
      </div>

      {isTranslating && progress.total > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Translating paragraphs...
            </span>
            <span className="text-sm font-medium text-gray-900">
              {progress.completed}/{progress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all"
              style={{ width: `${(progress.completed / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
          disabled={isTranslating}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isTranslating}
        >
          {isTranslating ? 'Creating...' : 'Create Task'}
        </button>
      </div>

      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        show={toastConfig.show}
        onClose={() => setToastConfig(prev => ({ ...prev, show: false }))}
      />
    </form>
  )
} 