#!/usr/bin/env bash
# Server-side deploy for pixpassport.uk. Runs on the VPS (invoked by GitHub Actions over SSH,
# or manually: bash scripts/deploy.sh [git-ref]).
#
# Safety features: single-run lock, clean-env fetch, build verification, health-check with
# retries, automatic rollback to the previous commit + previous .next build on any failure.
set -Eeuo pipefail

APP_NAME="pixpassport-uk"
APP_DIR="${APP_DIR:-$HOME/apps/pixpassport.uk}"
APP_PORT="${APP_PORT:-3007}"
BRANCH="${BRANCH:-main}"
TARGET_REF="${1:-origin/$BRANCH}"
HEALTH_URL="http://127.0.0.1:${APP_PORT}/"
HEALTH_RETRIES=20
LOCK_FILE="/tmp/${APP_NAME}-deploy.lock"

log()  { printf '\n[%s] %s\n' "$(date '+%H:%M:%S')" "$*"; }
fail() { printf '\n❌ %s\n' "$*" >&2; }

# Non-login SSH shells often lack node/pm2 on PATH (nvm etc.)
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
for bin in git node npm pm2 curl flock; do
  command -v "$bin" >/dev/null 2>&1 || { fail "Missing required command: $bin"; exit 1; }
done

# Only one deploy at a time
exec 9>"$LOCK_FILE"
flock -n 9 || { fail "Another deploy is already running"; exit 1; }

cd "$APP_DIR"
[ -d .git ] || { fail "$APP_DIR is not a git checkout"; exit 1; }
[ -f .env.production ] || [ -f .env ] || log "⚠️  No .env / .env.production in $APP_DIR (continuing)"

PREV_SHA="$(git rev-parse HEAD)"
PREV_LOCK_HASH="$(sha256sum package-lock.json | cut -d' ' -f1)"
ROLLBACK_READY=0
DEPLOY_OK=0

health_check() {
  local i
  for i in $(seq 1 "$HEALTH_RETRIES"); do
    if curl --fail --silent --show-error --max-time 5 --output /dev/null "$HEALTH_URL"; then
      return 0
    fi
    sleep 2
  done
  return 1
}

rollback() {
  fail "Deploy failed — rolling back to ${PREV_SHA:0:7}"
  git reset --hard "$PREV_SHA" || true
  if [ "$ROLLBACK_READY" = 1 ] && [ -d .next.bak ]; then
    rm -rf .next && mv .next.bak .next
  fi
  if [ "$(sha256sum package-lock.json | cut -d' ' -f1)" != "$PREV_LOCK_HASH" ] || [ ! -d node_modules ]; then
    npm ci --no-audit --no-fund || true
  fi
  pm2 startOrReload ecosystem.config.cjs --update-env || true
  if health_check; then
    fail "Rolled back; previous version is serving again."
  else
    fail "Rollback health check FAILED — manual intervention needed."
    pm2 logs "$APP_NAME" --lines 40 --nostream || true
  fi
}

on_exit() {
  local code=$?
  if [ "$DEPLOY_OK" != 1 ] && [ "$code" -ne 0 ]; then
    rollback
  fi
  exit "$code"
}
trap on_exit EXIT

log "📥 Fetching $TARGET_REF (current: ${PREV_SHA:0:7})"
git fetch --prune origin
git reset --hard "$TARGET_REF"
NEW_SHA="$(git rev-parse HEAD)"

if [ "$NEW_SHA" = "$PREV_SHA" ] && [ -f .next/BUILD_ID ] && pm2 describe "$APP_NAME" >/dev/null 2>&1 && [ "${FORCE:-0}" != 1 ]; then
  log "Already at ${NEW_SHA:0:7} and running — nothing to do (FORCE=1 to redeploy)"
  DEPLOY_OK=1
  exit 0
fi

log "💾 Backing up current build"
rm -rf .next.bak
[ -d .next ] && cp -a .next .next.bak
ROLLBACK_READY=1

log "📦 Installing dependencies"
npm ci --no-audit --no-fund

log "🏗️  Building Next.js"
npm run build
test -f .next/BUILD_ID || { fail "Build produced no BUILD_ID"; exit 1; }

log "🔄 Reloading PM2 ($APP_NAME on :$APP_PORT)"
pm2 startOrReload ecosystem.config.cjs --update-env

log "🌐 Health check $HEALTH_URL"
health_check || { pm2 logs "$APP_NAME" --lines 40 --nostream || true; exit 1; }

pm2 save
rm -rf .next.bak
DEPLOY_OK=1
log "✅ Deployed ${NEW_SHA:0:7} (previous ${PREV_SHA:0:7})"
