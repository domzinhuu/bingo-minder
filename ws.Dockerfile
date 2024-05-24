FROM node:20-alpine3.20

WORKDIR /usr/src/app

COPY ./server/package*.json ./

RUN npm ci

COPY server/ .

EXPOSE 8080

CMD [ "npm", "start" ]