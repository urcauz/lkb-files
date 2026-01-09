import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

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
    const search = searchParams.get('search')
    
    const query = {}
    if (status && status !== 'all') {
      query.status = status
    }
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    const users = await User.find(query).sort({ createdAt: -1 })
    
    // Add isAdmin flag to each user
    const usersWithAdmin = users.map(user => ({
      ...user.toObject(),
      isAdmin: adminIds.includes(user.discordId)
    }))
    
    return NextResponse.json({ 
      users: usersWithAdmin, 
      total: usersWithAdmin.length 
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
