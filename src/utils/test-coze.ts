import { CozeAPI, ChatEventType, RoleType, COZE_CN_BASE_URL } from '@coze/api'

const COZE_API_KEY = process.env.NEXT_PUBLIC_COZE_API_KEY
const COZE_BOT_ID = process.env.NEXT_PUBLIC_COZE_BOT_ID

const cozeClient = new CozeAPI({
  baseURL: COZE_CN_BASE_URL,
  token: COZE_API_KEY!,
  allowPersonalAccessTokenInBrowser: true
})

interface TestOptions {
  onStream?: (text: string) => void
}

export async function testCozeAPI(options: TestOptions = {}) {
  try {
    const stream = await cozeClient.chat.stream({
      bot_id: COZE_BOT_ID!,
      additional_messages: [
        {
          role: RoleType.User,
          content: 'Hello, this is a test message. Please respond in both English and Chinese.',
          content_type: 'text'
        }
      ]
    })

    let response = ''
    for await (const part of stream) {
      if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        response += part.data.content
        options.onStream?.(part.data.content)
      }
    }

    return {
      success: true,
      content: response
    }
  } catch (error) {
    console.error('Test failed:', error)
    throw error
  }
} 