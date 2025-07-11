FROM alpine:3.22.0 AS base

RUN apk update && apk upgrade  && \
    apk add curl \
    tar \
    iputils \
    iputils-ping \
    cmake \
    git \
    npm \
    nodejs \
    typescript 

FROM base AS development
RUN mkdir -p /snipeit
WORKDIR /snipeit
COPY . .
RUN npm install
RUN npm run build
# ENTRYPOINT ["npm", "start"]

FROM base AS production
COPY --from=development snipeit/.next/standalone .
COPY --from=development snipeit/.next/static ./static
COPY --from=development snipeit/public ./public
ENTRYPOINT ["node", "server.js"]
