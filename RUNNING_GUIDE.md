# 🏁 Quick Start Guide: Running Sliq

This guide is designed for anyone who wants to get the **Sliq** project up and running on their local machine without getting bogged down in complex technical details.

---

## 🏗️ 1. Theoretical Setup (Prerequisites)

Make sure you have these two things installed on your computer:
*   **Node.js**: [Download here](https://nodejs.org/) (Choose the "LTS" version).
*   **MongoDB Atlas**: A free database. [Setup a cluster here](https://www.mongodb.com/cloud/atlas/register) and get your "Connection String".

---

## 🚀 2. Setting Up the Project

### A. Download the Code
If you haven't already, download or clone the repository and open it in your favorite code editor (like VS Code).

### B. Start the Backend (The Brain)
1.  Open a terminal inside the `server` folder.
2.  Run `npm install` to download all the necessary tools.
3.  Create a file named `.env` and paste this inside:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=anything_random_123
    ```
4.  Run `npm run dev`. You should see: `📡 Server running on port 5001`.

### C. Start the Frontend (The Visuals)
1.  Open a **new** terminal window inside the `client` folder.
2.  Run `npm install`.
3.  Create a file named `.env` and paste this inside:
    ```env
    VITE_API_BASE_URL=http://localhost:5001
    ```
4.  Run `npm run dev`.
5.  Click the link in the terminal (usually `http://localhost:5173`) to open the app in your browser!

---

## 🕹️ 3. How to Actually Use Sliq

Once you're in, follow this sequence to experience the full power of Sliq:

### Step 1: Create your Identity
*   Click **Sign Up** and create an account.
*   Once logged in, you'll be on the **Dashboard**.

### Step 2: Create a Workspace
*   Think of a **Workspace** as your "Company" or "Department" (e.g., "Engineering Team" or "Marketing Dept").
*   Click the **"+"** button to create one.

### Step 3: Start a Project
*   Inside your Workspace, click **Create Project**.
*   Give it a name (e.g., "Q1 Website Launch") and a description.

### Step 4: The Kanban Magic (Task Management)
*   Open your project to see the **Kanban Board**.
*   **Add Tasks**: Click "Add Task" in the first column.
*   **Assign & Detail**: Click on any task to add descriptions or comments.
*   **Drag & Drop**: Move tasks from "To Do" $\rightarrow$ "In Progress" $\rightarrow$ "Done" as you work.
*   *Watch the real-time updates!* (If you have two browsers open, you'll see it move in both).

### Step 5: Check Progress
*   Navigate to the **Analytics** page (Chart icon) to see a visual breakdown of your task distribution and progress.

---

## 👥 User Roles & Permissions

Sliq features a robust role-based access control system. Here is what each role can do:

| Role | Permissions |
| :--- | :--- |
| **Admin** | Full control. Can create/delete workspaces, projects, and manage all users. |
| **Project Manager** | Can create and delete projects within their workspaces. Can manage tasks and invite members. |
| **Developer** | Can create, update, and move tasks. Cannot delete projects or manage workspace settings. |
| **Viewer** | Read-only access. Can see boards and analytics but cannot make changes. |

---

## 🛠️ Common Fixes

*   **White Screen?**: Check if your `client/.env` has the correct `VITE_API_BASE_URL`.
*   **Can't Login?**: Make sure your `server/.env` has a valid `MONGO_URI` and that your database is reachable.
*   **Real-time not working?**: Ensure both the server and client are running and the `VITE_API_BASE_URL` doesn't end with a slash `/`.

---

> [!TIP]
> **Pro Tip**: To invite a teammate, they must first sign up for an account. Then, go to your Workspace settings and invite them using their email address!
