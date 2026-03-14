# Deployment Guide: Sliq Project Management

This guide outlines the steps to deploy the **Sliq** project: the backend on **Render** and the frontend on **Vercel**.

---

## 1. Prepare Backend for Render

### A. Add a Root `package.json` (Optional but Recommended)
Render needs to know where your backend lies. If you haven't already, you can create a `package.json` in the root of your project to manage both. Alternatively, you can point Render directly to the `server` folder.

### B. Deployment Steps on Render
1.  Connect your GitHub repository to [Render](https://render.com/).
2.  Select **New** > **Web Service**.
3.  Choose your repository.
4.  Configure the service:
    *   **Name**: `sliq-api`
    *   **Environment**: `Node`
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5.  **Environment Variables**:
    Click on **Advanced** > **Add Environment Variable**:
    *   `MONGO_URI`: `your_atlas_connection_string`
    *   `JWT_SECRET`: `your_secret_key`
    *   `PORT`: `5001` (Render usually provides its own PORT, but setting this is fine)
6.  Click **Create Web Service**.

---

## 2. Prepare Frontend for Vercel

### A. Environment Configuration
Update your API service to use environment variables for the baseURL.

### B. Deployment Steps on Vercel
1.  Connect your GitHub repository to [Vercel](https://vercel.com/).
2.  Click **Add New** > **Project**.
3.  Select your repository.
4.  Configure the build settings:
    *   **Framework Preset**: `Vite` (Detected automatically)
    *   **Root Directory**: `client`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
5.  **Environment Variables**:
    Expand the **Environment Variables** section and add:
    *   `VITE_API_BASE_URL`: `https://sliq-wgrq.onrender.com`
6.  Click **Deploy**.

---

## 3. Post-Deployment Checks

### A. CORS Configuration
In production, your backend needs to allow requests from your Vercel domain.
In `server/server.js`, you can tighten the CORS settings:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.vercel.app',
  credentials: true
}));
```

### B. Socket.io
Ensure that the `VITE_API_BASE_URL` in your Vercel settings **does not** end with `/api`, as Socket.io connects to the root domain.

### C. Verify Connection
1.  Open your Vercel URL.
2.  Try signing up/logging in.
3.  Check the "Network" tab in your browser console to ensure requests are going to the Render URL.

---

> [!IMPORTANT]
> Always ensure that your MongoDB Atlas cluster allows connections from Render's IP addresses (set to `0.0.0.0/0` in Atlas Network Access for the most seamless experience).
