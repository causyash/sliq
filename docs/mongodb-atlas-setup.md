# MongoDB Atlas Setup Guide

This guide provides step-by-step instructions on how to set up and integrate MongoDB Atlas (Cloud Database) with the project.

---

## 1. Create a MongoDB Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click on **Try Free** and sign up using your email or Google account.
3. Once logged in, follow the setup wizard to create your organization and project.

## 2. Deploy a Free Cluster
1. Click **Create** to deploy a new cluster.
2. Select the **Shared** (Free) tier.
3. Choose a provider (e.g., AWS) and a region close to you (e.g., N. Virginia `us-east-1` or Mumbai `ap-south-1`).
4. Click **Create Cluster**.

## 3. Configure Database Access
1. In the left sidebar, navigate to **Security** > **Database Access**.
2. Click **+ Add New Database User**.
3. Select **Password** as the authentication method.
4. Enter a **Username** (e.g., `dbAdmin`) and a secure **Password**.
5. Under **Database User Privileges**, select **Read and write to any database**.
6. Click **Add User**.

## 4. Configure Network Access
1. In the left sidebar, navigate to **Security** > **Network Access**.
2. Click **+ Add IP Address**.
3. To allow access from anywhere (recommended for development), click **Allow Access From Anywhere** (`0.0.0.0/0`).
    - *Note: For production, you should only add your server's specific IP.*
4. Click **Confirm**.

## 5. Get Your Connection String
1. Go to **Database** (formerly Clusters) in the left sidebar.
2. Click the **Connect** button on your cluster.
3. Choose **Connect your application**.
4. Select **Node.js** as the driver and the latest version.
5. Copy the connection string. It should look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

## 6. Update Project Environment Variables
1. Open the `.env` file in your `server/` directory.
2. Replace the local `MONGO_URI` with your Atlas connection string.
3. Replace `<username>` with your database username.
4. Replace `<password>` with your database user's password.
5. Update the database name (optional) by adding it before the `?`:
   `mongodb+srv://dbAdmin:SecurePass123@cluster0.xxxxx.mongodb.net/project-management?retryWrites=true&w=majority`

### Correct .env Configuration:
```env
PORT=5000
MONGO_URI=mongodb+srv://dbAdmin:SecurePass123@cluster0.xxxxx.mongodb.net/project-management?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

## 7. Verify Connection
1. Restart your backend server:
   ```bash
   cd server
   npm run dev
   ```
2. Check the console. You should see:
   `MongoDB Connected`

---

> [!IMPORTANT]
> Never commit your actual `.env` file to version control (GitHub). Always use `.env.example` as a template and keep your `.env` private to protect your database credentials.
