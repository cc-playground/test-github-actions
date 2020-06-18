FROM node:14-alpine as build-server
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build-ts

FROM node:14-alpine as build-ui
WORKDIR /app
COPY ui/package.json ui/package-lock.json ./
RUN npm ci
COPY ui ./
RUN npm run build

FROM node:14-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY --from=build-ui /app/dist/ ui/dist/
COPY --from=build-server /app/dist/ dist/
EXPOSE 3001
ENTRYPOINT [ "npm", "start" ]