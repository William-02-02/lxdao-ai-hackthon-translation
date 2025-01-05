import ProfileInfo from '@/src/components/profile/ProfileInfo'
import TaskHistory from '@/src/components/profile/TaskHistory'
import StatsCards from '@/src/components/profile/StatsCards'

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* 用户基本信息 */}
        <ProfileInfo />
        
        {/* 统计卡片 */}
        <StatsCards />

        {/* 任务历史 */}
        <TaskHistory />
      </div>
    </div>
  )
} 