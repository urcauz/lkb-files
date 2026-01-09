'use client'

import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import { toast } from 'sonner'

export default function ActivityPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivity()
  }, [])

  const loadActivity = async () => {
    try {
      const res = await fetch('/api/admin/activity')
      const data = await res.json()
      
      if (res.ok) {
        setActivities(data.activities || [])
      } else {
        toast.error(data.error || 'Failed to load activity')
      }
    } catch (error) {
      console.error('Load activity error:', error)
      toast.error('Failed to load activity')
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action) => {
    const colors = {
      login: 'bg-blue-500/10 text-blue-500',
      request_access: 'bg-yellow-500/10 text-yellow-500',
      approved_user: 'bg-green-500/10 text-green-500',
      denied_user: 'bg-red-500/10 text-red-500',
      banned_user: 'bg-red-500/10 text-red-500',
      unbanned_user: 'bg-green-500/10 text-green-500',
      liked_post: 'bg-pink-500/10 text-pink-500',
    }
    return colors[action] || 'bg-gray-500/10 text-gray-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Activity Log</h1>
        <p className="text-gray-400">Track all platform activities</p>
      </div>

      {/* Activity List */}
      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No activity yet</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                {/* Icon */}
                <div className={`p-2 rounded-lg ${getActionIcon(activity.action)}`}>
                  <Activity className="h-5 w-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {activity.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      {activity.details && Object.keys(activity.details).length > 0 && (
                        <div className="mt-1 text-sm text-gray-400">
                          {Object.entries(activity.details).map(([key, value]) => (
                            <span key={key} className="mr-3">
                              <span className="font-medium">{key}:</span> {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-400">
                        {new Date(activity.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
