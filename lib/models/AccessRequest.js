import mongoose from 'mongoose'

const AccessRequestSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  ipAddress: {
    type: String
  },
  approvedAt: {
    type: Date
  },
  deniedAt: {
    type: Date
  },
  approvedBy: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.AccessRequest || mongoose.model('AccessRequest', AccessRequestSchema)
