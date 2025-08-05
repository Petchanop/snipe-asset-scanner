FROM node:22.16.0-alpine3.22 AS base

RUN apk update && apk upgrade  && \
    apk add cmake \
    git \
    typescript 

FROM base AS development
RUN mkdir -p /snipeit
WORKDIR /snipeit
COPY . .
RUN npm install
# RUN npx prisma migrate deploy
RUN npm run build
# RUN cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
# ENTRYPOINT ["npm", "start"]

FROM base AS production
# COPY --from=development snipeit/.next/standalone .
COPY --from=development snipeit/ .
# ENTRYPOINT ["node", "server.js"]
ENTRYPOINT ["npm", "run", "start"]

FROM node:22.16.0-bookworm-slim AS test

RUN apk update && apk upgrade  && \
    apk add cmake \
    git \
    typescript

RUN npm install
# run shell script to install playwright for test

# cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
