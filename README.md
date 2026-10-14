# MENZPLAZA — The Right Fit. Every Time.

MENZPLAZA is a dedicated, production-ready e-commerce web application engineered exclusively for men's pants and trousers in India. Inspired by editorial menswear publications and modern D2C apparel ateliers, MENZPLAZA combines sartorial elegance with robust full-stack architecture, tailoring intelligence, and Indian e-commerce checkout flows.

---

## 👔 Brand Identity & Aesthetic

- **Brand Positioning:** *"The Right Fit. Every Time."*
- **Aesthetic Direction:** Editorial menswear atelier with generous whitespace, structured typography hierarchy, and purposeful interactions.
- **Color Palette:**
  - **Obsidian Black (`#171717`):** Primary branding, typography, deep framing
  - **Warm Ivory (`#F7F4EE` / `#FAF8F5`):** Editorial background canvas
  - **Sand Beige (`#D8C8B5`):** Warm accents, borders, and tactile surfaces
  - **Muted Olive (`#666B50`):** Sartorial tailoring badges, verification highlights
  - **Restrained Terracotta (`#C85A32`):** Promotional tags, discount badges, subtle accents
  - **White (`#FFFFFF`):** Product card backgrounds and crisp containers
- **Typography:**
  - Heading: *Playfair Display* (Editorial serif)
  - Body: *Inter* (Clean, legible sans-serif)

---

## 🚀 Key Features

### 1. Storefront Experience
- **Announcement Bar:** Dynamic banner communicating complimentary shipping on orders over ₹1,499 and promo codes.
- **Responsive Header & Mobile Nav:** Clean navigation across categories, quick search, wishlist counter, user dropdown, and a dedicated mobile bottom navigation bar.
- **Editorial Homepage:**
  - Hero banner with trouser category CTA and Fit Finder shortcut.
  - Curated Pant Silhouettes (Formal Pants, Chinos, Cargo, Jeans, Joggers, Linen Pants, Slim-Fit).
  - Trending styles with color swatches, discount badges, and quick add.
  - Interactive **MENZ FIT FINDER** sizing section.
  - Curated style collections (Boardroom, Smart Casuals, Resort Linen).
  - Genuine customer testimonials and newsletter subscription.

### 2. Product Discovery & Filtering
- Real-time search across pant names, fabric compositions, and categories.
- Multi-attribute filtering by category, leg silhouette (Slim, Tapered, Regular, Relaxed), waist size (28" to 40"), and price range.
- Multiple sorting options: Featured, Bestsellers, New Arrivals, Price Low-to-High, Price High-to-Low, and Rating.
- Shareable URL query state synchronization (`?category=chinos&fit=slim&waist=32`).
- Responsive slide-over filter drawer on mobile viewports.

### 3. Product Detail & Sizing
- High-resolution gallery with thumbnail switcher and hover zoom.
- Interactive Color swatches with real variant availability.
- Multi-dimensional variant selector: Waist size (28"-40") × Inseam length (30", 32", 34").
- Live stock availability indicator preventing out-of-stock selection.
- **Indian PIN Code Checker:** Serviceability validation for Indian postal codes (e.g., 560103, 110016, 400001) providing estimated delivery days and COD availability.
- **Interactive Size Chart Modal:** Measurements in inches/centimeters, waist-to-hip dimensions, and rise advice.
- Customer reviews with rating breakdown and verified purchase badges.
- Dynamic related products recommendation.

### 4. MENZ FIT FINDER (Tailoring Intelligence)
- Proprietary sizing tool taking height, waist measurement, wearing rise (low/mid/high), and leg silhouette preference.
- Calculates tailored waist size and inseam recommendations with sartorial explanations.
- Local browser calculation protecting customer biometric privacy.

### 5. Persistent Bag & Cart Drawer
- Slide-over drawer accessible throughout the store.
- **Free Shipping Progress Meter** showing amount needed to unlock complimentary express shipping.
- Quantity adjustment with real-time stock limits.
- Promotional coupon engine with instant savings feedback.

### 6. Checkout & Order Processing
- Supported address fields designed for India: Recipient Name, Mobile, Address Lines, Landmark, City, State, and 6-digit PIN code.
- Payment Methods: Cash on Delivery (COD) and Online Payment (Razorpay test mode verified).
- **Security & Integrity:**
  - Server recalculates prices, discounts, taxes, and shipping fees. Never trusts client totals.
  - Atomic database transactions with inventory decrement to prevent overselling.
  - Generation of unique tracking numbers and order IDs (e.g., `MZ-2026-XXXXX`).

### 7. Customer & Guest Management
- Customer Registration, Login, and Session management via HTTP-only secure JWT cookies.
- Customer Profile with saved delivery addresses.
- Order History with live status (`CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- One-click Order Cancellation for unfulfilled orders with automatic inventory restoration.
- Doorstep Size Exchange & Return request submission.
- **Secure Guest Order Tracker:** Prevents order data exposure by requiring Order Number + matching Email/Phone.

### 8. Protected Admin Operations Console
- Accessible at `/admin` (Protected with role-based server authentication `requireAdminUser()`).
- Executive dashboard with realized revenue, order counts, and low-stock alerts.
- Order status fulfillment (`CONFIRMED` &rarr; `SHIPPED` &rarr; `DELIVERED`) and courier tracking number assignment.
- Product Catalog management (Add new trousers, adjust prices, edit inventory, toggle featured/bestseller).
- Promotional coupon creation with discount types and minimum order thresholds.
- Return & Size Exchange moderation (Approve/Reject).
- Storefront policy configuration (Free shipping threshold, shipping fee, tax rate, banner text).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS with custom editorial brand tokens |
| **ORM & Database** | Prisma ORM with SQLite (`dev.db`, zero-config local run) |
| **Security & Auth** | `bcryptjs` (password hashing), `jose` (HS256 JWT tokens), HTTP-only cookies |
| **Validation** | Zod v4 for request and form payloads |
| **Icons** | Lucide React |

---

## ⚙️ Environment Variables

A `.env` file is configured in the project root:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="menzplaza-super-secure-production-jwt-key-2025-delhi"
PORT=3000
```

> **Note on Payment Gateway:** In development and sandbox mode, online orders process through a verified test flow generating test order/payment references (`order_test_...` / `pay_test_...`). To connect live Razorpay payments in production, add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your environment.

---

## 📦 Setup & Running Locally

### 1. Prerequisites
- Node.js v18.17+ or v20.x
- npm v9+

### 2. Install Dependencies
```bash
cd menzplaza
npm install
```

### 3. Initialize & Seed Database
```bash
npm run db:push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Start
```bash
npm run build
npm start
```

---

## 🔐 Default Access Credentials

### Administrator Account
- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email:** `admin@menzplaza.com`
- **Password:** `Admin@Menzplaza2025!`

### Sample Customer Account
- **URL:** [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
- **Email:** `rahul.sharma@example.com`
- **Password:** `Customer@123!`

### Active Promotional Coupons
- `WELCOME10`: 10% off (Min order ₹999, max discount ₹500)
- `MENZ500`: Flat ₹500 off on premium trousers over ₹2,999
- `FESTIVE20`: 20% discount on orders over ₹1,999 (max discount ₹1,000)

---

## 🧪 Verified Test Flows

The application has been verified against the acceptance criteria:
1. **Production Build:** Passes TypeScript compilation, ESLint, static page pre-rendering (35 routes), and code bundling with zero errors.
2. **Catalog & Search:** Category navigation, keyword search, fit filtering, and waist size filters function with URL sync.
3. **Cart & Free Shipping Meter:** Dynamic progress bar updates toward the ₹1,499 threshold; coupons apply and discount accurately.
4. **Atomic Checkout:** Stock decrements atomically in SQLite upon order placement. Server verifies prices, preventing browser price manipulation.
5. **Security & Authorization:** Non-admin users are strictly blocked from `/api/admin/*` routes with HTTP 403 Forbidden. Guest order tracking requires matching email or phone.
6. **Responsive Layout:** Tested across mobile (360px–390px), tablet (768px), and desktop viewports.
