# IMPORTANT: Only version 10 works for now in the avatar_server
# TODO: Implement ability to use later node version
#
# TODO: Consider using gravatar instead (i.e. https://www.gravatar.com/avatar/${hash}?d=robohash&s=512)
FROM node:10

WORKDIR /app

COPY ./ /app

RUN npm install && npm run build

CMD node server.js
