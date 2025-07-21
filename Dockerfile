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
RUN npx prisma migrate deploy
RUN npm run build
RUN cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
# ENTRYPOINT ["npm", "start"]

FROM base AS production
COPY --from=development snipeit/.next/standalone .
ENTRYPOINT ["node", "server.js"]

# cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
