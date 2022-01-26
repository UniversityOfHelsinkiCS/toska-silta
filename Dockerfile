FROM node:16-alpine3.14

WORKDIR /usr/src/app

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

CMD ["node", "."]