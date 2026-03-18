# Sliq: Modern Project Management Platform

![Sliq Preview](https://via.placeholder.com/1200x600?text=Sliq+Project+Management+Platform)

Sliq is a high-performance, Jira-inspired project management platform built with the MERN stack. it features real-time updates via Socket.io, a sleek Kanban board for task management, comprehensive analytics, and a premium user experience.

## ✨ Key Features

- 📋 **Kanban Board**: Drag-and-drop task management with real-time syncing.
- 🚀 **Workspaces & Projects**: Organize tasks across multiple teams and initiatives.
- 🔔 **Real-time Notifications**: Stay updated with instant alerts for task assignments and status changes.
- 📊 **Analytics Dashboard**: Visualize team productivity and project progress with interactive charts.
- 💬 **Collaboration**: Comment on tasks and track activity timelines.
- 🔐 **Secure Authentication**: Robust JWT-based auth with protected routes.

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite for lightning-fast builds.
- **Tailwind CSS** for a modern, responsive UI.
- **Framer Motion** for smooth, premium animations.
- **@dnd-kit** for robust drag-and-drop interactions.
- **Lucide React** for beautiful, consistent iconography.

### Backend
- **Node.js & Express** for a scalable API.
- **MongoDB Atlas** for high-availability data storage.
- **Socket.io** for seamless real-time communication.
- **Mongoose** for elegant data modeling.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/causyash/sliq.git
cd sliq
```

### 2. Setup the Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

## 📂 Project Structure

- `client/`: React frontend source code.
- `server/`: Node.js/Express backend source code.
- `docs/`: Comprehensive system design and deployment guides.

## 📄 License
This project is licensed under the ISC License.
