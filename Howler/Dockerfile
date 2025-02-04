FROM node:lts
WORKDIR /app
COPY ./* /app
RUN npm install
RUN npm install base64url
# RUN npm i hbs
CMD ["npm", "start"]