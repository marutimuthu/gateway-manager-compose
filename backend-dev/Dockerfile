FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

# Install dependecies
RUN npm i

# Install pm2
# RUN npm i pm2 -g

# Get all the code needed to run the app
COPY . /usr/src/app

# Serve the app
CMD ["npm", "start"]