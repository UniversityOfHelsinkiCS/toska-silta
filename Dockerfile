FROM registry.access.redhat.com/ubi8/nodejs-24-minimal

ENV TZ="Europe/Helsinki"

WORKDIR /opt/app-root/src

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["node", "."]
