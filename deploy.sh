#!/usr/bin/env bash
#
# Deploy the current branch on the server.
#
#   ./deploy.sh
#
# Run from the app root, on the server, over SSH. Never on a dev machine —
# it discards nothing, but it caches config, and a cached config on a laptop
# means .env edits stop taking effect and the next hour is spent wondering why.
#
# There is deliberately NO `npm` step. Hostinger shared hosting has no Node,
# which is why `public/build/` is committed to git: the compiled assets arrive
# with the pull. Build locally, commit, push — see the README section this
# script's failure message points at.

set -euo pipefail

cd "$(dirname "$0")"

if [[ ! -f artisan ]]; then
    echo "error: no artisan here — run this from the application root." >&2
    exit 1
fi

echo "==> Pulling"
git pull --ff-only

# Composer, not npm. `--no-dev` keeps dev tooling off the server; the optimized
# autoloader is worth the extra second on a host without much CPU to spare.
echo "==> Installing PHP dependencies"
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

echo "==> Migrating"
php artisan migrate --force

# Clear before caching, not instead of it. `config:cache` reads .env; if a stale
# compiled config is already in place, a fresh .env value is silently ignored.
echo "==> Rebuilding caches"
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Guards against the one failure mode that produces a white screen with nothing
# in the log: a pull that brought new PHP but stale JS, because someone changed
# resources/js and forgot to run `npm run build` before committing.
if [[ ! -f public/build/manifest.json ]]; then
    echo
    echo "WARNING: public/build/manifest.json is missing." >&2
    echo "The server cannot build assets. Run 'npm run build' locally," >&2
    echo "commit public/build/, push, and deploy again." >&2
    exit 1
fi

echo
echo "==> Done"
curl -s -o /dev/null -w '    homepage ttfb=%{time_starttransfer}s total=%{time_total}s\n' \
    "$(php -r 'echo rtrim(getenv("APP_URL") ?: "http://localhost", "/");')/" || true
