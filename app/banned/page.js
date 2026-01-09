'use client'

import { Button } from '@/components/ui/button'
import { Ban, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-12 rounded-3xl max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
              <Ban className="h-16 w-16 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Account Banned
            </h1>
            <p className="text-gray-400">
              Your access has been revoked
            </p>
          </div>

          {/* Info */}
          <div className="glass-card p-4 rounded-xl text-sm text-gray-400">
            <p>
              Your account has been banned by the administrator.
              If you believe this is an error, please contact support.
            </p>
          </div>

          {/* Logout Button */}
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outline"
            className="w-full border-gray-700 hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
