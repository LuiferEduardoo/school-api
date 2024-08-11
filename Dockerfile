FROM node:22

WORKDIR /app/src/

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "deploy"]