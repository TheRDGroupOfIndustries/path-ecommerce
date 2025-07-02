FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install .

COPY . .

RUN npx prisma generate

RUN npm run build

COPY ./.env /app/dist

EXPOSE 8000

CMD [ "node", "dist/main.js" ]