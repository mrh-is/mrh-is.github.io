#!/bin/bash
set -e

echo "🐳 Updating Linux snapshots using Docker..."

# Build and run tests in Docker container
docker run --rm --ipc=host \
  -v $(pwd):/work \
  -w /work \
  -e CI=true \
  mcr.microsoft.com/playwright:v1.57.0-jammy \
  bash -c '
    echo "📦 Installing dependencies..."
    npm install --include=optional --silent

    echo "🏗️  Building site..."
    npm run build

    echo "🚀 Starting preview server..."
    npm run preview &
    SERVER_PID=$!

    echo "⏳ Waiting for server to be ready..."
    for i in {1..30}; do
      if curl -s http://localhost:4173 > /dev/null; then
        echo "✅ Server is ready!"
        break
      fi
      sleep 1
    done

    echo "📸 Updating snapshots..."
    npx playwright test tests/snapshots.spec.ts --config=playwright.config.docker.ts --update-snapshots

    echo "🛑 Stopping server..."
    kill $SERVER_PID || true

    echo "✨ Done!"
  '

echo "🎉 Linux snapshots updated successfully!"
