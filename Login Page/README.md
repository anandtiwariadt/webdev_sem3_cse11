# AVS - Dive into Unimaginable Dimensions

A full-stack, responsive web application featuring an interactive Landing Page, a 650ms GPU-accelerated sliding Authentication Portal, and a streamlined After-Login Dashboard connected to a persistent Node.js REST API.

---

## Features

- **Branded & Atmospheric Design**: Sleek dark-mode aesthetic with custom typography (*Outfit* & *Plus Jakarta Sans*), glassmorphism, and responsive layouts.
- **Sliding Authentication Flow**: Seamless 650ms transform transition between Login and Signup modes with client-side form validation.
- **Dynamic After-Login Dashboard**: Displays authenticated user session and real-time directory of registered users.
- **Full RESTful Backend (`server.js`)**: Built with native Node.js HTTP streams and `EventEmitter` for zero-dependency high performance.
- **Full CRUD Support**:
  - `GET /employee` — List all registered users
  - `POST /create` — Register new user
  - `PUT /edit/:id` — Live update user record
  - `DELETE /delete/:id` — Remove user from directory
  - `GET /sys` — System telemetry and uptime
- **Unified Single-Server Architecture**: Built-in static asset server and API router — ready for one-click cloud deployment on any platform.

---

## Local Quickstart

### Prerequisites
- Node.js version 18 or higher installed.

### 1. Install & Run
```bash
# Clone or navigate into project directory
cd "Login Page"

# Start the unified server
npm start
```

### 2. Access the Application
Open your browser and navigate to:
```
http://localhost:3001
```

---

## Cloud Deployment Guide

This project is **100% deployment-ready**. You can deploy it to any cloud host in under 2 minutes:

### Option 1: Deploy to Render.com (Recommended — Free & Easy)
1. Push your project to a GitHub repository.
2. Log into [Render.com](https://render.com) and click **New +** → **Web Service**.
3. Select your GitHub repository.
4. Configure the service:
   - **Environment:** `Node`
   - **Build Command:** *(leave empty or `npm install`)*
   - **Start Command:** `npm start`
5. Click **Create Web Service**. Render will automatically detect the port via `process.env.PORT` and deploy your live URL (e.g. `https://avs-portal.onrender.com`).

---

### Option 2: Deploy to Railway.app
1. Go to [Railway.app](https://railway.app) and click **New Project** → **Deploy from GitHub repo**.
2. Select your repository.
3. Railway will automatically detect `package.json`, run `npm start`, and generate an HTTPS domain for you.

---

### Option 3: Deploy to VPS / Docker / Ubuntu Server
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Run with PM2 for production process management
npm install -g pm2
pm2 start server.js --name "avs-portal"
pm2 save
pm2 startup
```

---

## API Endpoints Reference

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| `GET` | `/employee` | Fetch all registered users | None |
| `GET` | `/userData/:id` | Fetch user by ID | None |
| `POST` | `/create` | Create a new user | `{"name":"Elena","email":"elena@dimension.com","role":"Voyager"}` |
| `PUT` | `/edit/:id` | Update existing user | `{"name":"Elena Updated","email":"elena@dimension.com","role":"Architect"}` |
| `DELETE` | `/delete/:id` | Delete user by ID | None |
| `GET` | `/sys` | Server platform & uptime | None |
| `GET` | `/msg` | Health check probe | None |

---

## License
ISC License — Created for AVS Portal.
