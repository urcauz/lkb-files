import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import Post from '@/lib/models/Post'
import User from '@/lib/models/User'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    await connectDB()
    
    let posts = await Post.find({}).sort({ createdAt: -1 })
    
    // If user is not approved, filter locked posts
    if (session) {
      const user = await User.findOne({ discordId: session.user.discordId })
      if (!user || user.status !== 'active') {
        posts = posts.filter(post => !post.isLocked)
      }
    } else {
      posts = posts.filter(post => !post.isLocked)
    }
    
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const adminIds = process.env.ADMIN_DISCORD_IDS?.split(',') || []
    if (!adminIds.includes(session.user.discordId)) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }
    
    await connectDB()
    
    const body = await request.json()
    const { content, imageUrl, isLocked } = body
    
    const post = await Post.create({
      content,
      imageUrl,
      isLocked: isLocked || false,
      creatorId: session.user.discordId
    })
    
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
