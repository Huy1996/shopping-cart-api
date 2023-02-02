FROM node:12-alpine
WORKDIR /app/backend

COPY package.json ./
RUN npm install

COPY . .
EXPOSE 4000
CMD ["npm", "run", "start"]