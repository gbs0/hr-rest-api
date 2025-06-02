FROM node:22.14.0-alpine

WORKDIR /var/www
COPY package.json package-lock.json ./
RUN npm clean-install

COPY . .
RUN bun run build

ENV PORT=3000
EXPOSE $PORT

CMD ["bun", "start"]
