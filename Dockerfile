FROM node:20-alpine

USER root

RUN curl -fsSL https://bun.sh/install | BUN_INSTALL=/usr bash

COPY . .

RUN bun install

RUN bun db:generate

EXPOSE 3333

CMD [ "bun", "start:service" ]
