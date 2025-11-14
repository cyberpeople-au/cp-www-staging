#!/bin/bash

# Quiz Deployment Script for Staging
# This script builds the quiz and copies it to the staging website

set -e

echo "🚀 Starting quiz deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Paths
QUIZ_APP_DIR="/Users/dp/developerland/cyberquiz/cyberquiz-app"
STAGING_DIR="/Users/dp/developerland/cp-www-staging"

# Step 1: Build the quiz app
echo -e "${BLUE}📦 Building quiz application...${NC}"
cd "$QUIZ_APP_DIR"
npm run build

# Step 2: Copy built files to staging
echo -e "${BLUE}📋 Copying files to staging...${NC}"
rm -rf "$STAGING_DIR/quiz"
mkdir -p "$STAGING_DIR/quiz"
cp -r dist/* "$STAGING_DIR/quiz/"

echo -e "${GREEN}✅ Quiz deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. cd $STAGING_DIR"
echo "  2. git add quiz/"
echo "  3. git commit -m 'Update quiz build'"
echo "  4. git push"
echo ""
echo "For API server deployment, see QUIZ-README.md"
