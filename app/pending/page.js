'use client'
import Image from 'next/image'
import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Clock, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function PendingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
    if (status === 'authenticated') {
      // Check approval status
      fetch('/api/auth/check')
        .then(res => res.json())
        .then(data => {
          if (data.approved) {
            router.push('/feed')
          }
        })
    }
  }, [status, router])

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }
  const paymentQrUrl =
      'https://cdn.discordapp.com/attachments/1449763506311135305/1459238933626884261/IMG_2433.png?ex=69628da9&is=69613c29&hm=746301518b2993d9f18a945d5a51833b1a835aef2222a56f2edfec44531a3254&'


  const avatarUrl = session.user.avatar
    ? `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png`
    : 'https://cdn.discordapp.com/embed/avatars/0.png'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-12 rounded-3xl max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 ring-4 ring-indigo-500/30">
              <AvatarImage src={avatarUrl} alt={session.user.username} />
              <AvatarFallback>{session.user.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          {/* Status Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Pending Approval
            </h1>
            <p className="text-gray-400">
              Your access request is under review
            </p>
          </div>

          {/* User Info */}
          <div className="glass-card p-4 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Username</span>
              <span className="text-white font-medium">{session.user.username}</span>
            </div>
            
          </div>

          {/* Info */}
          <div className="space-y-3 text-sm text-gray-400">
            <p>
              The creator will review your request and approve or deny access.
            </p>
            <p>
              You'll be able to access the platform once approved.
            </p>
          </div>
          {/* Payment Section */}
<div className="glass-card p-5 rounded-xl space-y-4 border border-indigo-500/30">
  <h2 className="text-lg font-semibold text-white text-center">
    Payment Required
  </h2>

  <p className="text-sm text-gray-400 text-center">
    To get access, complete the payment using the QR code below and send a
    screenshot of the successful payment to <span className="text-white font-medium">Anda</span>.
  </p>

  {/* QR Code */}
  <div className="flex justify-center">
    <div className="bg-white p-3 rounded-xl">
      <Image
        src={paymentQrUrl}
        alt="Payment QR Code"
        width={200}
        height={200}
        className="rounded-lg"
      />
    </div>
  </div>

  <p className="text-xs text-gray-500 text-center">
    Access will be granted manually after payment verification.
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
