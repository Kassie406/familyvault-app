# FamilyVault App Transfer Inventory

## 📋 Overview
**App**: FamilyVault - Comprehensive family document management with AI-powered analysis and real-time collaboration  
**Stack**: React + TypeScript (Frontend) | Express + Node.js (Backend) | PostgreSQL (Database)  
**Current Host**: Replit  
**Transfer Date**: September 13, 2025

---

## 🔐 Environment Variables (Required)

### Core Application
```bash
# Application Configuration
NODE_ENV=production                    # Environment setting
PORT=5000                             # Server port (bind to 0.0.0.0:5000)
SESSION_SECRET=your-secure-session-key # Express session encryption

# Database (Primary Storage)
DATABASE_URL=postgresql://user:pass@host:port/dbname  # PostgreSQL connection string

# Application URLs
APP_DOMAIN=https://your-domain.com    # Application base URL  
APP_ORIGIN=https://your-domain.com    # CORS origin setting
VITE_API_URL=https://your-domain.com  # Frontend API endpoint
WEB_ORIGIN=https://your-domain.com    # WebSocket origin
```

### Authentication & Email
```bash
# Custom Authentication System
ALLOWED_EMAILS=user1@domain.com,user2@domain.com  # Authorized user emails

# SMTP Configuration (Email Verification)
SMTP_HOST=smtp.gmail.com              # Email server host
SMTP_PORT=587                         # Email server port  
SMTP_SECURE=false                     # TLS setting
SMTP_USER=your-email@gmail.com        # SMTP username
SMTP_PASS=your-app-password          # SMTP password/app-password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id      # Google OAuth client ID
GOOGLE_CLIENT_SECRET=your-google-secret     # Google OAuth secret
```

### AWS Services (File Storage & AI)
```bash
# S3 Storage Configuration (Primary - server/lib/s3.ts)
AWS_REGION=us-east-1                  # AWS region for main S3 client
AWS_ACCESS_KEY_ID=AKIA...             # AWS access key for main S3 client
AWS_SECRET_ACCESS_KEY=your-secret     # AWS secret key for main S3 client
S3_PUBLIC_BASE_URL=https://cdn.domain.com  # Public CDN URL (optional, if unset uses presigned URLs)

# S3 Storage Alternative Config (server/storage-routes.ts)
S3_REGION=us-east-1                   # S3-specific region for upload routes
S3_ACCESS_KEY=AKIA...                 # Alternative S3 access key for uploads
S3_SECRET_KEY=your-secret             # Alternative S3 secret key for uploads
S3_ENDPOINT=optional-custom-endpoint  # Custom S3 endpoint (for R2/MinIO)
S3_FORCE_PATH_STYLE=false            # Path-style S3 URLs (true for MinIO/local)

# S3 Bucket Configuration
S3_BUCKET_DOCS=your-docs-bucket       # Documents bucket name
S3_BUCKET_PHOTOS=your-photos-bucket   # Photos bucket name

# Cloudflare R2 (Optional Alternative to AWS S3)
S3_PROVIDER=r2                        # Set to 'r2' to use Cloudflare R2 instead of AWS
R2_ACCOUNT_ID=your-account-id         # Cloudflare R2 account ID (required if S3_PROVIDER=r2)
R2_ACCESS_KEY_ID=your-r2-key         # Cloudflare R2 access key
R2_SECRET_ACCESS_KEY=your-r2-secret   # Cloudflare R2 secret key

# AWS Textract (Document Analysis)  
# Uses same AWS credentials as main S3 config above
```

### AI & ML Services
```bash
# OpenAI Integration (Document Analysis)
OPENAI_API_KEY=sk-...                 # OpenAI API key for GPT-4

# MCP Server (AI Agent)
MCP_SERVER_URL=https://your-mcp-server.com/mcp  # MCP server endpoint
MCP_SIGNING_SECRET=your-mcp-secret    # MCP authentication secret
MANUS_AGENT_KEY=your-agent-key        # ⚠️ CRITICAL: Must be set explicitly (defaults to 'familyvault-dev' if unset)

# Lambda Functions (Document Processing)
LAMBDA_URL=https://api.gateway.url/prod  # AWS Lambda/API Gateway endpoint (no trailing slash)
```

### Communication Services
```bash
# Twilio SMS (Notifications)
TWILIO_SID=AC...                      # Twilio Account SID
TWILIO_AUTH=your-auth-token          # Twilio Auth Token  
TWILIO_FROM=+1234567890              # Twilio phone number

# Real-time Features (Optional)
REDIS_URL=redis://host:port          # Redis for WebSocket scaling
```

### Security & Secrets
```bash
# Secret Management
SECRETS_KEY=your-encryption-key       # Application secrets encryption
```

---

## 🏗️ Core Services Architecture

### 1. **Database Layer**
- **PostgreSQL**: Primary data storage using Drizzle ORM
- **Tables**: 25+ tables including users, family management, documents, real-time features
- **Connection**: Pool-based with session storage integration
- **Migrations**: `npm run db:push` for schema updates

### 2. **Authentication System**
- **Custom Auth**: Email verification + session-based authentication
- **Google OAuth**: Optional social login integration
- **Security**: Helmet.js, rate limiting, CSRF protection, secure sessions
- **WebAuthn**: Biometric authentication support

### 3. **File Storage & Processing**
- **AWS S3**: Document and photo storage with presigned URLs
- **AWS Textract**: OCR and document analysis 
- **Multi-format Support**: PDF, images, Office documents
- **Progressive Upload**: Chunked uploads with progress tracking

### 4. **AI & Document Analysis**
- **OpenAI GPT-4**: Intelligent document analysis and suggestions
- **MCP Server**: AI agent for family management tasks
- **AWS Lambda**: Serverless document processing pipeline
- **Real-time Analysis**: Post-upload AI processing with live updates

### 5. **Real-time Features**
- **Socket.IO**: WebSocket connections for live collaboration
- **Redis Adapter**: Multi-instance scaling (optional)
- **Family Rooms**: Real-time presence and activity updates
- **Live Chat**: Family communication with typing indicators

### 6. **Communication Layer**
- **Twilio SMS**: Notifications and alerts
- **Email**: SMTP-based verification and notifications
- **Push Notifications**: Browser-based notifications

---

## 📦 Third-Party Integrations

### Replit-Specific Integrations
```json
{
  "javascript_database": "1.0.0",           // PostgreSQL integration
  "javascript_sendgrid": "1.0.0",           // Email service
  "javascript_websocket": "1.0.0",          // Real-time features
  "javascript_log_in_with_replit": "1.0.0", // Authentication
  "javascript_openai": "1.0.0"              // AI integration
}
```

### Key Dependencies
```json
{
  "Core Framework": {
    "express": "Web server framework",
    "react": "Frontend UI framework",  
    "drizzle-orm": "Type-safe database ORM",
    "socket.io": "Real-time communication"
  },
  "AWS Services": {
    "@aws-sdk/client-s3": "File storage",
    "@aws-sdk/client-textract": "Document OCR",
    "@aws-sdk/s3-request-presigner": "Secure uploads"
  },
  "Authentication": {
    "passport": "Authentication middleware",
    "@simplewebauthn/server": "Biometric auth",
    "express-session": "Session management"
  },
  "UI Components": {
    "@radix-ui/*": "Accessible UI primitives",
    "tailwindcss": "Styling framework",
    "@tanstack/react-query": "Data fetching"
  }
}
```

### ⚠️ Unused Dependencies (Optional Packages)
These packages are installed but not currently active - can be removed or configured later:
```json
{
  "Payment Processing": {
    "@stripe/stripe-js": "NOT CONFIGURED - Payment processing",
    "@stripe/react-stripe-js": "NOT CONFIGURED - Stripe React components"
  },
  "Email Service": {
    "@sendgrid/mail": "NOT CONFIGURED - Alternative to SMTP"
  },
  "Video Conferencing": {
    "@livekit/components-react": "NOT CONFIGURED - Video/audio calls",
    "@livekit/components-styles": "NOT CONFIGURED - LiveKit styling"
  },
  "Alternative Database": {
    "@supabase/supabase-js": "NOT CONFIGURED - Alternative to PostgreSQL"
  }
}
```

---

## 🚀 Deployment Requirements

### Minimum Infrastructure
- **Node.js 18+**: Runtime environment
- **PostgreSQL 12+**: Database server
- **Redis**: Optional (for WebSocket scaling)
- **HTTPS**: Required for WebAuthn and secure sessions
- **Reverse Proxy**: Required for WebSocket support (`/socket.io` path)

### File Upload Limits (Configurable)
- **Documents**: 25MB max per file (server/storage-routes.ts)
- **Photos**: 10MB max per file (server/storage-routes.ts)
- **AI Agent Uploads**: 5MB max per file, 5 files max (server/routes/ai-agent.ts)
- **Allowed Types**: PDF, Office docs, images (JPEG, PNG, GIF, WebP), text files

### Critical Security Configuration
```bash
# ⚠️ SECURITY WARNINGS
MANUS_AGENT_KEY=REQUIRED           # Must be set explicitly - never use default
SESSION_SECRET=REQUIRED            # Strong random key for session encryption
ALLOWED_EMAILS=user@domain.com     # Restrict access to authorized emails only

# ⚠️ S3 IAM Permissions Required (Least Privilege)
# S3: GetObject, PutObject, DeleteObject on specific buckets
# Textract: AnalyzeDocument, DetectDocumentText
```

### Scaling Considerations
- **CPU**: Moderate (AI processing can be intensive)
- **Memory**: 512MB minimum, 2GB+ recommended
- **Storage**: S3-compatible for files, PostgreSQL for metadata
- **Bandwidth**: High (file uploads/downloads)

### WebSocket & Reverse Proxy Configuration
```nginx
# Nginx example for WebSocket support
location /socket.io/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    # Sticky sessions for multi-instance setup
    proxy_cache_bypass $http_upgrade;
}
```

### Content Security Policy (CSP) Origins
The app uses strict CSP - ensure these origins are allowed:
- **connect-src**: Your domain, WebSocket endpoints, AWS S3 endpoints
- **img-src**: Your domain, data:, blob:, AWS S3 buckets  
- **media-src**: Your domain, data:, blob:, AWS S3 buckets

---

## 📊 Current Status & Health

### Active Features
- ✅ **Document Upload**: Multi-method upload with S3 integration
- ✅ **AI Analysis**: OpenAI-powered document insights
- ✅ **Family Management**: Multi-user collaboration
- ✅ **Real-time Features**: Live updates and presence
- ✅ **Authentication**: Secure multi-factor login
- ✅ **File Management**: Organized document storage

### API Endpoints Status
- ✅ `GET /api/trustworthy/documents` - Working
- ✅ `POST /api/storage/presign` - Working  
- ✅ `GET /api/family/stats` - Working
- ✅ WebSocket connections - Active
- ⚠️ Some non-critical APIs have database connection issues

---

## 🔄 Export Instructions

### 1. GitHub Export
1. Open Replit workspace
2. Go to **Version Control** tab
3. Click **"Export to GitHub"**
4. Create new repository or select existing
5. Ensure all files are included

### 2. Infrastructure Setup (Step-by-Step)

#### PostgreSQL Database
```bash
# 1. Create PostgreSQL instance (AWS RDS, DigitalOcean, etc.)
# 2. Set DATABASE_URL environment variable
# 3. Run schema migration
npm install
npm run db:push --force
```

#### S3 Storage Setup
```bash
# 1. Create S3 buckets (or Cloudflare R2)
aws s3 mb s3://your-docs-bucket
aws s3 mb s3://your-photos-bucket

# 2. Configure CORS policy for buckets
aws s3api put-bucket-cors --bucket your-docs-bucket --cors-configuration file://cors.json

# 3. Create IAM user with minimal permissions
# Attach policy: S3 GetObject/PutObject/DeleteObject on your buckets
# Attach policy: Textract AnalyzeDocument, DetectDocumentText
```

#### Example S3 CORS Configuration (cors.json)
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["https://your-domain.com"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### 3. Environment Variables Setup
```bash
# Create .env file with all variables from this inventory
# Use the .env.example template below
# Test each service connection individually:

# Test TypeScript compilation
npm run check

# Test working endpoints (verified from logs)
curl https://your-domain.com/api/healthz
curl https://your-domain.com/api/trustworthy/documents
curl https://your-domain.com/api/family/stats
curl https://your-domain.com/api/family/members
curl https://your-domain.com/api/notifications

# Test database migration
npm run db:push
```

### 4. Build & Deploy
```bash
# 1. Install dependencies
npm install

# 2. Build application (confirmed from package.json)
npm run build

# 3. Start production server (confirmed from package.json)
npm run start

# 4. Verify working endpoints (confirmed from logs)
curl https://your-domain.com/api/healthz
curl https://your-domain.com/api/trustworthy/documents
curl https://your-domain.com/api/family/stats
```

### 5. Post-Deployment Verification Checklist

#### ✅ Working Endpoints (Verified)
- [ ] **Health Check**: `/api/healthz` returns 200 OK
- [ ] **Document API**: `/api/trustworthy/documents` returns 200 OK
- [ ] **Family Stats**: `/api/family/stats` returns 200 OK
- [ ] **Family Members**: `/api/family/members` returns 200 OK
- [ ] **Notifications**: `/api/notifications` returns 200 OK
- [ ] **WebSocket**: Real-time connection established

#### ⚠️ Database-Dependent Endpoints (May Fail Initially)
- [ ] **Chores API**: `/api/chores` (500 - DB auth issue)
- [ ] **Allowance API**: `/api/allowance/summary` (500 - DB auth issue)
- [ ] **Family Activity**: `/api/family/activity` (500 - DB auth issue)
- [ ] **Chat Threads**: `/api/threads/default` (500 - DB auth issue)

#### 🔧 Fix Database Issues First
1. Verify `DATABASE_URL` is correct
2. Run `npm run db:push --force` to sync schema
3. Test database connection independently
4. Check PostgreSQL user permissions

---

**⚠️ Critical Notes:**
- Test all environment variables before going live
- AWS S3 buckets need proper CORS configuration
- WebSocket requires proper origin settings
- Email verification depends on SMTP configuration
- AI features require OpenAI API credits

**🎯 Priority Order:**
1. Database + Core Auth (Essential)
2. File Storage (S3) (High Priority) 
3. AI Services (Medium Priority)
4. Real-time Features (Nice to Have)
5. SMS Notifications (Optional)

---

## 📝 .env.example Template

```bash
# Core Application
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-secure-random-session-secret-here
DATABASE_URL=postgresql://user:password@host:port/database

# Application URLs
APP_DOMAIN=https://your-domain.com
APP_ORIGIN=https://your-domain.com
VITE_API_URL=https://your-domain.com
WEB_ORIGIN=https://your-domain.com

# Authentication
ALLOWED_EMAILS=user1@domain.com,user2@domain.com

# SMTP Email (Required for auth)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Google OAuth (Optional)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS S3 Storage (Primary config - server/lib/s3.ts)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_PUBLIC_BASE_URL=https://cdn.your-domain.com

# S3 Upload Routes (Alternative config - server/storage-routes.ts)
S3_REGION=us-east-1
S3_ACCESS_KEY=AKIA...
S3_SECRET_KEY=your-s3-secret
S3_BUCKET_DOCS=your-docs-bucket
S3_BUCKET_PHOTOS=your-photos-bucket
# S3_ENDPOINT=custom-endpoint-if-needed
# S3_FORCE_PATH_STYLE=false

# Cloudflare R2 (Alternative to AWS S3)
# S3_PROVIDER=r2
# R2_ACCOUNT_ID=your-r2-account-id
# R2_ACCESS_KEY_ID=your-r2-access-key
# R2_SECRET_ACCESS_KEY=your-r2-secret

# AI Services
OPENAI_API_KEY=sk-...
MCP_SERVER_URL=https://your-mcp-server.com/mcp
MCP_SIGNING_SECRET=your-mcp-secret
MANUS_AGENT_KEY=your-secure-agent-key-not-default

# Lambda Functions
LAMBDA_URL=https://your-api-gateway.execute-api.region.amazonaws.com/prod

# Communication (Optional)
# TWILIO_SID=AC...
# TWILIO_AUTH=your-twilio-auth-token
# TWILIO_FROM=+1234567890

# Real-time Scaling (Optional)
# REDIS_URL=redis://host:port

# Security
SECRETS_KEY=your-encryption-key-for-secrets
```