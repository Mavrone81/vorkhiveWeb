# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite frontend React app
RUN npm run build

# Expose the port that the Express server listens on
EXPOSE 4998

# Start the Node.js Express server
CMD ["node", "server.js"]
