# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    gcc \
    g++ \
    python3 \
    py3-pip \
    openjdk11 \
    make \
    cmake \
    git \
    curl \
    bash

# Set up Python
RUN ln -sf python3 /usr/bin/python
# Create a virtual environment and install pip packages there
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create necessary directories for code execution
RUN mkdir -p /app/codes /app/inputs /app/outputs

# Set proper permissions
RUN chmod -R 777 /app/codes /app/inputs /app/outputs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]
