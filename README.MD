# Temporary Token Chat App

A **privacy-focused temporary chat application** where two users can communicate using a **unique token**, without creating accounts or storing permanent chat history.

This project demonstrates a **full-stack architecture using React, Node.js, Express, and PostgreSQL**.

---

# Features

* Create a temporary chat room
* Join a chat using a unique token
* Send and receive messages
* No user accounts required
* Messages exist only during the active session
* Automatic chat session deletion when users leave

---

# Tech Stack

### Frontend

* React
* TailwindCSS
* Axios / Fetch API

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### API Communication

* REST APIs

### Deployment (Optional)

* Vercel (Frontend)
* Railway / Render / VPS (Backend)
* Supabase / PostgreSQL instance

---

# Project Structure

```
token-chat-app
│
├ client
│   ├ components
│   ├ pages
│   ├ services
│   ├ hooks
│   └ App.jsx
│
├ server
│   ├ routes
│   ├ controllers
│   ├ database
│   ├ utils
│   └ server.js
│
├ instruction.md
├ architecture.md
└ README.md
```

---

# How It Works

1. A user creates a chat room.
2. The system generates a **unique token**.
3. Another user joins the room using that token.
4. Both users can send and receive messages.
5. Messages are stored temporarily.
6. When both users leave the room, the session is deleted.

---

# API Endpoints

### Create Chat Room

```
POST /create-room
```

Response

```json
{
  "token": "AB12CD"
}
```

---

### Join Chat Room

```
POST /join-room
```

Body

```
token
username
```

---

### Send Message

```
POST /send-message
```

Body

```
token
username
message
```

---

### Fetch Messages

```
GET /messages/:token
```

Returns all messages for that chat room.

---

### Delete Chat Session

```
DELETE /room/:token
```

Deletes all messages when the session ends.

---

# Database Schema

Table: `messages`

| Column   | Type               |
| -------- | ------------------ |
| id       | SERIAL PRIMARY KEY |
| token    | VARCHAR            |
| username | VARCHAR            |
| message  | TEXT               |
| time     | TIMESTAMP          |

---

# Development Setup

## 1. Clone the Repository

```
git clone https://github.com/pathakjiop/token-chat-app
cd token-chat-app
```

---

## 2. Setup Backend

```
cd server
npm install
```

Create `.env`

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/chatdb
```

Start backend server

```
npm start
```

---

## 3. Setup Frontend

```
cd client
npm install
npm run dev
```

---

# Development Phases

1. Project setup
2. Backend API development
3. Frontend UI development
4. API integration
5. Testing
6. Deployment

---

# Testing

Testing should include:

* API testing using Postman or Insomnia
* UI testing for responsiveness
* Edge case testing
* Session deletion validation

---

# Future Improvements

Possible upgrades:

* Real-time messaging using WebSockets
* End-to-end encryption
* Multi-user chat rooms
* Token expiration
* File sharing
* Message reactions

---

# License

This project is for **educational and demonstration purposes**.

---

# Author

Built as a **full-stack learning project** demonstrating modern web application architecture.
