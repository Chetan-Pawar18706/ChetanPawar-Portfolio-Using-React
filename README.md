# 💻 Chetan Pawar — Portfolio Website

A personal portfolio built with React.js and Framer Motion showcasing projects, skills and contact options.

## Admin panel with MongoDB

1. Start MongoDB locally (or use a hosted DB) and set MONGODB_URI in your local `.env`.  
2. Create the first admin user: `npm run seed:admin` (ensure env vars are set before seeding).  
3. Start API and frontend together: `npm run dev:full`.  
4. Admin panel: `http://localhost:5173/admin/login`.

Important: Do NOT commit `.env` or any secret keys to source control. Use local environment files for development and production configuration.

Configure the following values in `.env`, `.env.local`, or `.env.production` as appropriate:
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` (if using EmailJS)
- `VITE_API_URL` (`http://localhost:5000/api` for local development, `/api` for production builds)
- `CLIENT_URL` (`http://localhost:5173` for local development, your Render app URL in production)

If any secret was accidentally pushed, rotate/revoke it immediately and remove it from repo history.

---

## 🚀 Features

- Modern UI/UX with Framer Motion animations  
- Projects, Resume, and Contact sections  
- Admin panel for managing content (requires local backend + MongoDB)  
- Optional EmailJS-powered contact form

---

## 🛠️ Tech Stack

- Frontend: React.js, JavaScript (ES6+), CSS  
- Animation: Framer Motion  
- Backend: Node.js / Express (optional local API)  
- Database: MongoDB  
- Deployment: Vercel / Netlify (frontend), recommended host for backend

---

## ⚙️ Setup (local)

```bash
# clone
git clone <repository-url>
cd Chetan-Portfolio

# install
npm install

# run backend only
npm run server

# run frontend only
npm run dev

# run both together
npm run dev:full
```

---

## 📬 Contact

* 📧 Email: chetanpawar8125@gmail.com  
* 💼 LinkedIn: https://www.linkedin.com/in/chetan-pawarr  
* 🐙 GitHub: https://github.com/Chetan-Pawar18706

---

### Security notes
- Add `.env` to `.gitignore`.  
- Never paste secret keys into public issues/PRs.  
- Use long random values for JWT_SECRET and rotate credentials if leaked.

---

### License
MIT — see LICENSE.
