'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Copy, Shield, Webhook, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      
      if (res.ok) {
        setSettings(data)
      } else {
        toast.error(data.error || 'Failed to load settings')
      }
    } catch (error) {
      console.error('Load settings error:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
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
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Platform configuration and admin settings</p>
      </div>

      {/* Admin Discord IDs */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Admin Discord IDs</h2>
        </div>
        
        <div className="space-y-4">
          {/* Instructions */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-blue-300 font-medium">
                  How to add or remove admins:
                </p>
                <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Update the <code className="px-2 py-0.5 rounded bg-black/30 font-mono text-xs">ADMIN_DISCORD_IDS</code> environment variable in your <code className="px-2 py-0.5 rounded bg-black/30 font-mono text-xs">.env</code> file</li>
                  <li>Add Discord IDs separated by commas (no spaces)</li>
                  <li>Restart the application for changes to take effect</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Current Admin IDs */}
          <div>
            <Label className="text-gray-300 mb-2 block">Current Admin Discord IDs</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 rounded-xl bg-black/30 border border-white/10 font-mono text-sm text-white">
                {settings?.adminIds?.join(',') || 'No admins configured'}
              </div>
              <button
                onClick={() => copyToClipboard(settings?.adminIds?.join(',') || '')}
                className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Admin Users */}
          {settings?.adminUsers && settings.adminUsers.length > 0 && (
            <div>
              <Label className="text-gray-300 mb-2 block">Users with Admin Access</Label>
              <div className="space-y-2">
                {settings.adminUsers.map((user) => {
                  const avatarUrl = user.avatar
                    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
                    : 'https://cdn.discordapp.com/embed/avatars/0.png'

                  return (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarUrl} alt={user.username} />
                        <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-xs text-gray-400 font-mono">{user.discordId}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-medium flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Admin
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discord Webhook */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Webhook className="h-5 w-5 text-violet-400" />
          <h2 className="text-xl font-bold text-white">Discord Webhook</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-white font-medium">Webhook Status</p>
              <p className="text-sm text-gray-400">
                {settings?.webhookConfigured 
                  ? 'Notifications enabled for new access requests' 
                  : 'No webhook configured'
                }
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              settings?.webhookConfigured
                ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                : 'bg-gray-500/10 text-gray-500 border border-gray-500/30'
            }`}>
              {settings?.webhookConfigured ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-200">
                  To configure Discord webhook notifications, add the <code className="px-2 py-0.5 rounded bg-black/30 font-mono text-xs">DISCORD_WEBHOOK_URL</code> to your <code className="px-2 py-0.5 rounded bg-black/30 font-mono text-xs">.env</code> file and restart the application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Info */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Platform Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between p-3 rounded-xl bg-white/5">
            <span className="text-gray-400">Platform</span>
            <span className="text-white font-medium">Content Platform</span>
          </div>
          <div className="flex justify-between p-3 rounded-xl bg-white/5">
            <span className="text-gray-400">Auth Provider</span>
            <span className="text-white font-medium">Discord OAuth</span>
          </div>
          <div className="flex justify-between p-3 rounded-xl bg-white/5">
            <span className="text-gray-400">Database</span>
            <span className="text-white font-medium">MongoDB</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className = '', ...props }) {
  return (
    <label className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  )
}
