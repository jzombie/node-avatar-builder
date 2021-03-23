# IMPORTANT: Only version 10 works for now in the avatar_server
# TODO: Implement ability to use later node version
FROM node:10

WORKDIR /app

COPY ./ /app

RUN npm install && npm run build

CMD node server.js
