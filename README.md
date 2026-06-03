# 💻 Chetan Pawar — Portfolio Website

A React portfolio and admin content management project built with Vite, Express, MongoDB, and Framer Motion.

This repository contains both the frontend UI and a backend API for managing portfolio content, blog posts, admin data, and contact messages.

## 🚀 Features

- Responsive portfolio layout with React and CSS
- Animated UI using Framer Motion
- Admin panel for content management
- Blog posts with agree/disagree voting
- Contact form integration with EmailJS support
- MongoDB-powered backend API

## 🧩 Project structure

- `src/` - React frontend source code
- `server/` - Express API and server-side routes
- `public/` - static files served by Vite
- `assets/` - shared media assets

## ⚙️ Local setup

```bash
# clone
git clone <repository-url>
cd Chetan-Portfolio

# install dependencies
npm install
```

### Run locally

```bash
# frontend only
npm run dev

# backend only
npm run server

# frontend + backend together
npm run dev:full
```

### Seed data

```bash
# create admin user
npm run seed:admin

# seed default page content
npm run seed:content
```

## 📄 Available scripts

- `npm run dev` — start Vite frontend
- `npm run server` — start Express backend
- `npm run dev:full` — run frontend and backend together
- `npm run seed:admin` — seed initial admin credentials
- `npm run seed:content` — seed initial page content
- `npm run build` — create production frontend build
- `npm run preview` — preview production build locally

## 🔐 Environment variables

Create a local `.env` file and configure the following values as needed:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `VITE_API_URL` (e.g. `http://localhost:5000/api` for local development)
- `CLIENT_URL` (e.g. `http://localhost:5173`)
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

> Do not commit `.env` files or secret values to source control.

## 🧪 Deployment notes

- Build the frontend with `npm run build`
- Serve the frontend and backend from appropriate hosting platforms
- Ensure `VITE_API_URL` points to the deployed backend API
- Keep secret keys out of version control

## 📬 Contact

- Email: `chetanpawar8125@gmail.com`
- LinkedIn: https://www.linkedin.com/in/chetan-pawarr
- GitHub: https://github.com/Chetan-Pawar18706

## 📜 License

MIT
