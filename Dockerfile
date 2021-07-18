FROM node:14.alpine
RUN mkdir -p /usr/src/app

COPY ./api/ /usr/src/app/

WORKDIR /usr/src/app
RUN npm install --save
EXPOSE 8000
CMD npm run dev-docker
