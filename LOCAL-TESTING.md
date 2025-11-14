# Local Testing Guide - Cyber People Staging Website

This guide covers running and testing the complete Cyber People website with integrated quiz on your local machine.

## Quick Start

### Start Everything
```bash
cd /Users/dp/developerland/cp-www-staging
./start-local.sh
```

This starts:
- **Website**: http://localhost:8080/
- **Quiz**: http://localhost:8080/quiz.html
- **API Server**: http://localhost:3001/

### Stop Everything
```bash
./stop-local.sh
```

## What's Running

```
┌─────────────────────────────────────────┐
│   Your Browser                          │
│   http://localhost:8080                 │
└─────────────────────────────────────────┘
                   │
                   │ HTTP requests
                   ▼
┌─────────────────────────────────────────┐
│   Python HTTP Server (Port 8080)       │
│   Serves: index.html, quiz.html,        │
│           quiz/, styles.css, etc.       │
└─────────────────────────────────────────┘
                   │
                   │ Quiz form submission
                   ▼
┌─────────────────────────────────────────┐
│   Node.js Quiz API (Port 3001)         │
│   Location: quiz-server/               │
│   Handles: Notion integration           │
└─────────────────────────────────────────┘
                   │
                   │ API calls
                   ▼
┌─────────────────────────────────────────┐
│   Notion Database                       │
│   Stores quiz submissions               │
└─────────────────────────────────────────┘
```

## Testing Checklist

### 1. Test Main Website
- [ ] Open http://localhost:8080/
- [ ] Click "Take Free Assessment" button in hero
- [ ] Verify navigation works
- [ ] Check responsive design (resize browser)
- [ ] Test light/dark mode toggle on quiz page

### 2. Test Quiz Integration
- [ ] Open http://localhost:8080/quiz.html
- [ ] Verify quiz loads correctly
- [ ] Verify site navigation is present
- [ ] Check styling matches main site
- [ ] Test dark mode toggle

### 3. Test Quiz Functionality
- [ ] Fill out participant information form
- [ ] Answer all 20 questions
- [ ] Verify progress bar updates
- [ ] Check navigation dots work
- [ ] Review results page
- [ ] Test "Download Results" button
- [ ] Test "Print Results" button

### 4. Test Quiz Submission
- [ ] Complete quiz with test data
- [ ] Check browser console for API calls
- [ ] Verify "Successfully saved" message
- [ ] Open Notion database and find test submission
- [ ] Verify all fields are populated correctly

### 5. Test API Server
```bash
# Test API is responding
curl http://localhost:3001/api/notion/validate

# Check server logs
# (They're displayed in the terminal where you ran start-local.sh)
```

## Manual Testing Steps

### Option 1: Use Startup Scripts (Recommended)
```bash
# Start servers
cd /Users/dp/developerland/cp-www-staging
./start-local.sh

# Test in browser
# Open: http://localhost:8080/

# When done
./stop-local.sh
```

### Option 2: Start Manually

**Terminal 1 - API Server:**
```bash
cd /Users/dp/developerland/cp-www-staging/quiz-server
npm start
```

**Terminal 2 - Website:**
```bash
cd /Users/dp/developerland/cp-www-staging
python3 -m http.server 8080
```

To stop: Press `Ctrl+C` in each terminal

## Troubleshooting

### Port Already in Use

**Problem**: `Address already in use` error

**Solution**:
```bash
# Find and kill process on port 8080
lsof -ti:8080 | xargs kill

# Find and kill process on port 3001
lsof -ti:3001 | xargs kill
```

### Quiz Not Loading

**Check 1**: Are the quiz files present?
```bash
ls -la quiz/
# Should see: assets/, index.html, vite.svg
```

**Check 2**: Check browser console for errors
- Open Developer Tools (F12)
- Look for 404 errors or JavaScript errors

**Check 3**: Verify file paths in quiz.html
```bash
# Path should be relative: /quiz/assets/...
grep "assets" quiz.html
```

### API Connection Failed

**Check 1**: Is the API server running?
```bash
curl http://localhost:3001/api/notion/validate
```

**Check 2**: Check API server logs
- Look at the terminal where API server is running
- Should see: "Server running on http://localhost:3001"

**Check 3**: Check environment variables
```bash
cd quiz-server
cat .env
# Verify VITE_NOTION_API_KEY and VITE_NOTION_DATABASE_ID are set
```

**Check 4**: Test Notion connection directly
```bash
cd quiz-server
node test-notion.js
```

### Notion Submission Failing

**Problem**: Quiz completes but doesn't save to Notion

**Solutions**:
1. Check Notion API key is valid
2. Verify database is shared with integration
3. Check all required properties exist in database
4. Review browser console for error messages
5. Check API server terminal for errors

### Styling Issues

**Problem**: Quiz doesn't match site styling

**Check**: Verify CSS files are loading
```bash
# Open browser DevTools > Network tab
# Reload page
# Look for failed CSS requests
```

## Environment Configuration

### Current Setup (Local Testing)
```
VITE_API_BASE_URL=http://localhost:3001/api
```

The quiz frontend is configured to connect to the local API server.

### For Production Testing
If you want to test against a remote API:

1. Edit quiz-server/.env:
```bash
VITE_API_BASE_URL=https://api.staging.cyber-people.tech/api
```

2. Rebuild quiz:
```bash
cd /Users/dp/developerland/cyberquiz/cyberquiz-app
npm run build
cp -r dist/* /Users/dp/developerland/cp-www-staging/quiz/
```

## Browser Testing

### Recommended Browsers
- Chrome/Edge (primary)
- Firefox
- Safari

### Test Scenarios
1. **Desktop**: Full width (1920px)
2. **Tablet**: Medium width (768px)
3. **Mobile**: Small width (375px)

### Browser DevTools
- Use responsive design mode
- Test different screen sizes
- Check console for errors
- Monitor network requests

## Making Changes

### Update Quiz Content or Styling

1. Edit source files:
```bash
cd /Users/dp/developerland/cyberquiz/cyberquiz-app
# Edit files in src/
```

2. Test with dev server:
```bash
npm run dev
# Opens at http://localhost:5173
```

3. Build and deploy:
```bash
npm run build
cp -r dist/* /Users/dp/developerland/cp-www-staging/quiz/
```

4. Test integrated version:
```bash
cd /Users/dp/developerland/cp-www-staging
./start-local.sh
# Test at http://localhost:8080/quiz.html
```

### Update Website (Non-Quiz)

1. Edit HTML/CSS files directly in cp-www-staging:
```bash
cd /Users/dp/developerland/cp-www-staging
# Edit index.html, styles.css, etc.
```

2. Refresh browser to see changes (no rebuild needed)

### Update API Server

1. Edit server code:
```bash
cd /Users/dp/developerland/cp-www-staging/quiz-server
# Edit index.js or other files
```

2. Restart server:
```bash
# Stop
./stop-local.sh

# Start
./start-local.sh
```

## Performance Testing

### Check Load Times
```bash
# Test website response
curl -o /dev/null -s -w "Time: %{time_total}s\n" http://localhost:8080/

# Test API response
curl -o /dev/null -s -w "Time: %{time_total}s\n" http://localhost:3001/api/notion/validate
```

### Browser Performance
- Open DevTools > Performance tab
- Record page load
- Check for slow scripts or large assets

## Pre-Deployment Checklist

Before pushing to staging server:

- [ ] All local tests pass
- [ ] Quiz submission saves to Notion
- [ ] No console errors
- [ ] Styling looks correct in all browsers
- [ ] Responsive design works on mobile
- [ ] Dark mode works properly
- [ ] Navigation between pages works
- [ ] Forms validate correctly
- [ ] API server handles errors gracefully
- [ ] Git changes committed
- [ ] .env files not committed

## Next Steps

After local testing is complete:

1. **Review changes**: `git status` and `git diff`
2. **Commit changes**: `git add . && git commit -m "Your message"`
3. **Push to GitHub**: `git push`
4. **Deploy to staging server**: See DEPLOYMENT.md

## Useful Commands

```bash
# Check what's running on ports
lsof -i :8080
lsof -i :3001

# View server logs
tail -f quiz-server/logs/*.log  # if logging to file

# Test API endpoint
curl -X POST http://localhost:3001/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d @test-submission.json

# Check disk space
df -h

# Check memory usage
top -l 1 | grep PhysMem
```

## Support

For issues or questions:
- Check browser console
- Check server terminal output
- Review quiz-server/.env configuration
- Test Notion connection: `node quiz-server/test-notion.js`
- See DEPLOYMENT.md for production issues
