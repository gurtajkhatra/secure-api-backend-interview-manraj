#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "[setup] Working directory: $ROOT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "[setup] npm is required but not found in PATH." >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "[setup] Installing dependencies..."
  npm install
else
  echo "[setup] Dependencies already installed; skipping npm install."
fi

if [ ! -f .env ]; then
  if [ -f env.example ]; then
    echo "[setup] Creating .env from env.example..."
    cp env.example .env
  else
    echo "[setup] env.example not found; create .env manually." >&2
  fi
else
  echo "[setup] .env already exists; leaving in place."
fi

echo "[setup] Starting dev server (npm run dev)..."
npm run dev >/tmp/secure-auth-api.dev.log 2>&1 &
SERVER_PID=$!

cleanup() {
  if ps -p "$SERVER_PID" >/dev/null 2>&1; then
    echo "[setup] Stopping dev server (pid $SERVER_PID)..."
    kill -INT "$SERVER_PID" >/dev/null 2>&1 || kill "$SERVER_PID" >/dev/null 2>&1 || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT

HEALTH_URL="http://localhost:3000/health"
echo "[setup] Waiting for health check at $HEALTH_URL..."

ATTEMPTS=30
for ((i=1; i<=ATTEMPTS; i++)); do
  if curl -fsS "$HEALTH_URL" >/tmp/secure-auth-api.health.json 2>/dev/null; then
    echo "[setup] Health check succeeded:"
    cat /tmp/secure-auth-api.health.json
    exit 0
  fi
  sleep 1
done

echo "[setup] Health check failed after $ATTEMPTS attempts. Logs:" >&2
cat /tmp/secure-auth-api.dev.log >&2 || true
exit 1

