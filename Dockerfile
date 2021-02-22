FROM node:10

WORKDIR /app

COPY ./ /app

RUN npm install && npm run build

CMD node server.js
