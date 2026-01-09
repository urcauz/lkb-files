'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, X, Copy, Filter } from 'lucide-react'
import { toast } from 'sonner'

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [filter])

  const loadRequests = async () => {
    try {
      const res = await fetch(`/api/admin/requests?status=${filter}`)
      const data = await res.json()
      
      if (res.ok) {
        setRequests(data.requests || [])
        setStats(data.stats)
      } else {
        toast.error(data.error || 'Failed to load requests')
      }
    } catch (error) {
      console.error('Load requests error:', error)
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/requests/${id}/approve`, { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        toast.success('User approved successfully!')
        loadRequests()
      } else {
        toast.error(data.error || 'Failed to approve user')
      }
    } catch (error) {
      console.error('Approve error:', error)
      toast.error('Failed to approve user')
    }
  }

  const handleDeny = async (id) => {
    try {
      const res = await fetch(`/api/admin/requests/${id}/deny`, { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        toast.success('Request denied')
        loadRequests()
      } else {
        toast.error(data.error || 'Failed to deny request')
      }
    } catch (error) {
      console.error('Deny error:', error)
      toast.error('Failed to deny request')
    }
  }

  const copyDiscordId = (id) => {
    navigator.clipboard.writeText(id)
    toast.success('Discord ID copied to clipboard!')
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
        <h1 className="text-3xl font-bold text-white mb-2">Access Requests</h1>
        <p className="text-gray-400">Review and manage user access requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
          <p className="text-sm text-gray-400">Total</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-2xl font-bold text-yellow-500">{stats?.pending || 0}</p>
          <p className="text-sm text-gray-400">Pending</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-2xl font-bold text-green-500">{stats?.approved || 0}</p>
          <p className="text-sm text-gray-400">Approved</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-2xl font-bold text-red-500">{stats?.denied || 0}</p>
          <p className="text-sm text-gray-400">Denied</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-400">Filter:</span>
          {['all', 'pending', 'approved', 'denied'].map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              size="sm"
              variant={filter === status ? 'default' : 'outline'}
              className={filter === status ? 'bg-indigo-500' : 'border-gray-700'}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Discord ID</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400">
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => {
                  const avatarUrl = request.avatar
                    ? `https://cdn.discordapp.com/avatars/${request.discordId}/${request.avatar}.png`
                    : 'https://cdn.discordapp.com/embed/avatars/0.png'

                  return (
                    <tr key={request._id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={avatarUrl} alt={request.username} />
                            <AvatarFallback>{request.username?.[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{request.username}</p>
                            <p className="text-xs text-gray-400">#{request.discriminator}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{request.email}</td>
                      <td className="p-4">
                        <button
                          onClick={() => copyDiscordId(request.discordId)}
                          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                        >
                          <span className="text-sm font-mono">{request.discordId}</span>
                          <Copy className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${request.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' : ''}
                          ${request.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : ''}
                          ${request.status === 'denied' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : ''}
                        `}>
                          {request.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 text-sm">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {request.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleApprove(request._id)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleDeny(request._id)}
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 hover:bg-red-500/10 text-red-500"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Deny
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
