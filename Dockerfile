FROM node:18-bullseye

RUN apt-get update && apt-get install -y postgresql postgresql-contrib bash && rm -rf /var/lib/apt/lists/*

RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000 5432

CMD ["./start.sh"]
