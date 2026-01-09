'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Activity,
  UserCheck,
  Menu,
  X,
  Home
} from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (status === 'authenticated' && !session?.user?.isAdmin) {
      router.push('/unauthorized')
    }
  }, [status, session, router])

  if (status === 'loading' || !session || !session.user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/requests', icon: UserCheck, label: 'Access Requests' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/posts', icon: FileText, label: 'Posts' },
    { href: '/admin/activity', icon: Activity, label: 'Activity Log' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen
        w-64 glass-card border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Back to Feed */}
          <Link href="/feed">
            <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
              <Home className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 glass-card border-b border-white/10 p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
