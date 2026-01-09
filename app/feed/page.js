'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, Lock, LogOut, Settings, Menu, X } from 'lucide-react'
import { toast } from 'sonner'

export default function FeedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      // Check if user is approved
      fetch('/api/auth/check')
        .then(res => res.json())
        .then(data => {
          if (!data.approved) {
            if (data.status === 'pending') {
              router.push('/pending')
            } else if (data.status === 'banned') {
              router.push('/banned')
            } else {
              router.push('/')
            }
          } else {
            loadPosts()
          }
        })
        .catch(err => {
          console.error('Check error:', err)
          toast.error('Failed to verify access')
        })
    }
  }, [status, router])

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Load posts error:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likes: data.totalLikes, likedBy: data.liked ? [...post.likedBy, session.user.discordId] : post.likedBy.filter(id => id !== session.user.discordId) }
            : post
        ))
        toast.success(data.liked ? 'Post liked!' : 'Post unliked')
      }
    } catch (error) {
      console.error('Like error:', error)
      toast.error('Failed to like post')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userAvatar = session.user.avatar
    ? `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png`
    : 'https://cdn.discordapp.com/embed/avatars/0.png'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent hidden sm:block">
                Content Platform
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              {session.user.isAdmin && (
                <Button
                  onClick={() => router.push('/admin')}
                  variant="outline"
                  size="sm"
                  className="border-indigo-500/30 hover:bg-indigo-500/10"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 ring-2 ring-indigo-500/30">
                  <AvatarImage src={userAvatar} alt={session.user.username} />
                  <AvatarFallback>{session.user.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white">{session.user.username}</span>
              </div>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="ghost"
                size="sm"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3 p-3 glass-card rounded-xl">
                <Avatar className="h-10 w-10 ring-2 ring-indigo-500/30">
                  <AvatarImage src={userAvatar} alt={session.user.username} />
                  <AvatarFallback>{session.user.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{session.user.username}</p>
                  <p className="text-xs text-gray-400">{session.user.email}</p>
                </div>
              </div>
              {session.user.isAdmin && (
                <Button
                  onClick={() => router.push('/admin')}
                  variant="outline"
                  className="w-full border-indigo-500/30 hover:bg-indigo-500/10"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="outline"
                className="w-full border-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {session.user.username}! 👋
            </h2>
            <p className="text-gray-400">
              Check out the latest exclusive content below
            </p>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl text-center">
              <p className="text-gray-400">No posts yet. Check back soon!</p>
            </div>
          ) : (
            posts.map((post) => {
              const isLocked = post.isLocked
              const hasLiked = post.likedBy?.includes(session.user.discordId)
              
              return (
                <div key={post._id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                  {/* Post Header */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
                        <Lock className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Creator</p>
                        <p className="text-xs text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      {isLocked && (
                        <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-1">
                          <Lock className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-yellow-500 font-medium">Premium</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Image */}
                  {post.imageUrl && (
                    <div className="relative">
                      <img
                        src={post.imageUrl}
                        alt="Post content"
                        className={`w-full object-cover max-h-96 ${isLocked ? 'blur-md' : ''}`}
                      />
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="text-center">
                            <Lock className="h-12 w-12 text-white mx-auto mb-2" />
                            <p className="text-white font-medium">Premium Content</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-4">
                    <p className={`text-white whitespace-pre-wrap ${isLocked ? 'blur-sm' : ''}`}>
                      {post.content}
                    </p>
                  </div>

                  {/* Post Actions */}
                  <div className="p-4 border-t border-white/10 flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-2 transition-colors ${
                        hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{post.likes || 0}</span>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
