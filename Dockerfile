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
RUN npm run build
# RUN npx prisma migrate deploy && npx prisma db seed
RUN cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
# ENTRYPOINT ["npm", "start"]

FROM base AS production
COPY --from=development snipeit/.next/standalone .
ENTRYPOINT ["node", "server.js"]

# cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
