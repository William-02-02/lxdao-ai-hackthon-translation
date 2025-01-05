export const OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_COZE_CLIENT_ID!,
  redirectUrl: process.env.NEXT_PUBLIC_COZE_REDIRECT_URL!,
  baseURL: process.env.NEXT_PUBLIC_COZE_BASE_URL!
}

export function validateOAuthConfig() {
  const missingConfigs = Object.entries(OAUTH_CONFIG)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingConfigs.length > 0) {
    throw new Error(`Missing OAuth configuration: ${missingConfigs.join(', ')}`)
  }

  console.log('OAuth Config (without secret):', {
    ...OAUTH_CONFIG,
    clientSecret: '[HIDDEN]'
  })
} 