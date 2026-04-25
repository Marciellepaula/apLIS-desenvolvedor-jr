#!/bin/sh
set -e

MYSQL="mysql -h ${DB_HOST:-mysql} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME}"

echo "[migrate] Aguardando MySQL..."
until $MYSQL -e "SELECT 1" > /dev/null 2>&1; do
  sleep 2
done
echo "[migrate] MySQL pronto."

$MYSQL -e "
CREATE TABLE IF NOT EXISTS schema_migrations (
  version    VARCHAR(255) NOT NULL PRIMARY KEY,
  applied_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);"

for file in $(ls /db/migrations/*.sql | sort); do
  version=$(basename "$file")
  applied=$($MYSQL -sN -e "SELECT COUNT(*) FROM schema_migrations WHERE version='$version';")

  if [ "$applied" = "0" ]; then
    echo "[migrate] Aplicando: $version"
    $MYSQL < "$file"
    $MYSQL -e "INSERT INTO schema_migrations (version) VALUES ('$version');"
    echo "[migrate] OK: $version"
  else
    echo "[migrate] Pulando (já aplicada): $version"
  fi
done

echo "[migrate] Concluído."
