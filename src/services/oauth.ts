import {
  CozeAPI,
  getWebAuthenticationUrl,
  COZE_CN_BASE_URL
} from '@coze/api'

import { OAUTH_CONFIG } from '@/src/config/oauth'

const TOKEN_STORAGE_KEY = 'coze_oauth_token'

interface OAuthToken {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at: number
}

// 获取授权 URL
export function getAuthUrl(state: string = 'translation_dao') {
  if (!OAUTH_CONFIG.clientId || !OAUTH_CONFIG.redirectUrl) {
    throw new Error('Missing OAuth configuration')
  }

  return getWebAuthenticationUrl({
    clientId: OAUTH_CONFIG.clientId,
    redirectUrl: OAUTH_CONFIG.redirectUrl,
    baseURL: COZE_CN_BASE_URL,
    state,
    scope: 'chat'
  })
}

// 使用授权码获取 Token
export async function getAccessToken(code: string) {
  try {
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get access token')
    }

    const oauthToken = await response.json()

    // 添加过期时间
    const tokenWithExpiry: OAuthToken = {
      ...oauthToken,
      expires_at: Date.now() + oauthToken.expires_in * 1000
    }

    // 保存 Token
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenWithExpiry))
    return tokenWithExpiry
  } catch (error) {
    console.error('OAuth token error:', error)
    throw error
  }
}

// 获取当前 Token
export function getCurrentToken(): OAuthToken | null {
  try {
    const tokenStr = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!tokenStr) return null

    const token: OAuthToken = JSON.parse(tokenStr)
    
    if (Date.now() >= token.expires_at) {
      return null
    }

    return token
  } catch (error) {
    console.error('Error getting current token:', error)
    return null
  }
}

// 创建 API 客户端
export function createCozeClient() {
  const token = getCurrentToken()
  if (!token) {
    throw new Error('No valid token found')
  }

  return new CozeAPI({
    baseURL: COZE_CN_BASE_URL,
    token: token.access_token
  })
} 