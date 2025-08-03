FROM node:22

WORKDIR /app

COPY . .

RUN yarn install

CMD ["node", "index.js"]
