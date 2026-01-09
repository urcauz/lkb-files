import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Post from '@/lib/models/Post'
import AccessRequest from '@/lib/models/AccessRequest'
import ActivityLog from '@/lib/models/ActivityLog'

export async function GET(request) {
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
    
    // Get stats
    const totalUsers = await User.countDocuments({ status: 'active' })
    const pendingRequests = await AccessRequest.countDocuments({ status: 'pending' })
    const totalPosts = await Post.countDocuments({})
    const totalLikes = await Post.aggregate([
      { $group: { _id: null, total: { $sum: '$likes' } } }
    ])
    
    // Get recent activity
    const recentActivity = await ActivityLog.find({})
      .sort({ timestamp: -1 })
      .limit(10)
    
    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
    
    // Get top posts
    const topPosts = await Post.find({})
      .sort({ likes: -1 })
      .limit(5)
    
    return NextResponse.json({
      stats: {
        totalUsers,
        pendingRequests,
        totalPosts,
        totalLikes: totalLikes[0]?.total || 0
      },
      recentActivity,
      userGrowth,
      topPosts
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
