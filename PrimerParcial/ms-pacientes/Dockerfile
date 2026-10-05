FROM com600/node-base:1.0
USER root
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY src ./src
RUN chown -R node:node /app
USER node
EXPOSE 3001

CMD ["node", "src/app.js"]
