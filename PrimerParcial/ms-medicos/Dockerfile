FROM com600/node-base:1.0
USER root
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY src ./src
COPY proto ./proto
RUN chown -R node:node /app
USER node

EXPOSE 50051

CMD ["node", "src/app.js"]
