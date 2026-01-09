import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import AccessRequest from '@/lib/models/AccessRequest'
import ActivityLog from '@/lib/models/ActivityLog'

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: 'identify email' } }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB()
        
        // Check if user exists
        const existingUser = await User.findOne({ discordId: profile.id })
        
        if (!existingUser) {
          // Check if there's already a pending request
          const existingRequest = await AccessRequest.findOne({ 
            discordId: profile.id,
            status: 'pending'
          })
          
          if (!existingRequest) {
            // Check rate limit (3 requests per 24h)
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
            const requestCount = await AccessRequest.countDocuments({
              discordId: profile.id,
              createdAt: { $gte: oneDayAgo }
            })
            
            if (requestCount < 3) {
              // Create access request
              await AccessRequest.create({
                discordId: profile.id,
                username: profile.username,
                discriminator: profile.discriminator || '0',
                email: profile.email,
                avatar: profile.avatar,
                status: 'pending'
              })
              
              // Log activity
              await ActivityLog.create({
                discordId: profile.id,
                action: 'request_access',
                details: { username: profile.username }
              })
              
              // Send Discord webhook
              if (process.env.DISCORD_WEBHOOK_URL) {
                try {
                  const avatarUrl = profile.avatar 
                    ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                    : 'https://cdn.discordapp.com/embed/avatars/0.png'
                  
                  await fetch(process.env.DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      embeds: [{
                        title: '🆕 New Access Request',
                        description: `**${profile.username}** requested access to the platform`,
                        color: 0x5865F2,
                        thumbnail: { url: avatarUrl },
                        fields: [
                          { name: 'Email', value: profile.email || 'Not provided' },
                          { name: 'Discord ID', value: profile.id }
                        ],
                        timestamp: new Date().toISOString()
                      }]
                    })
                  })
                } catch (webhookError) {
                  console.error('Webhook error:', webhookError)
                }
              }
            }
          }
        } else {
          // Update last login
          await User.findOneAndUpdate(
            { discordId: profile.id },
            { lastLogin: new Date() }
          )
          
          // Log activity
          await ActivityLog.create({
            discordId: profile.id,
            action: 'login',
            details: { username: profile.username }
          })
        }
        
        return true
      } catch (error) {
        console.error('SignIn error:', error)
        return true
      }
    },
    async session({ session, token }) {
      try {
        await connectDB()
        
        session.user.id = token.sub
        session.user.discordId = token.discordId
        session.user.username = token.username
        session.user.discriminator = token.discriminator
        session.user.avatar = token.avatar
        
        // Check if user is admin
        const adminIds = process.env.ADMIN_DISCORD_IDS?.split(',') || []
        session.user.isAdmin = adminIds.includes(token.discordId)
        
        // Check if user is approved
        const user = await User.findOne({ discordId: token.discordId })
        session.user.approved = !!user
        session.user.status = user?.status || 'pending'
        
        return session
      } catch (error) {
        console.error('Session error:', error)
        return session
      }
    },
    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        token.discordId = profile.id
        token.username = profile.username
        token.discriminator = profile.discriminator || '0'
        token.avatar = profile.avatar
      }
      return token
    }
  },
  pages: {
    signIn: '/'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
