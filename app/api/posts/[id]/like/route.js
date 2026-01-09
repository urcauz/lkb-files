import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import Post from '@/lib/models/Post'
import ActivityLog from '@/lib/models/ActivityLog'

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    await connectDB()
    
    const { id } = params
    const post = await Post.findById(id)
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    const discordId = session.user.discordId
    const hasLiked = post.likedBy.includes(discordId)
    
    let updatedPost
    if (hasLiked) {
      // Unlike
      updatedPost = await Post.findByIdAndUpdate(
        id,
        { 
          $pull: { likedBy: discordId },
          $inc: { likes: -1 }
        },
        { new: true }
      )
    } else {
      // Like
      updatedPost = await Post.findByIdAndUpdate(
        id,
        { 
          $addToSet: { likedBy: discordId },
          $inc: { likes: 1 }
        },
        { new: true }
      )
      
      // Log activity
      await ActivityLog.create({
        discordId,
        action: 'liked_post',
        details: { postId: id }
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      liked: !hasLiked,
      totalLikes: updatedPost.likes
    })
  } catch (error) {
    console.error('Like post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
