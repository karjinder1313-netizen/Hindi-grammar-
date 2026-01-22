#!/bin/bash

# Hindi Grammar App - Android Bundle Build Script
# This script sets up environment and builds the signed .aab bundle

echo "🚀 Building Hindi Grammar Android App Bundle..."
echo ""

# Set environment variables
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$JAVA_HOME/bin

# Navigate to android directory
cd "$(dirname "$0")/android"

echo "📋 Environment:"
echo "JAVA_HOME: $JAVA_HOME"
echo "ANDROID_HOME: $ANDROID_HOME"
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean --no-daemon

if [ $? -ne 0 ]; then
    echo "❌ Clean failed!"
    exit 1
fi

# Build release bundle
echo "🔨 Building release bundle..."
./gradlew bundleRelease --no-daemon --stacktrace

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Bundle location:"
echo "   app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "📱 Next steps:"
echo "1. Download the .aab file"
echo "2. Upload to Google Play Console"
echo "3. Submit for review"
echo ""
