export interface LanguagePair {
  count: number
  percentage: number
}

export interface PlatformStats {
  platform: {
    totalTasks: number
    totalUsers: number
    totalBounty: number
    activeTasks: number
  }
  languages: {
    [key: string]: LanguagePair
  }
} 