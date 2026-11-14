# Development stage - Direct React development server
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables
ENV VITE_API_BASE_URL=http://localhost:8003

# Start development server
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
