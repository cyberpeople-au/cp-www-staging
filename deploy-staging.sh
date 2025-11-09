#!/bin/bash

# Cyber People Website - Staging Deployment Script
# Deploys to staging.cyber-people.tech

set -e  # Exit on error

# Configuration
REMOTE_USER="developer"
REMOTE_HOST="staging"
REMOTE_PATH="/home/developer/cyber-people-staging"
CONTAINER_NAME="cyber-people-staging"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Cyber People - Staging Deployment${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# Check if we have uncommitted changes to tracked files
MODIFIED=$(git diff --name-only)
if [[ -n "$MODIFIED" ]]; then
    echo -e "${YELLOW}You have uncommitted changes to tracked files:${NC}"
    echo "$MODIFIED"
    echo ""
    read -p "Continue with deployment? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Deployment cancelled.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}Step 1: Syncing files to staging server...${NC}"
rsync -avz --delete \
    --exclude='.git/' \
    --exclude='.gitignore' \
    --exclude='buildfiles/' \
    --exclude='*.md' \
    --exclude='*.docx' \
    --exclude='*.py' \
    --exclude='deploy-staging.sh' \
    --exclude='.DS_Store' \
    ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

echo ""
echo -e "${GREEN}Step 2: Rebuilding Docker container...${NC}"
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'EOF'
cd /home/developer/cyber-people-staging
sudo docker-compose down
sudo docker-compose build --no-cache
sudo docker-compose up -d
EOF

echo ""
echo -e "${GREEN}Step 3: Verifying deployment...${NC}"
ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo docker ps | grep cyber-people-staging"

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "🌐 Staging URL: ${YELLOW}https://staging.cyber-people.tech${NC}"
echo ""
echo -e "${YELLOW}Note: Container restart may take 10-30 seconds.${NC}"
echo -e "${YELLOW}The cyber assessment tool was not affected.${NC}"
