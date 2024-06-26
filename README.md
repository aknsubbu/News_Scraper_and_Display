# News Scraper and Display Application

## Overview

This project is a real-time news feed application built using FastAPI for the backend and Next.js for the frontend. The backend continuously scrapes articles from specified sources, stores them in a JSON file, and serves them to the frontend via WebSocket connections. The frontend listens for new articles in real-time and displays them to the user.

## Features

- Real-time article updates using WebSockets
- Backend scraping with FastAPI
- Frontend built with Next.js and styled with NextUI
- Display of article details including title and text

## Project Structure

```
root
├── server.py
├──scraper.py
├── ai-lan-news-website
│   ├── components
│   │   ├── icons.tsx
│   │   └── primitives.tsx
│   │   └── counter.tsx
│   │   └── navbar.tsx
│   │   └── NewsCard.tsx
│   ├── config
│   │   └── site.ts
│   │   └── fonts.ts
│   ├── app
│   │   └── page.tsx
│   │   └── error.tsx
│   │   └── layout.tsx
│   │   └── providers.tsx
├── data.json
├── README.md
└── requirements.txt
```

### Backend

The backend is powered by FastAPI, a modern web framework for Python. It includes a WebSocket server that sends new articles to connected clients.


#### `scraper.py`

This script includes the logic for scraping articles from specified sources and storing them in `data.json`.

### Frontend

The frontend is built with Next.js and utilizes NextUI for styling. It connects to the FastAPI WebSocket server and displays articles in real-time.



## Getting Started

### Prerequisites

- Python 3.7+
- Node.js 14+

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/aknsubbu/News_Scraper_and_Display.git
cd News_Scraper_and_Display
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:

```bash
uvicorn server:app 
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ai-lab-news-website
```

2. Install Node.js dependencies:

```bash
npm install
```

3. Run the Next.js development server:

```bash
npm run dev
```

### Accessing the Application

- The FastAPI server will be running on `http://localhost:8000`
- The Next.js frontend will be running on `http://localhost:3000`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For questions or support, please contact [aknsubbu@gmail.com](mailto:aknsubbu@gmail.com).

---

This README provides an overview of the project, setup instructions, and other essential information to help users and contributors get started with the real-time news feed application.