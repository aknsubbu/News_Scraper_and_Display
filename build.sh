#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Print commands and their arguments as they are executed
set -x

# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Python and Node.js
sudo apt-get install -y python3 python3-pip python3-venv nodejs npm

# Set up Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Install PM2 globally
npm install -g pm2

# Navigate to Next.js app directory
cd ai-website

# Install Node.js dependencies
npm install

# Build Next.js app
npm run build

# Navigate back to root directory
cd ..

# Create log directory for PM2
mkdir -p logs

# Install TypeScript and ts-node globally (for running TypeScript files with PM2)
npm install -g typescript ts-node

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "npm",
      args: "start",
      cwd: "./ai-website",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "python-scraper",
      script: ".venv/bin/python",
      args: "scraper.py",
      cwd: "./",
      interpreter: "none",
      env: {
        PYTHONUNBUFFERED: "1",
      },
      error_file: "logs/scraper-error.log",
      out_file: "logs/scraper-out.log",
      log_file: "logs/scraper-combined.log",
      time: true,
    },
  ],
};
EOL

# Start PM2 processes
pm2 start ecosystem.config.js

# Save PM2 process list and set up to start on system boot
pm2 save
pm2 startup

echo "Build process completed successfully!"