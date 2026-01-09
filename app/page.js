'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sparkles, Lock } from 'lucide-react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Check if user is approved
      fetch('/api/auth/check')
        .then(res => res.json())
        .then(data => {
          if (data.approved) {
            router.push('/feed')
          } else if (data.status === 'pending') {
            router.push('/pending')
          } else if (data.status === 'banned') {
            router.push('/banned')
          }
        })
        .catch(err => console.error('Check error:', err))
    }
  }, [status, session, router])

  if (!mounted) {
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg" />
      <div className="grid-pattern absolute inset-0" />
      
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-12 rounded-3xl max-w-md w-full transform hover:scale-[1.02] transition-transform duration-300">
          <div className="text-center space-y-6">
            {/* Logo/Icon */}
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/50">
                <Lock className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                LKB Leaks
              </h1>
              <p className="text-gray-400 text-sm">
                Exclusive content for you bbgs 😘
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 py-6">
              <div className="flex items-center gap-3 text-left">
                <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <p className="text-sm text-gray-300">Premium exclusive content <br></br>(includes nudes of anda)</p>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Lock className="h-5 w-5 text-violet-400 flex-shrink-0" />
                <p className="text-sm text-gray-300">Secure Discord authentication by Diddy himself</p>
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={() => signIn('discord', { callbackUrl: '/' })}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-lg shadow-indigo-500/30 btn-shimmer"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Login with yo Discord
            </Button>

            {/* Footer */}
            <p className="text-xs text-gray-500 pt-4">
              By logging in, gng you agree to request access which will be reviewed by the creator.
              Also gng, Don't forget Cauz 📞😔
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
