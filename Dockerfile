# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Make port 7860 available to the world outside this container
EXPOSE 7860
EXPOSE 5038

# Run the app
CMD ["node", "server.cjs"]