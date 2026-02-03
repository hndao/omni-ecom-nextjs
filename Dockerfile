# Use Node.js 22 LTS
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies for better compatibility
RUN apk add --no-cache libc6-compat bash wget curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create .env.local if it doesn't exist
RUN if [ ! -f .env.local ]; then \
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local && \
    echo "NEXT_PUBLIC_CHANNEL_DOMAIN=localhost" >> .env.local; \
    fi

# Expose port
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Start Next.js development server
CMD ["npm", "run", "dev"]

