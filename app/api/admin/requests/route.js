import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import AccessRequest from '@/lib/models/AccessRequest'

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
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const query = {}
    if (status && status !== 'all') {
      query.status = status
    }
    
    const requests = await AccessRequest.find(query).sort({ createdAt: -1 })
    
    const stats = {
      total: await AccessRequest.countDocuments({}),
      pending: await AccessRequest.countDocuments({ status: 'pending' }),
      approved: await AccessRequest.countDocuments({ status: 'approved' }),
      denied: await AccessRequest.countDocuments({ status: 'denied' })
    }
    
    return NextResponse.json({ requests, stats })
  } catch (error) {
    console.error('Get requests error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
