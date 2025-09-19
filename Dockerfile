# Imagen de nodejs
FROM node:18-bullseye

# Se actualiza apt y se instala postgres
RUN apt-get update && apt-get install -y postgresql postgresql-contrib bash && rm -rf /var/lib/apt/lists/*

# Se instala nestjs (framework de node)
RUN npm install -g @nestjs/cli

# Nos movemos para no estar en /
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY start.sh ./start.sh

# Se dan permisos de ejecucion para este binario
RUN chmod +x ./start.sh

# Se muestra el puerto 5432
EXPOSE 3000 5432

# Se corre el binario
CMD ["./start.sh"]
