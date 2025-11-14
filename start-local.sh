#!/bin/bash

# Local Development Server Startup Script
# Starts both the static website and the quiz API server

set -e

echo "🚀 Starting Cyber People Staging Website Locally"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if quiz-server is already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Quiz API server already running on port 3001${NC}"
else
    echo -e "${BLUE}Starting Quiz API Server...${NC}"
    cd quiz-server
    npm start &
    API_PID=$!
    cd ..
    echo -e "${GREEN}✓ Quiz API running on http://localhost:3001${NC}"
    echo "  PID: $API_PID"
fi

echo ""

# Check if static server is already running
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Static server already running on port 8080${NC}"
else
    echo -e "${BLUE}Starting Static Website Server...${NC}"
    python3 -m http.server 8080 &
    WEB_PID=$!
    echo -e "${GREEN}✓ Website running on http://localhost:8080${NC}"
    echo "  PID: $WEB_PID"
fi

echo ""
echo "================================================"
echo -e "${GREEN}✅ Local environment ready!${NC}"
echo ""
echo "URLs:"
echo "  🌐 Website:     http://localhost:8080/"
echo "  📝 Quiz:        http://localhost:8080/quiz.html"
echo "  🔌 Quiz API:    http://localhost:3001/"
echo ""
echo "To stop servers:"
echo "  ./stop-local.sh"
echo ""
echo "Or manually:"
echo "  kill \$(lsof -t -i:8080)  # Stop website"
echo "  kill \$(lsof -t -i:3001)  # Stop API"
echo ""
