# Use a lightweight Node.js base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /src

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Vite port to allow access from outside the container
EXPOSE 5173

# Run the Vite development server
CMD ["npm", "run", "dev"]
