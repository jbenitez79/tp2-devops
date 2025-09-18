#!/bin/sh

service postgresql start

until pg_isready -h 127.0.0.1 -U postgres; do
  echo "Esperando a PostgreSQL..."
  sleep 2
done

su - postgres -c "psql -tc \"SELECT 1 FROM pg_user WHERE usename='docker'\" | grep -q 1 || psql -c \"CREATE USER docker WITH SUPERUSER PASSWORD 'docker';\""
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='lol_db'\" | grep -q 1 || psql -c \"CREATE DATABASE lol_db OWNER docker;\""

if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

# npx typeorm migration:run -d src/data-source.ts

npm run build

npm run start:prod
