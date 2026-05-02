#!/usr/bin/env bash
set -euo pipefail
cd /opt/mosskynlab
SOURCE=$(tr -d '\r\n' </tmp/neon_source_url.txt)
CID=$(docker compose ps -q web)
docker cp /tmp/migrate-formulas-neon-to-neon.ts "${CID}:/app/migrate-formulas-neon-to-neon.ts"
docker compose exec -T \
  -e "SOURCE_DATABASE_URL=${SOURCE}" \
  -e MIGRATE_FORMULAS_OWNER_EMAIL=admin@mosskynlab.com \
  web sh -c 'export TARGET_DATABASE_URL="$DATABASE_URL" && cd /app && npx tsx migrate-formulas-neon-to-neon.ts'
