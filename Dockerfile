FROM node:12
WORKDIR /app
COPY main.js package-lock.json package.json ./

RUN npm ci

CMD ["npm", "start"]