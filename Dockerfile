FROM node:22.14.0-alpine

RUN apt update
RUN apt install curl bash -y
RUN curl -fsSL https://bun.sh/install | bash
RUN npm i -g bun

WORKDIR /var/www

COPY . .

RUN bun install --frozen-lockfile

RUN bun run build

ENV PORT=3000
EXPOSE $PORT

CMD ["bun", "start"]
