FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:22-alpine AS develop

WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
