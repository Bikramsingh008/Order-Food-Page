<div align="center">

  # 🍽️ YummyFood — Full-Stack Food Ordering Platform

  <p align="center">
    <strong>A high-performance, single-link full-stack food delivery web application built with modern React, Node.js, Express, and MongoDB.</strong>
  </p>

  <p align="center">
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-deployment">Deployment</a> •
    <a href="#-api-endpoints">API Reference</a> •
    <a href="#-project-structure">Architecture</a>
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/License-ISC-orange?style=for-the-badge" alt="License" />
  </p>

</div>

---

## 🌟 Highlights & Overview

**YummyFood** is an end-to-end food ordering platform that combines an **ultra-premium dark luxury UI** with robust backend order lifecycle management. It offers a seamless experience for foodies to explore delicious meals, customize ingredients, select half/full portions, and place orders with instant tracking.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   🌐 Single-Link Unified Deployment                    │
├────────────────────────┬───────────────────────┬───────────────────────┤
│   🍔 Customer Portal   │   📊 Admin Dashboard  │   ⚡ REST API Server  │
│      (React + Vite)    │     (Management UI)   │  (Express + MongoDB)  │
└────────────────────────┴───────────────────────┴───────────────────────┘
```

---

## ✨ Key Features

### 🛍️ Customer Experience
- **🎨 Ultra-Premium Dark Luxury UI**: Designed with obsidian glassmorphism, glowing amber accents, and responsive micro-interactions.
- **🎛️ Real-Time Ingredient Customization**: Add extra toppings, remove unwanted ingredients, and see live pricing recalculations.
- **⚖️ Smart Portion Sizing**: Choose between Half (with automatic 40% discount) and Full portions on eligible meals.
- **🔍 Instant Filtering & Search**: Filter by categories (*Breakfast, Lunch, Dinner, Snacks, Drinks*) and dietary preferences (*Pure Veg / Non-Veg*).
- **🛒 Persistent Shopping Cart**: State-managed cart synchronized with localStorage and dynamic checkout calculations.
- **📦 Order History & Live Tracking**: Real-time status updates (*Order Placed → Food Processing → Out for Delivery → Delivered*).
- **💳 Multi-Payment Support**: Cash on Delivery (COD) and Razorpay online payments.

### 🛡️ Admin Management Panel
- **📊 Interactive Analytics Dashboard**: Revenue summary, order volume, user statistics, and recent activity.
- **🍛 Food Menu CRUD**: Add, edit, or delete menu items with Cloudinary image uploads and custom ingredient builder.
- **🚚 Live Order Processing**: Update order statuses, view customer delivery addresses, and track payment states.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, React Toastify, React Icons, Slick Carousel |
| **Styling** | Vanilla CSS Design Tokens, Glassmorphism, Responsive CSS Grid & Flexbox |
| **Backend** | Node.js, Express 5, JWT (Authentication), Multer |
| **Database** | MongoDB with Mongoose ODM |
| **Cloud & Media** | Cloudinary (Image CDN), Razorpay (Payment Gateway) |
| **Deployment** | Unified Single-Link Express Server, Docker, Render Blueprint |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Bikramsingh008/Order-Food-Page.git
cd Order-Food-Page
```

### 2. Environment Configuration
Create a `.env` file inside the `Backend/` directory:

```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/yummyfood
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Install Dependencies
```bash
# Install all dependencies across Backend, Frontend, and Admin
npm run install:all
```

### 4. Run the Project

#### Option A: Unified Single-Link Mode (Recommended)
Build the frontend and run everything from a single URL (`http://localhost:4000`):
```bash
npm run build
npm start
```

#### Option B: Development Mode (Hot Reload)
Run each service in its own terminal:
```bash
# Terminal 1: Backend API (Port 4000)
cd Backend && npm run server

# Terminal 2: Customer Frontend (Port 5173)
cd FrontEnd && npm run dev

# Terminal 3: Admin Portal (Port 5174)
cd Admin && npm run dev
```

---

## 🌐 Single-Link Deployment

This repository is optimized for **1-Click Single-Link Hosting** on Render, Railway, or Docker without managing separate frontend and backend URLs.

### Deploying to Render (Free)
1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) &rarr; Click **New > Web Service**.
3. Select your repository and set:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add your Environment variables in the **Environment** tab.
5. Click **Deploy Web Service** to get your public URL (e.g., `https://yummyfood.onrender.com`).

---

## 📡 API Reference Overview

### User Routes (`/api/user`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/user/register` | Register a new user |
| `POST` | `/api/user/login` | Log in user and return JWT |
| `POST` | `/api/user/admin` | Admin authentication |
| `GET`  | `/api/user/profile` | Get current authenticated user profile |

### Product Routes (`/api/product`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/product/list` | Fetch all menu items |
| `GET`  | `/api/product/single/:id` | Fetch single food item details |
| `POST` | `/api/product/add` | Add new food product *(Admin)* |
| `POST` | `/api/product/remove` | Delete product *(Admin)* |

### Order Routes (`/api/order`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/order/place` | Place COD order |
| `POST` | `/api/order/razorpay` | Initiate Razorpay payment |
| `GET`  | `/api/order/userorders` | Fetch user's order history |
| `GET`  | `/api/order/list` | Fetch all orders *(Admin)* |
| `POST` | `/api/order/status` | Update order status *(Admin)* |

---

## 📁 Project Structure

```
Order-Food-Page/
├── Backend/                 # Express REST API & Database Models
│   ├── config/              # MongoDB & Cloudinary connectors
│   ├── controller/          # Route controller logic (User, Product, Order)
│   ├── middleware/          # Auth & file upload middlewares
│   ├── models/              # Mongoose database schemas
│   ├── routes/              # Express API route endpoints
│   └── server.js            # Express server & Single-Link SPA host
├── FrontEnd/                # Customer Web Application
│   ├── src/
│   │   ├── Components/      # UI components (FoodDetail, Cart, OurFood, etc.)
│   │   ├── utils/           # API config and helpers
│   │   └── App.jsx          # Root routing and application state
│   └── vite.config.js       # Vite configuration
├── Admin/                   # Dedicated Admin Dashboard
│   └── src/pages/           # Add item, Product List, Order management
├── Dockerfile               # Container deployment blueprint
├── render.yaml              # Render 1-click deployment config
├── DEPLOYMENT_GUIDE.md      # Detailed cloud hosting instructions
└── package.json             # Root unified build & start orchestration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Bikramsingh008">Bikramjit Singh</a></sub>
</div>
