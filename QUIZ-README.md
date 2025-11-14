# Cybersecurity Assessment Quiz Integration

This directory contains the integrated cybersecurity assessment quiz for the Cyber People staging website.

## Structure

- `quiz/` - Built React app files (static assets)
- `quiz.html` - Quiz page with site navigation
- `quiz-server/` - Node.js backend server for Notion integration

## Quiz Features

- 20-question cybersecurity assessment
- Real-time scoring and risk band calculation
- Lead capture with Notion integration
- Dark/light mode with system preference detection
- Progress tracking with localStorage
- Downloadable/printable results

## Setup Instructions

### 1. Quiz Frontend (Already Built)

The quiz frontend is pre-built and ready to serve as static files in the `quiz/` directory.

### 2. Quiz Backend Server

The backend server handles Notion API integration for lead capture.

**Install dependencies:**
```bash
cd quiz-server
npm install
```

**Configure environment:**
```bash
cp .env.example .env
# Edit .env with your Notion credentials:
# - VITE_NOTION_API_KEY
# - VITE_NOTION_DATABASE_ID
# - VITE_API_BASE_URL (production API endpoint)
```

**Run server (development):**
```bash
npm start
```

**Run server (production):**
Use a process manager like PM2:
```bash
pm2 start index.js --name "cyberquiz-api"
```

### 3. Notion Database Setup

The quiz requires a Notion database with these properties:

1. **Name** (Title)
2. **Email** (Email)
3. **Phone** (Phone number)
4. **Company** (Text)
5. **Industry** (Text)
6. **Employee Count** (Text)
7. **Location** (Text)
8. **Current IT Provider** (Text)
9. **Quiz Score** (Number)
10. **Risk Level** (Select: Critical, High, Moderate, Low, Mature)
11. **Lead Status** (Select: New, Contacted, Qualified, Converted)
12. **Lead Source** (Text)
13. **Submission Date** (Date)
14. **Interested in Consultation** (Text)

## Deployment

### Static Site Hosting

The quiz frontend (`quiz/` directory and `quiz.html`) can be deployed alongside the main website as static files.

### API Server Hosting

The backend server (`quiz-server/`) needs to be hosted separately on a Node.js-compatible platform:

- AWS EC2/Lambda
- Heroku
- DigitalOcean
- Vercel (serverless functions)

Update `VITE_API_BASE_URL` in the production environment to point to your hosted API.

## Links Added to Main Site

1. **Hero CTA** - "Take Free Assessment" button (primary CTA)
2. **Value Proposition Card** - "Take Free Assessment" button in the "Identify Your Vulnerabilities" card

## Brand Consistency

The quiz uses the same brand colors and typography as the main site:
- Primary Color: #17a2b8 (True Turquoise)
- Typography: Segoe UI
- Background: #fafafa (light) / #121212 (dark)
- Consistent navigation header

## Development

To rebuild the quiz after making changes:

```bash
cd ../cyberquiz/cyberquiz-app
npm run build
cp -r dist/* ../cp-www-staging/quiz/
```

## Support

For issues or questions, contact the development team.
