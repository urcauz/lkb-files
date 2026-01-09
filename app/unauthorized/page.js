'use client'

import { Button } from '@/components/ui/button'
import { XCircle, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-12 rounded-3xl max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Access Denied
            </h1>
            <p className="text-gray-400">
              You are not authorized to access the admin panel
            </p>
          </div>

          {/* Info */}
          <div className="glass-card p-4 rounded-xl text-sm text-gray-400">
            <p>
              Only users with admin Discord IDs can access the admin panel.
              If you believe this is an error, please contact the administrator.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/feed')}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Feed
            </Button>
            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              variant="outline"
              className="w-full border-gray-700 hover:bg-gray-800"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
