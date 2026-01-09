import { config } from 'dotenv'
config()

import connectDB from './lib/mongodb.js'
import Post from './lib/models/Post.js'

const samplePosts = [
  {
    content: "Welcome to our exclusive content platform! 🎉\n\nI'm excited to share amazing content with you all. Stay tuned for regular updates, behind-the-scenes content, and much more!",
    imageUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=600&fit=crop",
    isLocked: false,
    likes: 15,
    likedBy: [],
    views: 45,
    creatorId: "983538163874144276"
  },
  {
    content: "Premium content alert! 🔥\n\nThis is exclusive content for approved members only. Thank you for your support!",
    imageUrl: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=600&fit=crop",
    isLocked: true,
    likes: 28,
    likedBy: [],
    views: 67,
    creatorId: "983538163874144276"
  },
  {
    content: "Behind the scenes look at what I've been working on lately. Can't wait to share the final result with you all! 💫",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
    isLocked: false,
    likes: 42,
    likedBy: [],
    views: 89,
    creatorId: "983538163874144276"
  },
  {
    content: "Thank you so much for all the support! Your encouragement means everything. Here's to creating more amazing content together! ✨",
    isLocked: false,
    likes: 56,
    likedBy: [],
    views: 123,
    creatorId: "983538163874144276"
  },
  {
    content: "🌟 VIP Content 🌟\n\nExclusive tutorial and insights just for you! This is what makes our community special.",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    isLocked: true,
    likes: 34,
    likedBy: [],
    views: 78,
    creatorId: "983538163874144276"
  }
]

async function seedPosts() {
  try {
    console.log('Connecting to database...')
    await connectDB()
    
    console.log('Clearing existing posts...')
    await Post.deleteMany({})
    
    console.log('Creating sample posts...')
    await Post.insertMany(samplePosts)
    
    console.log('✅ Sample posts created successfully!')
    console.log(`Created ${samplePosts.length} posts`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding posts:', error)
    process.exit(1)
  }
}

seedPosts()
