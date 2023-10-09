FROM node:18
WORKDIR /usr/src/app
COPY node_modules ./node_modules
COPY dist/apps/backend ./
CMD [ "node", "main.js" ]
