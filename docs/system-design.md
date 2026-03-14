# Sliq
### Technical Documentation (MERN Stack)

---

# 1. Project Introduction

Modern software teams require efficient tools to manage tasks, track progress, collaborate in real time, and maintain transparency within projects. Traditional project management tools often lack flexibility, scalability, or real-time collaboration capabilities.

The **Sliq** project management platform is a full-stack web application developed using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** that enables teams to manage projects efficiently using a **Kanban-style workflow**, real-time collaboration, and comprehensive activity tracking.

The platform is designed to provide developers, teams, and organizations with an intuitive environment for **task planning, project tracking, and team collaboration**.

Key highlights of the system include:

- Secure authentication and authorization
- Workspace and project organization
- Drag-and-drop Kanban task boards
- Real-time collaboration using **Socket.io**
- Commenting system for discussions
- Task priority and due date management
- Notifications and activity tracking
- Analytics dashboard for productivity insights

The platform aims to replicate and simplify the functionality of modern project management systems like **Jira, Trello, and Linear** while maintaining scalability and performance.

---

# 2. Problem Statement

Managing complex software development projects requires efficient coordination among team members. Many teams struggle with issues such as:

- Lack of clear task tracking
- Poor communication between team members
- Difficulty monitoring project progress
- Lack of real-time updates
- Inefficient collaboration tools

Traditional tools often provide static project views that do not update in real time, making it difficult for teams to stay synchronized.

Additionally, many existing tools are overly complex or expensive for small teams and startups.

Therefore, there is a need for a **modern, scalable, real-time project management platform** that enables:

- Easy task management
- Clear visualization of project progress
- Real-time collaboration
- Transparent activity tracking

This project aims to solve these issues by building a **modern project management application inspired by Jira** using the MERN stack.

---

# 3. Objectives

The primary objectives of the system include:

### 1. Improve Project Organization
Allow teams to organize their work using **workspaces, projects, and tasks**.

### 2. Visual Task Management
Provide a **Kanban-style board** where tasks can move through different stages of completion.

### 3. Real-Time Collaboration
Enable instant updates across users using **Socket.io**.

### 4. Task Communication
Allow team members to communicate directly through **task comments**.

### 5. Transparency and Accountability
Maintain **activity logs** for every major action taken within the system.

### 6. Task Prioritization
Enable prioritization and due dates for efficient project planning.

### 7. Performance Insights
Provide analytics dashboards that display project productivity and progress.

---

# 4. System Architecture

The system follows a **three-tier architecture**.

## 1. Client Layer (Frontend)

The frontend is built using **React.js** and provides the user interface for interacting with the application.

Responsibilities include:

- Rendering UI components
- Managing application state
- Communicating with backend APIs
- Handling real-time events via Socket.io

Main technologies:

- React.js
- Redux / Context API
- Tailwind CSS / Material UI
- Socket.io Client

---

## 2. Application Layer (Backend)

The backend is developed using **Node.js and Express.js**.

Responsibilities include:

- Handling API requests
- Business logic implementation
- Authentication and authorization
- Database communication
- Real-time event broadcasting

Main technologies:

- Node.js
- Express.js
- JWT Authentication
- Socket.io Server

---

## 3. Data Layer (Database)

The system uses **MongoDB** as the primary database.

Responsibilities include:

- Storing application data
- Managing relationships between entities
- Efficient querying and indexing

Main technologies:

- MongoDB
- Mongoose ODM

---

# 5. Technology Stack

| Layer | Technology |
|------|-------------|
| Frontend | React.js |
| Backend | Node.js |
| Server Framework | Express.js |
| Database | MongoDB |
| Real-Time Communication | Socket.io |
| Authentication | JWT |
| Styling | Tailwind CSS |
| API Testing | Postman |
| Deployment | Docker / Cloud Hosting |
| Version Control | Git + GitHub |

---

# 6. Database Design

The platform includes several core collections.

### 1. Users Collection

Stores information about registered users.

Fields:

- userId
- name
- email
- password (hashed)
- role
- createdAt

---

### 2. Workspaces Collection

Represents organizational workspaces.

Fields:

- workspaceId
- workspaceName
- ownerId
- members
- createdAt

---

### 3. Projects Collection

Each workspace can contain multiple projects.

Fields:

- projectId
- projectName
- description
- workspaceId
- createdBy
- createdAt

---

### 4. Tasks Collection

Stores tasks belonging to projects.

Fields:

- taskId
- title
- description
- status
- priority
- dueDate
- assignedTo
- projectId
- comments
- createdAt

---

### 5. Comments Collection

Stores task discussions.

Fields:

- commentId
- taskId
- userId
- message
- createdAt

---

### 6. Notifications Collection

Tracks system notifications.

Fields:

- notificationId
- userId
- message
- readStatus
- createdAt

---

### 7. Activity Logs Collection

Stores system activity history.

Fields:

- activityId
- userId
- action
- entityType
- entityId
- timestamp

---

# 7. API Documentation

The backend exposes RESTful APIs.

---

## Authentication APIs

| Method | Endpoint | Description |
|------|-----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Fetch user profile |

---

## Workspace APIs

| Method | Endpoint |
|------|-----------|
| POST | /api/workspaces |
| GET | /api/workspaces |
| PUT | /api/workspaces/:id |
| DELETE | /api/workspaces/:id |

---

## Project APIs

| Method | Endpoint |
|------|-----------|
| POST | /api/projects |
| GET | /api/projects |
| PUT | /api/projects/:id |
| DELETE | /api/projects/:id |

---

## Task APIs

| Method | Endpoint |
|------|-----------|
| POST | /api/tasks |
| GET | /api/tasks |
| PUT | /api/tasks/:id |
| DELETE | /api/tasks/:id |

---

## Comment APIs

| Method | Endpoint |
|------|-----------|
| POST | /api/comments |
| GET | /api/comments/:taskId |

---

# 8. Feature Explanation

## Authentication System

Users can securely create accounts and log into the platform using **JWT-based authentication**.

---

## Workspace Management

Workspaces allow organizations to separate projects based on teams or departments.

---

## Project Management

Each workspace can contain multiple projects with separate Kanban boards.

---

## Kanban Task Board

Tasks are visually organized into columns such as:

- To Do
- In Progress
- Review
- Done

Users can drag tasks between columns.

---

## Task Comments

Each task includes a discussion thread where team members can collaborate.

---

## Priority Levels

Tasks can be assigned priority levels:

- Low
- Medium
- High
- Critical

---

## Due Dates

Tasks include deadlines to help track progress and ensure timely completion.

---

## Real-Time Collaboration

Socket.io enables instant updates across all connected users when:

- Tasks move
- Comments are added
- Projects update

---

## Notification System

Users receive notifications when:

- Assigned tasks change
- Comments are added
- Deadlines approach

---

## Analytics Dashboard

The analytics dashboard provides insights such as:

- Completed tasks
- Pending tasks
- Team productivity
- Project progress

---

## Activity Timeline

The system logs actions such as:

- Task creation
- Task updates
- Task movement
- Comment creation

This creates a **transparent audit trail**.

---

# 9. System Workflow

1. User registers or logs in.
2. User creates or joins a workspace.
3. Workspace owner creates projects.
4. Projects contain tasks displayed in Kanban boards.
5. Users move tasks through workflow stages.
6. Team members communicate via comments.
7. System logs activities automatically.
8. Notifications keep users updated.
9. Analytics dashboard tracks progress.

---

# 10. Security Implementation

Security is implemented using several mechanisms.

### Password Encryption
Passwords are hashed using **bcrypt** before storage.

### JWT Authentication
Users receive a **JWT token** after login to access protected routes.

### Role-Based Access Control
Different roles control permissions within workspaces.

### Secure API Routes
Middleware verifies tokens before granting access.

### Data Validation
Input validation prevents injection attacks.

---

# 11. Deployment Architecture

The platform can be deployed using cloud infrastructure.

Typical deployment architecture includes:

Frontend  
React application hosted on **Vercel or Netlify**

Backend  
Node.js server deployed on **Render, AWS, or DigitalOcean**

Database  
MongoDB hosted using **MongoDB Atlas**

Real-Time Layer  
Socket.io server integrated within the Node.js backend.

---

# 12. Future Enhancements

Potential future improvements include:

- Mobile application support
- AI-based task recommendations
- Time tracking features
- Gantt chart project views
- Integration with GitHub and Slack
- Advanced reporting and analytics
- File attachments in tasks
- Video collaboration tools

---

# 13. Conclusion

The **Sliq** project management platform provides a scalable, efficient, and collaborative solution for managing software development projects.

By combining the power of the **MERN stack with real-time communication technologies**, the system offers an intuitive environment for teams to organize tasks, communicate effectively, and monitor project progress.

The modular architecture ensures scalability, making the platform suitable for both small teams and large organizations.

This project demonstrates the practical implementation of modern full-stack development techniques and real-time web technologies.