#!/bin/sh

# Inicia postgres
service postgresql start

# Loop simple para esperar a que postgres se levante para cambiar de usuario
until pg_isready -h 127.0.0.1 -U postgres; do
  echo "Esperando a PostgreSQL..."
  sleep 2
done

# Se cambia al usuario postgres y se crea el nuevo usuario docker en la db, con su contrasena. Luego se crea la db
su - postgres -c "psql -tc \"SELECT 1 FROM pg_user WHERE usename='docker'\" | grep -q 1 || psql -c \"CREATE USER docker WITH SUPERUSER PASSWORD 'docker';\""
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='lol_db'\" | grep -q 1 || psql -c \"CREATE DATABASE lol_db OWNER docker;\""

# Parsear y mapear las variables de entorno del archivo .env con las del contenedor
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Se buildea nestjs
npm run build

# Se corre el servidor
npm run start:prod
