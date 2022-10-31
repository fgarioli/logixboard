# pull official base image
FROM node:15.14.0-alpine3.13

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install --silent

RUN npx prisma generate

EXPOSE 3000

# start app
CMD ["npm", "run", "dev"]