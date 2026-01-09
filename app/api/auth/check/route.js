import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import AccessRequest from '@/lib/models/AccessRequest'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ approved: false, status: 'not_authenticated' }, { status: 401 })
    }
    
    await connectDB()
    
    // Check if user is approved
    const user = await User.findOne({ discordId: session.user.discordId })
    
    if (user && user.status === 'active') {
      return NextResponse.json({ 
        approved: true, 
        status: 'active',
        user: {
          discordId: user.discordId,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          isAdmin: session.user.isAdmin
        }
      })
    }
    
    if (user && user.status === 'banned') {
      return NextResponse.json({ approved: false, status: 'banned' })
    }
    
    // Check if there's a pending request
    const request_doc = await AccessRequest.findOne({ 
      discordId: session.user.discordId,
      status: 'pending'
    })
    
    if (request_doc) {
      return NextResponse.json({ approved: false, status: 'pending' })
    }
    
    return NextResponse.json({ approved: false, status: 'no_request' })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
