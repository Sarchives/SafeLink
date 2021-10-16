FROM node:16-bullseye-slim

RUN apt update && apt install -y sqlite3

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install 

COPY . .

CMD [ "node", "src/index.js" ]