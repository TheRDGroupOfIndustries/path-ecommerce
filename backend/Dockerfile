FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install .

COPY . .

RUN npx prisma generate

RUN npm run build

RUN sudo find . -mindepth 1 -maxdepth 1 ! -name dist -exec rm -rf {} +

EXPOSE 8000

CMD [ "node", "dist/main.js" ]