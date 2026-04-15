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
	render.yaml               # Render deployment blueprint
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

Build output is generated in `client/dist`. In production the Express server serves these files directly.

## Deploy to Render

This project includes a `render.yaml` Blueprint for one-click deployment on [Render](https://render.com).

### Steps

1. **Create a MongoDB Atlas cluster** (free tier available at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)):
   - Create a cluster and a database user.
   - Allow network access from anywhere (`0.0.0.0/0`) or from Render's IP range.
   - Copy the connection string (e.g. `mongodb+srv://user:password@cluster.mongodb.net/portfolio_db`).

2. **Connect the repo to Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) and click **New → Blueprint**.
   - Select this GitHub repository.
   - Render will detect `render.yaml` and create the `portfolio-website` web service automatically.

3. **Set the `MONGO_URI` environment variable** in the Render dashboard:
   - Navigate to the created service → **Environment**.
   - Add `MONGO_URI` with your MongoDB Atlas connection string.

4. **Deploy** – Render will build and start the service. The site will be available at `https://portfolio-website.onrender.com` (or your custom domain).

### What happens during deployment

| Step | Command |
|------|---------|
| Build | `npm run build` – installs all deps and builds the React app into `client/dist` |
| Start | `npm run start` – starts the Express server with `NODE_ENV=production`, which also serves the built React app |

