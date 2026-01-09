import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import AccessRequest from '@/lib/models/AccessRequest'
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
    
    const accessRequest = await AccessRequest.findById(id)
    if (!accessRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }
    
    // Create user account
    const user = await User.create({
      discordId: accessRequest.discordId,
      email: accessRequest.email,
      username: accessRequest.username,
      discriminator: accessRequest.discriminator,
      avatar: accessRequest.avatar,
      subscribed: true,
      status: 'active',
      approvedBy: session.user.discordId,
      approvedAt: new Date()
    })
    
    // Update request
    await AccessRequest.findByIdAndUpdate(id, {
      status: 'approved',
      approvedAt: new Date(),
      approvedBy: session.user.discordId
    })
    
    // Log activity
    await ActivityLog.create({
      discordId: session.user.discordId,
      action: 'approved_user',
      details: { 
        approvedUser: accessRequest.username,
        approvedDiscordId: accessRequest.discordId
      }
    })
    
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Approve request error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
