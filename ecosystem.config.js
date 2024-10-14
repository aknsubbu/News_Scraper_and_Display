module.exports = {
  apps: [
    {
      name: "nextjs-frontend",
      script: "npm",
      args: "start -- --port 8080", // Modified this line
      cwd: "./ai-lab-news-website",
      env: {
        NODE_ENV: "production",
        PORT: "8080", // Added this line to set the PORT environment variable
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
