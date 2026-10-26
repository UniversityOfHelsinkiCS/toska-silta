FROM node:24-alpine

ENV TZ="Europe/Helsinki"

WORKDIR /opt/app-root/src

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["node", "."]
