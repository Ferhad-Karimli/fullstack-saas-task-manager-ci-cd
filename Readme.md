# Fullstack SaaS Task Manager (CI/CD + Docker + VPS)

A fullstack task manager application built with **Vite + React** on the frontend and **Node.js (Express) + MongoDB** on the backend.  
The project is deployed on a **DigitalOcean VPS** using **Docker + Docker Compose**, with **Nginx** serving the frontend and proxying API requests via **/api**.  
It also includes **CI/CD automation with GitHub Actions** for continuous deployment.

---

## 🚀 Live Deployment (VPS)

This project runs on a single VPS:

- **Frontend**: served by **Nginx**
- **Backend API**: Express app running in a Docker container
- **Database**: MongoDB container
- **Reverse Proxy**: Nginx proxies API requests from frontend to backend (`/api` → `api:3001`)
- **Auto Deployment (CD)**: GitHub Actions builds Docker images and deploys to VPS automatically

---

## ✨ Features

### Frontend (Vite + React)
- ✅ Signup & Login UI
- ✅ JWT-based authentication flow
- ✅ Task CRUD (Create, Read, Update, Delete)
- ✅ Protected routes (user must be logged in)
- ✅ API calls are made to `/api/*` (works behind Nginx proxy)

### Backend (Express + MongoDB)
- ✅ REST API for auth & tasks
- ✅ JWT token authentication middleware
- ✅ Protected endpoints (unauthorized users are blocked)
- ✅ MongoDB database integration

---

## 🧱 Tech Stack

**Frontend**
- Vite
- React
- JavaScript/TypeScript (based on project setup)
- Fetch/Axios (API calls)

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT Authentication

**DevOps / Deployment**
- Docker & Docker Compose
- Nginx (static hosting + reverse proxy)
- GitHub Actions (CI/CD)
- DigitalOcean VPS

---

## 🗂️ Project Structure

```bash
task-saas/
  client/        # Vite React app
    my-app/
  server/        # Express API
  docker-compose.*.yml
.github/
  workflows/     # GitHub Actions pipelines
