FROM node:latest

WORKDIR /app
COPY package*.json ./
RUN yarn install

CMD ["sh", "init.sh"]