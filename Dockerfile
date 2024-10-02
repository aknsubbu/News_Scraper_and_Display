# Use an official Ubuntu as a parent image
FROM ubuntu:20.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    NODE_VERSION=18.x

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    sudo \
    python3 \
    python3-pip \
    python3-venv \
    && curl -sL https://deb.nodesource.com/setup_${NODE_VERSION} | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy project files
COPY . /app/

# Make build.sh executable
RUN chmod +x build.sh

# Run build.sh
RUN ./build.sh

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Start PM2 processes
CMD ["pm2-runtime", "start", "ecosystem.config.js"]