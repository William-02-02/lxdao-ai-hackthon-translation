import { NextResponse } from 'next/server'
import { getWebOAuthToken, COZE_CN_BASE_URL } from '@coze/api'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    const oauthToken = await getWebOAuthToken({
      clientId: process.env.NEXT_PUBLIC_COZE_CLIENT_ID!,
      clientSecret: process.env.COZE_CLIENT_SECRET!,
      redirectUrl: process.env.NEXT_PUBLIC_COZE_REDIRECT_URL!,
      baseURL: COZE_CN_BASE_URL,
      code,
      grantType: 'authorization_code'
    })

    return NextResponse.json(oauthToken)
  } catch (error) {
    console.error('Token exchange error:', error)
    return NextResponse.json(
      { error: 'Failed to exchange token' },
      { status: 500 }
    )
  }
} 