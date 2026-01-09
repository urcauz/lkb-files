'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Lock, Heart, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [formData, setFormData] = useState({ content: '', imageUrl: '', isLocked: false })

  useEffect(() => {
    loadPosts()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = currentPost ? `/api/posts/${currentPost._id}` : '/api/posts'
      const method = currentPost ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast.success(currentPost ? 'Post updated!' : 'Post created!')
        setDialogOpen(false)
        setFormData({ content: '', imageUrl: '', isLocked: false })
        setCurrentPost(null)
        loadPosts()
      } else {
        toast.error(data.error || 'Failed to save post')
      }
    } catch (error) {
      console.error('Save post error:', error)
      toast.error('Failed to save post')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (res.ok) {
        toast.success('Post deleted!')
        loadPosts()
      } else {
        toast.error(data.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete post')
    }
  }

  const handleEdit = (post) => {
    setCurrentPost(post)
    setFormData({
      content: post.content,
      imageUrl: post.imageUrl || '',
      isLocked: post.isLocked
    })
    setDialogOpen(true)
  }

  const handleToggleLock = async (post) => {
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, isLocked: !post.isLocked })
      })
      
      if (res.ok) {
        toast.success(post.isLocked ? 'Post unlocked!' : 'Post locked!')
        loadPosts()
      }
    } catch (error) {
      console.error('Toggle lock error:', error)
      toast.error('Failed to toggle lock')
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Posts</h1>
          <p className="text-gray-400">Manage your content</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-indigo-500 to-violet-500"
              onClick={() => {
                setCurrentPost(null)
                setFormData({ content: '', imageUrl: '', isLocked: false })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                {currentPost ? 'Edit Post' : 'Create New Post'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-300">Content</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your post content..."
                  className="bg-black/30 border-white/10 text-white"
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label className="text-gray-300">Image URL (optional)</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-black/30 border-white/10 text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Premium Content</Label>
                  <p className="text-xs text-gray-400">Only visible to approved users</p>
                </div>
                <Switch
                  checked={formData.isLocked}
                  onCheckedChange={(checked) => setFormData({ ...formData, isLocked: checked })}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-violet-500">
                {currentPost ? 'Update Post' : 'Create Post'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full glass-card p-12 rounded-2xl text-center">
            <p className="text-gray-400">No posts yet. Create your first post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="glass-card rounded-2xl overflow-hidden">
              {/* Post Image */}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-48 object-cover"
                />
              )}
              
              {/* Post Content */}
              <div className="p-4 space-y-4">
                <p className="text-white whitespace-pre-wrap line-clamp-3">{post.content}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views || 0}</span>
                  </div>
                  {post.isLocked && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 text-xs flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Premium
                    </span>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <Button
                    onClick={() => handleToggleLock(post)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-700"
                  >
                    <Lock className="h-4 w-4 mr-1" />
                    {post.isLocked ? 'Unlock' : 'Lock'}
                  </Button>
                  <Button
                    onClick={() => handleEdit(post)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(post._id)}
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 hover:bg-red-500/10 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
