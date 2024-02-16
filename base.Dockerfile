FROM node:16-alpine as base
# install bash to run the script in the container
RUN apk add --no-cache bash 

# use below step to fix the issue with argon2
# RUN apk add --no-cache python3 

WORKDIR /home/app/
COPY package*.json /home/app/

FROM base AS dependencies
# install dependencies in package-lock.json 
RUN npm ci 

FROM dependencies AS build
COPY . /home/app/
