# System Architecture

Temporary Token Chat App

---

# 1. Architecture Overview

The Temporary Token Chat App follows a **client-server architecture**.

The system is composed of three main layers:

1. **Frontend (Client)**
2. **Backend (API Server)**
3. **Database (PostgreSQL)**

Users interact with the **React frontend**, which communicates with the **Node.js + Express backend** through **REST APIs**.
The backend handles **token generation, chat session management, and message storage**.

Messages are temporarily stored in the **PostgreSQL database** and removed when the session ends.

---

# 2. High-Level System Flow

1. User opens the application.
2. User chooses to **create a room** or **join a room**.
3. Backend generates a **unique token** for the room.
4. Another user joins using the token.
5. Both users send and receive messages.
6. Messages are stored temporarily in the database.
7. When both users leave the room, the backend deletes the chat session.

---

# 3. Architecture Diagram

```
User A (Browser)        User B (Browser)
        |                       |
        |                       |
        v                       v
   React Frontend         React Frontend
           \               /
            \             /
             v           v
           REST API (HTTP)
                 |
                 v
        Node.js + Express Server
                 |
                 v
            PostgreSQL Database
```

---

# 4. Frontend Architecture

Frontend is built using **React** with **TailwindCSS**.

### Responsibilities

* UI rendering
* Sending API requests
* Displaying messages
* Handling user input
* Managing local state

### Frontend Structure

```
client
│
├ components
│   ├ ChatBubble.jsx
│   ├ MessageList.jsx
│   ├ MessageInput.jsx
│   ├ TokenDisplay.jsx
│   └ JoinRoomForm.jsx
│
├ pages
│   ├ Home.jsx
│   └ ChatRoom.jsx
│
├ services
│   └ api.js
│
├ hooks
│   └ useMessages.js
│
└ App.jsx
```

---

# 5. Backend Architecture

Backend is built with **Node.js and Express.js**.

### Responsibilities

* Generate chat tokens
* Manage chat sessions
* Store and fetch messages
* Validate API requests
* Handle session cleanup

### Backend Structure

```
server
│
├ routes
│   └ chatRoutes.js
│
├ controllers
│   └ chatController.js
│
├ database
│   └ db.js
│
├ utils
│   └ tokenGenerator.js
│
└ server.js
```

---

# 6. API Architecture

The backend exposes REST APIs for the frontend.

### API Endpoints

| Method | Endpoint         | Purpose               |
| ------ | ---------------- | --------------------- |
| POST   | /create-room     | Generate a chat token |
| POST   | /join-room       | Join chat using token |
| POST   | /send-message    | Send a chat message   |
| GET    | /messages/:token | Fetch messages        |
| DELETE | /room/:token     | Delete chat session   |

---

# 7. Database Architecture

Database used: **PostgreSQL**

### Table: messages

| Column   | Type               |
| -------- | ------------------ |
| id       | SERIAL PRIMARY KEY |
| token    | VARCHAR            |
| username | VARCHAR            |
| message  | TEXT               |
| time     | TIMESTAMP          |

### Data Flow

1. User sends message
2. Frontend sends API request
3. Backend stores message in database
4. Frontend fetches messages periodically

---

# 8. Token Generation System

Each chat room uses a **unique token**.

Example token:

```
AB12CD
```

### Token Rules

* Random string
* 6 characters
* Uppercase letters + numbers
* Must be unique

Token generation occurs in:

```
utils/tokenGenerator.js
```

---

# 9. Message Flow

Message flow follows this sequence:

```
User Types Message
        |
        v
Frontend sends POST /send-message
        |
        v
Backend validates request
        |
        v
Message stored in PostgreSQL
        |
        v
Frontend fetches messages (polling)
        |
        v
Messages rendered in UI
```

---

# 10. Session Lifecycle

### Session Creation

User clicks **Create Room**

Backend generates token.

---

### Session Active

Users exchange messages.

Messages are temporarily stored.

---

### Session End

When both users leave:

1. Frontend calls

```
DELETE /room/:token
```

2. Backend deletes messages from database.

---

# 11. Security Considerations

Basic protections include:

* Input validation
* Token verification
* Prevent empty messages
* Rate limiting (optional future)

Future improvements may include:

* Encryption
* Authentication
* Abuse protection

---

# 12. Scalability Considerations

Current architecture supports small-scale usage.

Future scaling options:

* WebSockets for real-time messaging
* Redis for session management
* Message queues
* Horizontal backend scaling
* Load balancers

---

# 13. Future Architecture Improvements

Possible upgrades:

### Real-Time Messaging

Replace polling with:

* WebSockets
* Socket.IO

### Chat Expiration

Add auto-delete timer:

```
room expires after 30 minutes
```

### Multi-user Rooms

Allow multiple participants per token.

### File Sharing

Support images and attachments.

---

# 14. Deployment Architecture (Future)

```
           Internet
               |
               v
        Vercel (Frontend)
               |
               v
      Node.js API Server
     (Railway / VPS / Render)
               |
               v
         PostgreSQL Database
           (Supabase)
```

---

# 15. Architecture Goals

This architecture is designed to be:

* Simple
* Maintainable
* Modular
* Scalable
* Privacy-focused
