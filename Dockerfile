FROM node:18-alpine

# Set environment variables
ENV NEXT_PUBLIC_GO_BACKEND_WS=ws://localhost:8080

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD npm run build && npm run start