import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import AccessRequest from '@/lib/models/AccessRequest'
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
    
    // Update request
    await AccessRequest.findByIdAndUpdate(id, {
      status: 'denied',
      deniedAt: new Date()
    })
    
    // Log activity
    await ActivityLog.create({
      discordId: session.user.discordId,
      action: 'denied_user',
      details: { 
        deniedUser: accessRequest.username,
        deniedDiscordId: accessRequest.discordId
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Deny request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
