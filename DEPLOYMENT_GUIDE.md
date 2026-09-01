# Single-Link Unified Deployment Guide 🚀

The fullstack application (Backend API + Customer Frontend + Admin Dashboard) has been unified to run and serve from **a single unified link / domain**!

---

## 🌟 Local Unified Link
Your unified server is running at:
- **Main App & Menu**: [http://localhost:4000/](http://localhost:4000/)
- **Admin Dashboard**: [http://localhost:4000/admin](http://localhost:4000/admin) (or standalone portal at `/admin-portal`)
- **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)

---

## 🌐 Deploy to a Public Online Link (Free & 1-Click)

### Option 1: Deploy on Render (Recommended - Free Web Service)
1. Push this repository to **GitHub**.
2. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
5. Add your Environment Variables in the **Environment** tab:
   - `MONGODB_URI` = Your MongoDB Atlas Connection String
   - `JWT_SECRET` = Your JWT Secret Key
   - `CLOUDINARY_NAME` = Your Cloudinary Name
   - `CLOUDINARY_API_KEY` = Your Cloudinary API Key
   - `CLOUDINARY_SECRET_KEY` = Your Cloudinary Secret Key
6. Click **Deploy Web Service**. You will receive your single live URL (e.g., `https://yummyfood-app.onrender.com`).

---

### Option 2: Deploy on Railway
1. Go to [railway.app](https://railway.app/) and create a **New Project > Deploy from GitHub repo**.
2. Railway will automatically detect the root `package.json` and build the fullstack app.
3. In the project settings, add the environment variables (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`).
4. Generate a public domain under **Settings > Networking > Generate Domain**.

---

### Option 3: Deploy with Docker
Run the following commands in the root directory:
```bash
docker build -t yummyfood-app .
docker run -p 4000:4000 --env-file Backend/.env yummyfood-app
```
Then access the single link at `http://localhost:4000/` or on your cloud VPS IP.
