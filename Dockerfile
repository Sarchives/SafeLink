FROM node:16-bullseye-slim

RUN apt update && apt install -y sqlite3

WORKDIR /usr/src/app
COPY package*.json ./

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]