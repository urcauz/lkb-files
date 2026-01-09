'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Users, UserCheck, FileText, Heart, Activity, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics')
      const data = await res.json()
      
      if (res.ok) {
        setStats(data)
      } else {
        toast.error(data.error || 'Failed to load analytics')
      }
    } catch (error) {
      console.error('Load analytics error:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: '+12%'
    },
    {
      title: 'Pending Requests',
      value: stats?.stats?.pendingRequests || 0,
      icon: UserCheck,
      color: 'from-yellow-500 to-orange-500',
      trend: '3 new'
    },
    {
      title: 'Total Posts',
      value: stats?.stats?.totalPosts || 0,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      trend: '+5'
    },
    {
      title: 'Total Likes',
      value: stats?.stats?.totalLikes || 0,
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      trend: '+24'
    }
  ]

  // Format user growth data for chart
  const userGrowthData = stats?.userGrowth?.map(item => ({
    date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: item.count
  })) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="glass-card p-6 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/30">
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">User Growth</h2>
          </div>
          {userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af" 
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(26, 26, 36, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              No data available yet
            </div>
          )}
        </div>

        {/* Top Posts */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="h-5 w-5 text-red-400" />
            <h2 className="text-xl font-bold text-white">Top Posts</h2>
          </div>
          <div className="space-y-4">
            {stats?.topPosts?.slice(0, 5).map((post, index) => (
              <div key={post._id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-gray-400 text-center py-8">No posts yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-5 w-5 text-green-400" />
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {stats?.recentActivity?.map((activity) => (
            <div key={activity._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <div className="flex-1">
                <p className="text-white text-sm">
                  <span className="font-medium">{activity.action.replace(/_/g, ' ')}</span>
                  {activity.details?.username && ` by ${activity.details.username}`}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )) || (
            <p className="text-gray-400 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}
