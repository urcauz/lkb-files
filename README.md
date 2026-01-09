# Content Platform - Discord OAuth Subscription System

A private content subscription platform built with Next.js 14, MongoDB, and Discord OAuth authentication. Features a beautiful dark minimalist design with glassmorphism effects.

## 🎯 Features

### Authentication & Access Control
- **Discord OAuth Login** - Secure authentication via Discord
- **Admin Control by Discord ID** - Admin panel access based on Discord IDs in environment variable
- **Auto Access Requests** - Automatic request creation after Discord login
- **Approval Workflow** - Admin reviews and approves/denies access requests
- **Rate Limiting** - Maximum 3 access requests per Discord ID per 24 hours
- **Role-Based Access** - Admin vs Subscriber roles
- **Discord Webhooks** - Optional notifications for new access requests

### Admin Panel Features
- **Dashboard Overview** - Stats, charts, and recent activity
- **Access Requests Management** - Review and manage user requests with Discord profiles
- **User Management** - View, ban, unban users (cannot ban admins)
- **Posts Management** - Create, edit, delete, and lock posts
- **Analytics Dashboard** - User growth charts and engagement metrics
- **Activity Log** - Track all platform activities
- **Settings** - View admin Discord IDs and configure webhooks

### Subscriber Features
- **View Posts** - Access all unlocked posts
- **Like Posts** - Engage with content
- **Premium Content** - Locked posts visible only to approved users
- **Discord Profile** - Display Discord avatar and username

### Design
- **Dark Minimalist Aesthetic** - Professional, clean look inspired by Vercel/Linear
- **Glassmorphism** - Frosted glass cards with backdrop blur throughout
- **Animated Background** - Particles and gradient mesh on login page only
- **Smooth Animations** - Micro-interactions with cubic-bezier transitions
- **Responsive** - Mobile-first design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and Yarn
- MongoDB running locally or remote connection
- Discord Application with OAuth credentials

### Installation

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Configure environment variables:**
   
   Update `/app/.env` with your credentials:
   ```env
   MONGODB_URI=mongodb://localhost:27017/content-platform
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key
   DISCORD_CLIENT_ID=your-discord-client-id
   DISCORD_CLIENT_SECRET=your-discord-client-secret
   DISCORD_WEBHOOK_URL=your-webhook-url
   ADMIN_DISCORD_IDS=your-discord-id,another-admin-id
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Get your Discord ID:**
   - Open Discord
   - Go to User Settings > Advanced
   - Enable "Developer Mode"
   - Right-click your profile and select "Copy User ID"
   - Add this ID to `ADMIN_DISCORD_IDS` in `.env`

4. **Create Discord Application:**
   - Go to https://discord.com/developers/applications
   - Create a new application
   - Go to OAuth2 > General
   - Copy Client ID and Client Secret
   - Add redirect URL: `http://localhost:3000/api/auth/callback/discord`

5. **Start the application:**
   ```bash
   yarn dev
   ```

6. **Seed sample posts (optional):**
   ```bash
   node seed-posts.js
   ```

## 📁 Project Structure

```
/app/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth & Discord OAuth
│   │   ├── admin/              # Admin API routes
│   │   └── posts/              # Posts API routes
│   ├── admin/                  # Admin panel pages
│   │   ├── layout.js           # Admin layout with sidebar
│   │   ├── page.js             # Dashboard
│   │   ├── requests/           # Access requests management
│   │   ├── users/              # Users management
│   │   ├── posts/              # Posts management
│   │   ├── activity/           # Activity log
│   │   └── settings/           # Settings
│   ├── feed/                   # Main user feed
│   ├── pending/                # Pending approval page
│   ├── unauthorized/           # Unauthorized access page
│   ├── banned/                 # Banned user page
│   ├── page.js                 # Login page
│   ├── layout.js               # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── SessionProvider.js      # NextAuth session provider
├── lib/
│   ├── mongodb.js              # MongoDB connection
│   ├── models/                 # Mongoose models
│   └── utils.js                # Utility functions
├── .env                        # Environment variables
└── package.json                # Dependencies
```

## 🔐 Admin Access

### Adding Admins
1. Get the Discord ID of the user you want to make admin
2. Add their Discord ID to `ADMIN_DISCORD_IDS` in `.env`
   - Separate multiple IDs with commas (no spaces)
   - Example: `ADMIN_DISCORD_IDS=123456789012345678,987654321098765432`
3. Restart the application: `sudo supervisorctl restart nextjs`

### Admin Features
- Access admin panel at `/admin`
- Review and approve/deny access requests
- Manage users (ban/unban)
- Create, edit, and delete posts
- Toggle post lock status (premium content)
- View analytics and activity logs
- Cannot ban other admin users

## 📊 Database Models

### User
```javascript
{
  discordId: String (unique),
  email: String,
  username: String,
  discriminator: String,
  avatar: String,
  subscribed: Boolean,
  status: "active" | "banned",
  approvedBy: String,
  approvedAt: Date,
  lastLogin: Date,
  createdAt: Date
}
```

### AccessRequest
```javascript
{
  discordId: String,
  email: String,
  username: String,
  discriminator: String,
  avatar: String,
  status: "pending" | "approved" | "denied",
  ipAddress: String,
  approvedAt: Date,
  deniedAt: Date,
  approvedBy: String,
  createdAt: Date
}
```

### Post
```javascript
{
  content: String,
  imageUrl: String,
  isLocked: Boolean,
  likes: Number,
  likedBy: [String],
  views: Number,
  comments: Array,
  creatorId: String,
  scheduledFor: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityLog
```javascript
{
  userId: String,
  discordId: String,
  action: String,
  details: Object,
  ipAddress: String,
  timestamp: Date
}
```

## 🎨 Design System

### Colors
- **Background:** `#0a0a0f` (deep dark)
- **Surface:** `#1a1a24` (cards)
- **Primary:** `#6366f1` (indigo-500)
- **Secondary:** `#8b5cf6` (violet-500)
- **Text:** `#e4e4e7` (near white)

### Components
- **Glass Cards:** `rgba(26, 26, 36, 0.7)` with `backdrop-blur(20px)`
- **Borders:** `rgba(255, 255, 255, 0.1)`
- **Shadows:** Subtle with indigo tint
- **Animations:** Cubic-bezier(0.4, 0, 0.2, 1)

## 🔄 User Flow

1. **New User:**
   - Visits site → Clicks "Login with Discord"
   - Discord OAuth → Redirects back
   - Auto-creates access request
   - Shows "Pending Approval" page

2. **Admin Approval:**
   - Admin receives Discord webhook (if configured)
   - Admin logs into Discord
   - System checks if Discord ID is in `ADMIN_DISCORD_IDS`
   - If yes: Access to admin panel
   - Reviews request → Clicks "Approve"
   - User gets access on next login

3. **Approved User:**
   - User logs in again
   - Full access to platform
   - Can view and like posts
   - Locked posts require subscription

4. **Admin Creates Content:**
   - Goes to admin panel (Discord ID verified)
   - Creates new post
   - Optionally locks for subscribers
   - Post appears in feed

## 🛠️ Tech Stack

- **Framework:** Next.js 14 with App Router
- **Authentication:** NextAuth.js v5 with Discord Provider
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast)

## 🚨 Important Notes

- **Environment Variables:** Never commit `.env` file to version control
- **Admin IDs:** Must be valid Discord user IDs (18-19 digits)
- **Restart Required:** After changing `ADMIN_DISCORD_IDS`, restart the app
- **Rate Limiting:** Maximum 3 access requests per Discord ID per 24 hours
- **Webhook Optional:** Discord webhook notifications are optional

## 📝 API Routes

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints
- `GET /api/auth/check` - Check user approval status

### Admin (Protected)
- `GET /api/admin/requests` - Get access requests
- `POST /api/admin/requests/:id/approve` - Approve request
- `POST /api/admin/requests/:id/deny` - Deny request
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/:id/ban` - Ban user
- `POST /api/admin/users/:id/unban` - Unban user
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/activity` - Get activity log
- `GET /api/admin/settings` - Get settings

### Posts
- `GET /api/posts` - Get all posts (filters locked for non-approved)
- `POST /api/posts` - Create post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)
- `POST /api/posts/:id/like` - Toggle like on post

## 🎯 Current Configuration

- **MongoDB:** `mongodb://localhost:27017/content-platform`
- **Discord Client ID:** `1459193403517436130`
- **Admin Discord ID:** `983538163874144276`
- **Webhook:** Configured and active
- **Sample Posts:** 5 posts created (3 unlocked, 2 locked)

## 📖 Usage

1. **Login:** Go to homepage and click "Login with Discord"
2. **Wait for Approval:** Your request will be reviewed by the admin
3. **Access Content:** Once approved, you can view posts and engage
4. **Admin Panel:** If you're an admin, click "Admin Panel" in the header

## 🔧 Troubleshooting

**Issue:** Cannot access admin panel
- **Solution:** Verify your Discord ID is in `ADMIN_DISCORD_IDS` in `.env` and restart the app

**Issue:** Discord OAuth not working
- **Solution:** Check Discord application settings and ensure redirect URL is correct

**Issue:** Database connection error
- **Solution:** Ensure MongoDB is running: `sudo supervisorctl status mongodb`

**Issue:** Posts not loading
- **Solution:** Run seed script: `node seed-posts.js`

## 📧 Support

For issues or questions, contact the platform administrator.

## 🎉 Success!

Your Discord-based subscription platform is now ready! Admin can:
- ✅ Access admin panel at `/admin`
- ✅ Review access requests
- ✅ Manage users
- ✅ Create and manage posts
- ✅ View analytics and activity

Users can:
- ✅ Login with Discord
- ✅ Request access
- ✅ View and like posts
- ✅ Access premium content (when approved)

---

**Built with ❤️ using Next.js, MongoDB, and Discord OAuth**
