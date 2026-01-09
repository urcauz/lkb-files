import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  discriminator: {
    type: String,
    default: '0'
  },
  avatar: {
    type: String
  },
  subscribed: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  },
  approvedBy: {
    type: String
  },
  approvedAt: {
    type: Date
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
