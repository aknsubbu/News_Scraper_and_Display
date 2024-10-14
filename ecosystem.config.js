module.exports = {
  apps: [
    {
      name: "nextjs-frontend",
      script: "npm",
      args: "start",
      cwd: "./ai-lab-news-website",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "python-scraper",
      script: ".venv/bin/python", // Path to Python in your virtual environment
      args: "scraper.py", // Your Python scraper script
      cwd: "./", // Root directory where the scraper script is located
      interpreter: "none", // Let PM2 use the specified Python interpreter
      env: {
        PYTHONUNBUFFERED: "1", // Ensures Python output is sent to PM2 logs immediately
      },
      error_file: "logs/scraper-error.log",
      out_file: "logs/scraper-out.log",
      log_file: "logs/scraper-combined.log",
      time: true,
    },
  ],
};
