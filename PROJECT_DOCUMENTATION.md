# Ave AI Dashboard - Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Development Journey](#development-journey)
4. [Problems & Solutions](#problems--solutions)
5. [Current System Design](#current-system-design)
6. [API Integration](#api-integration)
7. [Deployment Guide](#deployment-guide)
8. [Future Improvements](#future-improvements)

## 🎯 Project Overview

Ave AI Dashboard is a Telegram Mini App that provides real-time restaurant analytics by integrating with Syrve POS system. The project consists of:

- **Backend**: Python FastAPI server that fetches data from Syrve POS
- **Frontend**: React TypeScript dashboard as Telegram Mini App
- **Bot**: Telegram bot for notifications and data access

### Key Features
- Real-time sales and revenue tracking
- KPI monitoring (revenue, orders, average check)
- AI-powered insights and recommendations
- Dark theme UI inspired by health/fitness apps
- Telegram authentication

## 🏗 Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Syrve POS    │────▶│   Backend API   │◀────│  Telegram Bot   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                          │
                               ▼                          ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │   Mini App      │     │   Telegram      │
                        │  (Dashboard)    │     │    Users        │
                        └─────────────────┘     └─────────────────┘
```

### Tech Stack

**Backend:**
- Python 3.11
- FastAPI
- Structlog for logging
- File-based storage (JSON/NDJSON)
- Syrve API integration

**Frontend:**
- React 18 + TypeScript
- Vite
- Telegram WebApp SDK
- Custom dark theme CSS
- Deployed on Vercel

## 📅 Development Journey

### Phase 1: Initial Setup
1. Created React + TypeScript project with Vite
2. Integrated Telegram WebApp SDK
3. Set up basic routing with React Router

### Phase 2: UI Development
1. Implemented responsive layout with Header and Navigation
2. Created pages: Onboarding, Dashboard, Settings
3. Added Telegram theme integration

### Phase 3: Dark Theme Redesign
1. Implemented modern dark theme inspired by fitness apps
2. Created reusable KPICard component with circular progress
3. Added smooth animations and transitions

### Phase 4: Backend Integration
1. Added API endpoints to existing FastAPI backend
2. Implemented Telegram authentication
3. Connected frontend to real POS data

## 🔧 Problems & Solutions

### Problem 1: React Version Conflicts on Vercel
**Issue**: Deployment failed due to React 18 peer dependency conflicts with @telegram-apps/telegram-ui

**Solution**:
```json
// package.json
"overrides": {
  "@telegram-apps/telegram-ui": {
    "react": "$react",
    "react-dom": "$react-dom"
  }
}
```
```
// .npmrc
legacy-peer-deps=true
```

### Problem 2: Port Conflicts
**Issue**: Default Vite port 5173 was occupied

**Solution**: Changed to port 5174 in vite.config.ts, then reverted after fixing the blocking process

### Problem 3: Language Localization
**Issue**: Interface was in Russian, needed English

**Solution**: Manually translated all component texts to English

### Problem 4: No Real Data
**Issue**: Dashboard showed only mock data

**Solution**: Created API endpoints in backend to serve real Syrve POS data

## 🔌 Current System Design

### Backend API Endpoints

```
# System Endpoints
POST /tg/webhook/{token}    - Telegram webhook
GET  /oauth/callback        - OAuth callback for POS
GET  /health               - Health check

# Mini App API (Telegram WebApp auth required)
GET  /api/v1/dashboard     - Main KPIs (from mini_app.py - MISSING!)
GET  /api/v1/stats/{period} - Period statistics  
GET  /api/v1/insights      - AI insights
POST /api/v1/refresh-data  - Trigger data refresh

# Bot API (Telegram auth required)
GET  /api/v1/bot/daily     - Daily sales report
GET  /api/v1/bot/profit    - Profit/margin analysis
GET  /api/v1/bot/analysis  - 30-day analysis
GET  /api/v1/bot/abc       - ABC analysis
```

**Note**: The file `app/api/mini_app.py` containing Mini App endpoints is missing from the current codebase but is imported by `bot_endpoints.py`.

### Authentication Flow

#### Dual Authentication System

**1. Telegram Mini App Authentication (Frontend → Backend)**
- Purpose: Verify requests come from legitimate Telegram users
- Process:
  1. Telegram injects WebApp object with user data:
     - `user_id`: Telegram user ID
     - `auth_date`: Unix timestamp
     - `hash`: HMAC-SHA256 signature
     - `first_name`, `last_name`, `username` (optional)
  2. Frontend sends these parameters with each API request
  3. Backend verifies hash using:
     ```
     secret_key = HMAC-SHA256("WebAppData", bot_token)
     expected_hash = HMAC-SHA256(data_check_string, secret_key)
     ```
  4. Checks if user has access (telegram_chat_id in account.json)
  5. Returns requested data or 401 if unauthorized

**2. Syrve POS Authentication (Backend → Syrve)**
- Purpose: Backend authenticates with Syrve to fetch restaurant data
- Process:
  1. Backend reads credentials from environment:
     - `SYRVE_LOGIN`, `SYRVE_PASSWORD`
     - `SYRVE_STORE_ID`, `SYRVE_SERVER_URL`
  2. Password is SHA1 hashed
  3. Requests token: `GET /resto/api/auth?login={login}&pass={sha1_hash}`
  4. Receives session token (GUID format)
  5. Token cached for 25 minutes, auto-refreshed
  6. All API requests include token as 'key' parameter

### Data Flow

**Real-time Request Flow (Mini App):**
1. User opens Dashboard in Telegram Mini App
2. Frontend calls `api.getDashboard()` with Telegram auth params
3. Backend verifies Telegram authentication
4. Backend checks user access (telegram_chat_id match)
5. Backend reads pre-fetched data from NDJSON files
6. Backend calculates KPIs and trends
7. Returns dashboard data to frontend

**ETL Background Process:**
1. RQ Scheduler triggers ETL job (every 30 minutes)
2. Worker creates SyrveClient with env credentials
3. SyrveClient authenticates and gets session token
4. Worker fetches sales data via OLAP API
5. Processes and aggregates data by hour
6. Saves to `sales_hour.ndjson`
7. Generates insights and saves to `insights.ndjson`

### Frontend Components

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── KPICard.tsx      # Reusable metric card
│   │   └── KPICard.css
│   └── Layout/
│       ├── Header.tsx        # App header
│       ├── Navigation.tsx    # Bottom navigation
│       └── Layout.tsx        # Main layout wrapper
├── hooks/
│   ├── useTelegram.ts       # Telegram WebApp integration
│   └── useApi.ts            # Data fetching hooks
├── pages/
│   ├── DashboardPage.tsx    # Main dashboard
│   ├── OnboardingPage.tsx   # Welcome screen
│   └── SettingsPage.tsx     # Settings
└── services/
    └── api.ts               # API client
```

## 🔐 API Integration

### Environment Variables

**Backend (.env)**:
```bash
# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token

# Syrve POS
POS_TYPE=syrve
SYRVE_SERVER_URL=https://restaurant.syrve.online  # Your Syrve instance
SYRVE_LOGIN=your_api_username
SYRVE_PASSWORD=your_api_password  # Will be SHA1 hashed
SYRVE_STORE_ID=12345678-1234-1234-1234-123456789012  # Store UUID
SYRVE_CONCEPTION_ID=87654321-4321-4321-4321-210987654321  # Optional
```

**Frontend (.env)**:
```bash
# API URL
VITE_API_URL=https://your-backend-url.com
```

### Authentication
The Mini App uses Telegram's built-in authentication:
```typescript
// Frontend sends these params
user_id: number
auth_date: number
hash: string
first_name?: string
last_name?: string  
username?: string
```

## 🚀 Deployment Guide

### Backend Deployment

1. **Prepare server**:
```bash
ssh root@209.38.85.196
mkdir -p /opt/ave-ai-backend
cd /opt/ave-ai-backend
```

2. **Upload files**:
```bash
# From local machine
rsync -avz ./app root@209.38.85.196:/opt/ave-ai-backend/
scp requirements.txt docker-compose.yml Dockerfile root@209.38.85.196:/opt/ave-ai-backend/
```

3. **Setup environment**:
```bash
# On server
cp .env.example .env
nano .env  # Edit with your credentials
```

4. **Run with Docker**:
```bash
docker-compose up -d
```

### Frontend Deployment

1. **Push to GitHub**:
```bash
git add -A
git commit -m "Your changes"
git push origin main
```

2. **Vercel Settings**:
- Add environment variable: `VITE_API_URL=https://your-api-url.com`
- Redeploy

3. **Update Bot**:
- Change Mini App URL in bot to: `https://ave-ai-dashboard.vercel.app`

## 🚨 Critical Issues to Fix

1. **Missing `mini_app.py` file**
   - Contains `/api/v1/` endpoints for Mini App
   - Has `get_current_user()` function imported by bot_endpoints.py
   - Need to restore from git history (commit a093403)

2. **Missing `get_pos_client()` implementation**
   - Function is called but not implemented
   - Should be in `/app/pos/__init__.py`
   - Should return configured SyrveClient instance

3. **401 Error Debugging**
   - Need to distinguish between:
     - Telegram auth failures (hash verification)
     - Syrve auth failures (wrong credentials)
     - User access failures (telegram_chat_id mismatch)
   - Add better error messages and logging

## 🔮 Future Improvements

### High Priority
1. **Real-time updates**: WebSocket connection for live data
2. **Cost analysis**: Integrate ingredient costs for profit margins
3. **Multi-restaurant**: Support for restaurant chains
4. **Advanced analytics**: Predictive analytics, seasonal trends

### Medium Priority
1. **Offline mode**: Cache data for offline access
2. **Export reports**: PDF/Excel export functionality
3. **Staff management**: Integration with scheduling
4. **Inventory tracking**: Real-time inventory levels

### Nice to Have
1. **Voice commands**: Telegram voice integration
2. **AR menu preview**: Visualize dishes in AR
3. **Customer feedback**: Integration with review platforms
4. **Competitor analysis**: Market comparison tools

## 📝 Notes

- The system uses file-based storage, consider migrating to a database for production
- API authentication is basic, consider implementing JWT tokens
- Currently single-tenant, needs modification for multi-tenant use
- All timestamps are in UTC, frontend should handle timezone conversion

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is proprietary and confidential.