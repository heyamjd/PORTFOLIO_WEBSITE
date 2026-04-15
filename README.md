# MERN Portfolio Website

This project has been converted from a static HTML/CSS/JS portfolio into a MERN stack application:

- MongoDB: stores portfolio content and contact form submissions
- Express + Node.js: REST API backend
- React (Vite): frontend UI

## Project Structure

```
PORTFOLIO_WEBSITE-main/
	client/                   # React frontend (Vite)
	server/                   # Express + MongoDB backend
	index.html                # Original static version (kept as reference)
	portfolio.css             # Original static version (kept as reference)
	portfolio.js              # Original static version (kept as reference)
	package.json              # Root scripts to run both apps
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally or a MongoDB Atlas URI

## Setup

1. Install dependencies from the root:

```bash
npm run install:all
```

2. Create environment files:

- Copy `.env.example` to `.env` in the root if you want one combined reference.
- Copy `server/.env.example` to `server/.env` and set backend values.
- Copy `client/.env.example` to `client/.env` if needed.

Minimum required backend values in `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_db
CLIENT_ORIGIN=http://localhost:5173
```

## Run In Development

From the root:

```bash
npm run dev
```

This starts:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## API Endpoints

- `GET /api/health` - health check
- `GET /api/portfolio` - get portfolio data (auto-seeds default data first time)
- `PUT /api/portfolio` - update portfolio data
- `POST /api/contact` - submit contact form message
- `GET /api/contact` - list stored contact messages

## Build Frontend

```bash
npm run build
```

Build output is generated in `client/dist`.


