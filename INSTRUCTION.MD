# Temporary Token Chat App

**Project Instruction Document**
**Role:** Project Manager

---

# 1. Project Overview

This project is a **temporary token-based chat application** where two users can chat without creating accounts or storing permanent chat history.

A user can **create a chat session**, which generates a **unique token**.
Another user can **join the chat using that token**.

Once both users leave the chat room:

* The chat session is **deleted**
* All messages are **cleared**
* No permanent storage of chat history remains

The system is designed to be **lightweight, privacy-focused, and session-based**.

---

# 2. Tech Stack

## Frontend

* React
* TailwindCSS

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL

## API Communication

* REST APIs

## Deployment (Optional Later)

* Vercel (Frontend)
* Railway / Render / VPS (Backend)
* Supabase / PostgreSQL instance

---

# 3. Team Structure

Total Members: **4**

| Role        | Responsibility                    |
| ----------- | --------------------------------- |
| Developer 1 | Backend development               |
| Developer 2 | Frontend development              |
| UI Designer | UI/UX design and layout           |
| Tester      | Quality assurance and bug testing |

---

# 4. Core Features

### Chat Room Creation

User can create a chat room and receive a **unique token**.

### Join Chat

Another user can enter the **token** to join the chat session.

### Messaging

Users can send messages inside the room.

### Temporary Chat

Messages exist only while users are connected.

### Session Deletion

When both users leave the room, the chat is deleted.

---

# 5. Database Structure

### Table: `messages`

| Column   | Type               |
| -------- | ------------------ |
| id       | SERIAL PRIMARY KEY |
| token    | VARCHAR            |
| username | VARCHAR            |
| message  | TEXT               |
| time     | TIMESTAMP          |

**Note:**
Messages may optionally be deleted when the session ends.

---

# 6. Role Responsibilities

## Developer 1 (Backend Developer)

### Backend Setup

* Initialize Node.js project
* Setup Express server
* Setup PostgreSQL connection
* Create project folder structure

### API Development

#### Create Chat Room

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

#### Join Chat Room

```
POST /join-room
```

Input

```
token
username
```

---

#### Send Message

```
POST /send-message
```

Input

```
token
username
message
```

Store message in database.

---

#### Fetch Messages

```
GET /messages/:token
```

Return all messages for that token.

---

#### Delete Chat Session

```
DELETE /room/:token
```

Delete all messages when session ends.

---

### Additional Backend Tasks

* Token generation system
* Input validation
* Error handling
* API response standardization

---

# Developer 2 (Frontend Developer)

## React Application Setup

Setup project with:

```
React
TailwindCSS
Axios / Fetch API
```

---

## Pages to Build

### Home Page

* Create chat button
* Join chat input (token)

### Chat Room Page

Features:

* Display messages
* Input message field
* Send button
* Username input

---

## Messaging System

Implement message fetching using:

* **Polling (every 2–3 seconds)**

or

* **Manual refresh button**

---

## UI Components

Create reusable components:

* ChatBubble
* MessageList
* MessageInput
* TokenDisplay
* JoinRoomForm

---

## State Management

Use React state for:

* messages
* token
* username

---

# UI Designer

## UI Design Responsibilities

Design clean UI for:

1. Home Page
2. Chat Room
3. Token Display
4. Message Input Area

---

## Design Requirements

* Minimal design
* Clean chat layout
* Mobile responsive
* Tailwind compatible design

---

## UI Elements

Design:

* Chat bubbles
* Message timestamps
* Token display card
* Join room form
* Create room button

---

## Deliverables

Provide:

* Figma design
* Color palette
* Component layout guide

---

# Tester

## Functional Testing

Test all core features:

| Feature        | Test Case                 |
| -------------- | ------------------------- |
| Create chat    | Token generated           |
| Join chat      | Valid token works         |
| Messaging      | Messages appear correctly |
| Session delete | Chat removed after exit   |

---

## Edge Case Testing

Test scenarios:

* Invalid token
* Empty message
* Multiple users
* Rapid message sending
* Page refresh during chat

---

## API Testing

Test APIs using:

* Postman
* Insomnia

Verify:

* Correct responses
* Error handling
* Status codes

---

## UI Testing

Check:

* Mobile responsiveness
* Message alignment
* Layout issues
* Loading states

---

## Bug Reporting

Maintain a **bug tracking document**.

Example:

| ID | Issue                      | Priority |
| -- | -------------------------- | -------- |
| 01 | Chat not loading           | High     |
| 02 | Token input not validating | Medium   |

---

# 7. Folder Structure

## Backend

```
server
├ routes
├ controllers
├ database
├ utils
└ server.js
```

## Frontend

```
client
├ components
├ pages
├ services
├ hooks
└ App.jsx
```

---

# 8. Development Phases

### Phase 1

Project setup and database connection.

### Phase 2

API development.

### Phase 3

Frontend UI development.

### Phase 4

Integration of frontend and backend.

### Phase 5

Testing and bug fixing.

### Phase 6

Deployment.

---

# 9. Expected Deliverables

Final system must include:

* Working chat system
* Token-based room joining
* Message sending
* Message viewing
* Temporary session clearing
* Clean UI
* Tested APIs

---

# 10. Future Improvements

Possible upgrades:

* WebSocket real-time messaging
* End-to-end encryption
* Multi-user chat rooms
* Expiring tokens
* Chat file sharing

---

# 11. Git Repository Setup & Push

All project code must be pushed to the **GitHub repository provided in `README.md`.**

### Initialize Git

```
git init
```

---

### Add Remote Repository

```
git remote add origin https://github.com/your-username/token-chat-app.git
```

Verify remote:

```
git remote -v
```

---

### Add Files

```
git add .
```

---

### First Commit

```
git commit -m "Initial project setup"
```

---

### Push to GitHub

```
git branch -M main
git push -u origin main
```

---

# Git Workflow Rules

### Before Starting Work

```
git pull origin main
```

---

### After Completing Work

```
git add .
git commit -m "Describe the changes clearly"
git push origin main
```

---

# Recommended Commit Message Style

Examples:

```
feat: add create room API
fix: resolve message fetching bug
ui: improve chat layout
test: add API test cases
```

---

# Branching Strategy

Developers should work in feature branches.

Example:

```
git checkout -b feature/chat-api
```

Push branch:

```
git push origin feature/chat-api
```

Then create a **Pull Request** to merge into `main`.

---

# Repository Files

```
token-chat-app
│
├ client
├ server
├ README.md
├ instruction.md
└ architecture.md
```

---

# Project Goal

Deliver a **fully functional temporary chat application** with a clean UI and stable backend APIs.
