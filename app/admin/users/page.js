'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Ban, UserCheck, Copy, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      
      if (res.ok) {
        setUsers(data.users || [])
      } else {
        toast.error(data.error || 'Failed to load users')
      }
    } catch (error) {
      console.error('Load users error:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleBan = async (id, username) => {
    if (!confirm(`Are you sure you want to ban ${username}?`)) return
    
    try {
      const res = await fetch(`/api/admin/users/${id}/ban`, { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        toast.success('User banned successfully')
        loadUsers()
      } else {
        toast.error(data.error || 'Failed to ban user')
      }
    } catch (error) {
      console.error('Ban error:', error)
      toast.error('Failed to ban user')
    }
  }

  const handleUnban = async (id, username) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/unban`, { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        toast.success('User unbanned successfully')
        loadUsers()
      } else {
        toast.error(data.error || 'Failed to unban user')
      }
    } catch (error) {
      console.error('Unban error:', error)
      toast.error('Failed to unban user')
    }
  }

  const copyDiscordId = (id) => {
    navigator.clipboard.writeText(id)
    toast.success('Discord ID copied!')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
          <p className="text-gray-400">Manage platform users</p>
        </div>
        <div className="glass-card px-4 py-2 rounded-xl">
          <p className="text-2xl font-bold text-white">{users.length}</p>
          <p className="text-sm text-gray-400">Total Users</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Discord ID</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Joined</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const avatarUrl = user.avatar
                    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
                    : 'https://cdn.discordapp.com/embed/avatars/0.png'

                  return (
                    <tr key={user._id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={avatarUrl} alt={user.username} />
                            <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium">{user.username}</p>
                              {user.isAdmin && (
                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-medium flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  Admin
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">#{user.discriminator}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{user.email}</td>
                      <td className="p-4">
                        <button
                          onClick={() => copyDiscordId(user.discordId)}
                          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                        >
                          <span className="text-sm font-mono">{user.discordId}</span>
                          <Copy className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${user.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : ''}
                          ${user.status === 'banned' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : ''}
                        `}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {user.status === 'active' ? (
                          <Button
                            onClick={() => handleBan(user._id, user.username)}
                            size="sm"
                            variant="outline"
                            disabled={user.isAdmin}
                            className={`border-red-500/30 hover:bg-red-500/10 text-red-500 ${
                              user.isAdmin ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={user.isAdmin ? 'Cannot ban admin users' : 'Ban user'}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleUnban(user._id, user.username)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Unban
                          </Button>
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
