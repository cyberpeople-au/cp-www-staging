# Deployment Guide - Cyber People Staging Website with Quiz

This guide covers deploying the staging website and the integrated cybersecurity assessment quiz.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│   Static Website (HTML/CSS/JS)         │
│   - index.html, quiz.html, etc.         │
│   - quiz/ directory (React build)       │
└─────────────────────────────────────────┘
                   │
                   │ AJAX calls
                   ▼
┌─────────────────────────────────────────┐
│   Quiz API Server (Node.js/Express)    │
│   - quiz-server/index.js                │
│   - Handles Notion integration          │
└─────────────────────────────────────────┘
                   │
                   │ API calls
                   ▼
┌─────────────────────────────────────────┐
│   Notion Database                       │
│   - Stores quiz submissions             │
│   - Manages leads                       │
└─────────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+ installed
- Git configured with SSH access to GitHub
- Notion API integration set up
- Access to hosting platform (for API server)

## Local Development Setup

### 1. Clone Repository

```bash
git clone git@github.com:cyberpeople-au/cp-www-staging.git
cd cp-www-staging
```

### 2. Set Up Quiz API Server

```bash
cd quiz-server
npm install
cp .env.example .env
# Edit .env with your Notion credentials
nano .env
```

Required environment variables:
```
VITE_NOTION_API_KEY=ntn_your_api_key_here
VITE_NOTION_DATABASE_ID=your_database_id_here
VITE_API_BASE_URL=http://localhost:3001/api
PORT=3001
```

### 3. Test API Server

```bash
# Test Notion connection
node test-notion.js

# Start the server
npm start
```

The server will run on http://localhost:3001

### 4. Serve Static Files Locally

For testing the full site locally, use a simple HTTP server:

```bash
# Using Python 3
cd /Users/dp/developerland/cp-www-staging
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000
```

Visit: http://localhost:8000/quiz.html

## Production Deployment

### Part 1: Static Website Deployment

The static files (HTML, CSS, JS, quiz/) can be deployed to any static hosting:

**Option A: GitHub Pages**
```bash
# Enable GitHub Pages in repository settings
# Select branch: main
# Select folder: / (root)
```

**Option B: Netlify**
```bash
# Connect repository to Netlify
# Build settings:
#   Build command: (leave empty)
#   Publish directory: /
```

**Option C: AWS S3 + CloudFront**
```bash
# Use the existing deploy-staging.sh script
./deploy-staging.sh
```

### Part 2: API Server Deployment

The Node.js API server needs to be hosted on a platform that supports Node.js:

#### Option A: AWS EC2

1. Launch an EC2 instance (t2.micro is sufficient)
2. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Clone and setup:
   ```bash
   git clone git@github.com:cyberpeople-au/cp-www-staging.git
   cd cp-www-staging/quiz-server
   npm install
   ```

4. Configure environment:
   ```bash
   nano .env
   # Add production values
   ```

5. Install PM2 and start:
   ```bash
   sudo npm install -g pm2
   pm2 start index.js --name cyberquiz-api
   pm2 startup
   pm2 save
   ```

6. Configure nginx reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name api.staging.cyber-people.tech;

       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Option B: Heroku

1. Create Heroku app:
   ```bash
   heroku create cyberpeople-quiz-api
   ```

2. Add buildpack:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. Set environment variables:
   ```bash
   heroku config:set VITE_NOTION_API_KEY=ntn_your_key
   heroku config:set VITE_NOTION_DATABASE_ID=your_db_id
   heroku config:set PORT=3001
   ```

4. Deploy:
   ```bash
   cd quiz-server
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a cyberpeople-quiz-api
   git push heroku main
   ```

#### Option C: DigitalOcean App Platform

1. Connect GitHub repository
2. Select `quiz-server` directory
3. Configure environment variables in UI
4. Deploy

### Part 3: Update API Endpoint

After deploying the API server, update the quiz to use the production endpoint:

1. Edit `.env.production` in the quiz app:
   ```bash
   cd /Users/dp/developerland/cyberquiz/cyberquiz-app
   nano .env.production
   ```

2. Update `VITE_API_BASE_URL` to your production API:
   ```
   VITE_API_BASE_URL=https://api.staging.cyber-people.tech/api
   ```

3. Rebuild the quiz:
   ```bash
   npm run build
   ```

4. Copy to staging site:
   ```bash
   cp -r dist/* /Users/dp/developerland/cp-www-staging/quiz/
   ```

   Or use the deployment script:
   ```bash
   cd /Users/dp/developerland/cp-www-staging
   ./deploy-quiz.sh
   ```

5. Commit and push:
   ```bash
   git add quiz/
   git commit -m "Update quiz with production API endpoint"
   git push
   ```

## Continuous Deployment

### Automated Quiz Deployment

You can automate quiz deployments using GitHub Actions:

Create `.github/workflows/deploy-quiz.yml`:

```yaml
name: Deploy Quiz

on:
  push:
    paths:
      - 'quiz/**'
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to hosting
        run: |
          # Add your deployment commands here
```

## Monitoring and Maintenance

### API Server Monitoring

**Using PM2:**
```bash
pm2 status
pm2 logs cyberquiz-api
pm2 monit
```

**Health Check Endpoint:**
Test the API is running:
```bash
curl https://api.staging.cyber-people.tech/api/health
```

### Database Monitoring

Check Notion database for:
- New quiz submissions
- Lead conversion rates
- Error entries

### Log Rotation

Configure log rotation for the API server:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Troubleshooting

### Quiz Not Loading

1. Check browser console for errors
2. Verify static files are deployed correctly
3. Check quiz.html references correct asset paths

### API Connection Errors

1. Check API server is running: `pm2 status`
2. Verify CORS is enabled in quiz-server/index.js
3. Check environment variables are set correctly
4. Test API endpoint directly:
   ```bash
   curl https://api.staging.cyber-people.tech/api/notion/validate
   ```

### Notion Integration Failing

1. Verify API key is valid
2. Check database is shared with integration
3. Verify all required properties exist in database
4. Run test script:
   ```bash
   node quiz-server/test-notion.js
   ```

## Security Considerations

1. **API Keys**: Never commit `.env` files
2. **CORS**: Configure allowed origins in production
3. **Rate Limiting**: Implement rate limiting on API server
4. **HTTPS**: Always use HTTPS in production
5. **Environment Variables**: Use secure secret management in production

## Backup and Recovery

### Database Backup

Notion data is automatically backed up by Notion. To export:
1. Open database in Notion
2. Click "..." menu
3. Select "Export"
4. Choose format and download

### Code Backup

Repository is backed up on GitHub. For local backup:
```bash
git bundle create backup.bundle --all
```

## Support

For deployment issues:
- Check QUIZ-README.md for detailed setup instructions
- Review server logs: `pm2 logs cyberquiz-api`
- Test components individually using test scripts

## Quick Reference

| Component | Local URL | Production URL |
|-----------|-----------|----------------|
| Website | http://localhost:8000 | https://app.staging.cyber-people.tech |
| Quiz | http://localhost:8000/quiz.html | https://app.staging.cyber-people.tech/quiz.html |
| API | http://localhost:3001 | https://api.staging.cyber-people.tech |

## Update Checklist

When updating the quiz:

- [ ] Make changes to quiz source code
- [ ] Test locally (`npm run dev`)
- [ ] Update `.env.production` if needed
- [ ] Build quiz (`npm run build`)
- [ ] Copy to staging repo (`./deploy-quiz.sh`)
- [ ] Test quiz.html locally
- [ ] Commit and push to GitHub
- [ ] Verify deployment on staging site
- [ ] Test API integration end-to-end
- [ ] Monitor for errors
