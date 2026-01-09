import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import ActivityLog from '@/lib/models/ActivityLog'

export async function POST(request, { params }) {
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
    
    const { id } = params
    const user = await User.findById(id)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    await User.findByIdAndUpdate(id, { status: 'active' })
    
    // Log activity
    await ActivityLog.create({
      discordId: session.user.discordId,
      action: 'unbanned_user',
      details: { 
        unbannedUser: user.username,
        unbannedDiscordId: user.discordId
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unban user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
