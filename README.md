# 🛍️ ShopNest — Full-Stack MERN E-Commerce

A production-ready e-commerce application built with the MERN stack (MongoDB, Express.js, React + Vite, Node.js), styled with Tailwind CSS, and powered by Redux Toolkit.

---

## ✨ Features

### User Panel
- JWT-based registration & login
- Homepage with featured products & category browsing
- Product listing with search, filters (category, price, rating), sorting & pagination
- Product detail page with image gallery, reviews & ratings
- Add to cart with quantity management
- Full checkout flow (shipping → payment method → review → place order)
- Order history & order tracking with status timeline
- User profile management (personal info, address, password)
- Wishlist functionality
- Dark mode toggle

### Admin Panel
- Dashboard with revenue chart, order stats, and key metrics
- Full product CRUD (create, edit, delete with image upload)
- Order management with inline status updates
- User management (role assignment, deletion)

### Technical Highlights
- Role-based auth (admin / user) with protected routes
- Redux Toolkit for global state management
- Responsive mobile-first design
- Toast notifications & loading spinners
- Cloudinary image uploads (or URL-based fallback)
- Stripe / Razorpay / COD payment options

---

## 🗂️ Project Structure

```
shopNest/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # Spinner, StarRating, Pagination, PrivateRoute
│   │   │   ├── layout/      # Navbar, Footer, Layout, AdminLayout
│   │   │   └── product/     # ProductCard
│   │   ├── pages/
│   │   │   ├── auth/        # LoginPage, RegisterPage
│   │   │   ├── user/        # Cart, Checkout, Orders, Profile, Wishlist
│   │   │   └── admin/       # Dashboard, Products, Orders, Users
│   │   ├── slices/          # Redux slices (auth, cart, products, orders, ui)
│   │   ├── services/        # Axios API instance
│   │   ├── App.jsx          # Routes
│   │   └── main.jsx         # Entry point
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                  # Node + Express API
    ├── config/
    │   ├── db.js            # MongoDB connection
    │   └── cloudinary.js    # Cloudinary config
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   ├── orderController.js
    │   └── userController.js
    ├── middleware/
    │   ├── authMiddleware.js # JWT + role guards
    │   └── errorMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   └── Order.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── orderRoutes.js
    │   └── userRoutes.js
    ├── utils/
    │   ├── generateToken.js
    │   └── seeder.js        # Sample data seeder
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local) **or** MongoDB Atlas (cloud)
- Git

---

### 1. Clone & Install

```bash
git clone https://github.com/yourname/shopNest.git
cd shopNEST

# Install all dependencies at once
npm install && cd server && npm install && cd ../client && npm install && cd ..
```

---

### 2. Configure Environment Variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
NODE_ENV=development
PORT=5000

# MongoDB — choose one:
MONGO_URI=mongodb://localhost:27017/ecommerce
# MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce

JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=30d

# Cloudinary (optional — can use image URLs instead)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...

CLIENT_URL=http://localhost:5173
```

---

### 3. Seed Sample Data

```bash
cd server
npm run seed
```

This creates:
| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| Admin | admin@shopNEST.com       | admin123  |
| User  | john@example.com         | user123   |
| User  | jane@example.com         | user123   |

And 12 sample products across categories.

To destroy seeded data:
```bash
node utils/seeder.js -d
```

---

### 4. Run the App

**Option A — Run both together (from root):**
```bash
npm run dev
```

**Option B — Run separately:**
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

| Service   | URL                         |
|-----------|-----------------------------|
| Frontend  | http://localhost:5173        |
| API       | http://localhost:5000/api    |
| Health    | http://localhost:5000/api/health |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint            | Access  | Description        |
|--------|---------------------|---------|--------------------|
| POST   | /api/auth/register  | Public  | Register new user  |
| POST   | /api/auth/login     | Public  | Login              |
| POST   | /api/auth/logout    | Private | Logout             |
| GET    | /api/auth/me        | Private | Get current user   |

### Products
| Method | Endpoint                     | Access  | Description              |
|--------|------------------------------|---------|--------------------------|
| GET    | /api/products                | Public  | List with filters & pages|
| GET    | /api/products/featured       | Public  | Featured products        |
| GET    | /api/products/categories     | Public  | All categories           |
| GET    | /api/products/:id            | Public  | Single product           |
| POST   | /api/products                | Admin   | Create product           |
| PUT    | /api/products/:id            | Admin   | Update product           |
| DELETE | /api/products/:id            | Admin   | Delete product           |
| POST   | /api/products/:id/reviews    | Private | Add review               |

### Orders
| Method | Endpoint                  | Access  | Description          |
|--------|---------------------------|---------|----------------------|
| POST   | /api/orders               | Private | Place order          |
| GET    | /api/orders/myorders      | Private | User's orders        |
| GET    | /api/orders/analytics     | Admin   | Dashboard analytics  |
| GET    | /api/orders               | Admin   | All orders           |
| GET    | /api/orders/:id           | Private | Single order         |
| PUT    | /api/orders/:id/pay       | Private | Mark as paid         |
| PUT    | /api/orders/:id/status    | Admin   | Update status        |

### Users
| Method | Endpoint                      | Access  | Description          |
|--------|-------------------------------|---------|----------------------|
| PUT    | /api/users/profile            | Private | Update profile       |
| POST   | /api/users/wishlist/:id       | Private | Toggle wishlist      |
| GET    | /api/users                    | Admin   | All users            |
| GET    | /api/users/:id                | Admin   | Single user          |
| PUT    | /api/users/:id                | Admin   | Update role          |
| DELETE | /api/users/:id                | Admin   | Delete user          |

---

## 🔧 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Redux Toolkit |
| Routing    | React Router v6                         |
| HTTP       | Axios                                   |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB, Mongoose                       |
| Auth       | JWT, bcryptjs                           |
| Images     | Cloudinary (or URL fallback)            |
| Payments   | Stripe, Razorpay, COD                   |
| Toasts     | react-hot-toast                         |
| Icons      | react-icons (Feather)                   |

---

## 🎨 UI Overview

- **Design system**: Custom Tailwind config with `primary` (orange) palette + dark mode
- **Fonts**: Sora (display) + Plus Jakarta Sans (body)
- **Components**: Product cards with hover effects, animated modals, step-based checkout
- **Responsive**: Mobile-first, works from 320px to 4K

---

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT stored in localStorage + HTTP-only cookie
- Role-based route guards on both frontend and backend
- Input validation via Mongoose schemas
- CORS configured for specific origin

---

## 📦 Build for Production

```bash
# Build frontend
cd client && npm run build

# The dist/ folder can be served via Nginx or a CDN.
# Set NODE_ENV=production in server/.env before deploying.
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| `MongoServerError: ECONNREFUSED` | Start MongoDB: `mongod` or use Atlas |
| Cloudinary upload fails | Add `.env.example` keys or use image URL field |
| Port 5000 in use | Change `PORT` in `server/.env` |
| CORS error | Ensure `CLIENT_URL` matches your Vite port |

---

## 📄 License

MIT — free to use for personal and commercial projects.
