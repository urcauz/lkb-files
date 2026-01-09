import mongoose from 'mongoose'

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  discordId: {
    type: String
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema)
