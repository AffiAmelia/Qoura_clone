# Dockerfile for frontend service
# Use the official Node.js image as the base image
FROM node:14
# Set the working directory in the container
WORKDIR /app/qoura_fe/src/app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install dependencies
RUN npm install
ENV NODE_ENV production
# Copy the rest of the frontend source code
COPY . .
# Expose the port on which the frontend will run
EXPOSE 3000
# Start the frontend server
CMD [ "npm", "start" ]