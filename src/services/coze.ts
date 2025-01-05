import { CozeAPI, ChatEventType, RoleType, COZE_CN_BASE_URL } from '@coze/api'
import { getCurrentToken } from './oauth'

const COZE_BOT_ID = process.env.NEXT_PUBLIC_COZE_BOT_ID
const COZE_API_KEY = process.env.NEXT_PUBLIC_COZE_API_KEY

interface TranslationRequest {
  sourceContent: string
  sourceLang: string
  targetLang: string
}

// 创建 Coze 客户端
export function createCozeClient() {
  const token = getCurrentToken()
  if (!token) {
    throw new Error('No valid token found')
  }

  return new CozeAPI({
    baseURL: COZE_CN_BASE_URL,
    token: COZE_API_KEY!,
    allowPersonalAccessTokenInBrowser: true
  })
}

// 导出需要的类型和常量
export { ChatEventType, RoleType }

export async function getTranslation({ sourceContent, sourceLang, targetLang }: TranslationRequest) {
  try {
    const token = getCurrentToken()
    
    if (!token) {
      // 只在需要翻译时才重定向到授权页面
      const currentPath = window.location.pathname + window.location.search
      window.location.href = `/auth?returnTo=${encodeURIComponent(currentPath)}`
      return
    }

    const cozeClient = createCozeClient()
    
    // 使用流式响应
    const stream = await cozeClient.chat.stream({
      bot_id: COZE_BOT_ID!,
      additional_messages: [
        {
          role: RoleType.User,
          content: `Translate from ${sourceLang} to ${targetLang}: ${sourceContent}`,
          content_type: 'text'
        }
      ]
    })

    let translation = ''

    // 处理流式响应
    for await (const part of stream) {
      if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        // 实时获取翻译内容
        translation += part.data.content
        
        // 通知 UI 更新状态
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('translation_status', {
            detail: { 
              status: 'in_progress',
              content: translation 
            }
          }))
        }
      }
    }

    // 翻译完成
    if (translation) {
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('translation_status', {
          detail: { 
            status: 'completed',
            content: translation 
          }
        }))
      }
      return translation
    }

    throw new Error('No translation result')
  } catch (error) {
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('translation_status', {
        detail: { 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
      }))
    }
    console.error('Translation error:', error)
    throw error
  }
} 