# 🌑 Noir Chat

A **premium, privacy-focused temporary chat application** designed for ephemeral conversations. Users can establish unique spectral links that vanish into the void upon termination.

---

## ✨ Features

- **Dual Matrix Modes**:
  - **Private**: Secure dual-link restricted to exactly 2 participants.
  - **Group**: Open multi-matrix for unlimited participants.
- **Zero Persistence**: No message history is stored permanently.
- **No Accounts**: Join via unique tokens and temporary aliases.
- **Manual Termination**: Use the "Purge Matrix" feature to instantly wipe all data for everyone in the session.
- **Premium Aesthetics**: Warmer dark-mode design with fluid animations and responsive glassmorphism.

---

## 🚀 Tech Stack

- **Frontend**: React, TailwindCSS, Lucide-React
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (Client) + Render (Server)

---

## 🛠️ Local Setup

### 1. Database Setup (Supabase)
1. Create a project at [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the query found in `server/database/init.sql`.
3. Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Project Settings > API.

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in `/server`:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```
Run: `npm start`

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:5000
```
Run: `npm run dev`

---

## 🌍 Hosting Guide

### **1. Database (Supabase)**
- Already set up during local steps. Ensure your tables match the latest `init.sql`.

### **2. Backend (Render)**
1. Sign in to [Render](https://render.com).
2. Create a **New > Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add **Environment Variables**:
   - `SUPABASE_URL`: (Your URL)
   - `SUPABASE_ANON_KEY`: (Your Key)
   - `PORT`: `5000` (optional, Render handles it)

### **3. Frontend (Vercel)**
1. Sign in to [Vercel](https://vercel.com).
2. Create a **New Project** and import your repository.
3. Configure settings during the import:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_URL`: (The URL of your live Render backend)
5. Deploy!

---

## 📖 API Reference

### Rooms
- `POST /create-room`: Initialize a matrix. Body: `{ "type": "private" | "group" }`
- `POST /join-room`: Sync with a matrix. Body: `{ "token": "...", "username": "..." }`
- `POST /leave-room`: Dissociate from matrix. Body: `{ "token": "...", "username": "..." }`
- `DELETE /room/:token`: Terminate and purge matrix history.

### Messages
- `POST /send-message`: Transmit data. Body: `{ "token": "...", "username": "...", "message": "..." }`
- `GET /messages/:token`: Retrieve spectral history.

---

## ⚖️ License
Demonstration purposes only. Zero data persistence guaranteed.

---

## 👤 Author
Developed as a high-fidelity ephemeral workspace project.
