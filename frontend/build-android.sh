#!/bin/bash

# Hindi Grammar App - Android Build Script
# This script builds the React app and syncs with Capacitor

echo "🚀 Building Hindi Grammar Android App..."
echo ""

# Navigate to frontend
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
fi

# Build React app
echo "🔨 Building React app..."
GENERATE_SOURCEMAP=false yarn build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Sync failed!"
    exit 1
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "📱 Next steps:"
echo "1. Open Android Studio"
echo "2. Open project: $(pwd)/android"
echo "3. Build → Generate Signed Bundle / APK"
echo "4. Select 'Android App Bundle'"
echo "5. Configure signing and build"
echo ""
echo "📖 Full guide: /app/ANDROID_BUILD_GUIDE.md"
