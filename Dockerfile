FROM node:10
ADD . /app
WORKDIR /app
RUN npm install
CMD ["npm", "start"]