#!/bin/bash

# Stop Local Development Servers

echo "🛑 Stopping local development servers..."
echo ""

# Stop website server (port 8080)
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping website server (port 8080)..."
    kill $(lsof -t -i:8080) 2>/dev/null
    echo "✓ Website server stopped"
else
    echo "⚠️  No website server running on port 8080"
fi

# Stop API server (port 3001)
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping API server (port 3001)..."
    kill $(lsof -t -i:3001) 2>/dev/null
    echo "✓ API server stopped"
else
    echo "⚠️  No API server running on port 3001"
fi

echo ""
echo "✅ All servers stopped"
