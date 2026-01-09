import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: {
    type: [String],
    default: []
  },
  views: {
    type: Number,
    default: 0
  },
  comments: {
    type: Array,
    default: []
  },
  creatorId: {
    type: String,
    required: true
  },
  scheduledFor: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Post || mongoose.model('Post', PostSchema)
