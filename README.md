# SP Computers

SP Tech Mart is an Indian computer hardware and custom PC store, built with a React/Vite storefront and a Spring Boot 3 REST API.

## Explore the live store

Visit [SP Tech Mart](https://sp-tech-mart-store.onrender.com/) to browse the live storefront.

## Run the frontend locally

Requirements: Node.js and pnpm. From the repository root:

```bash
pnpm install
pnpm dev
```

The frontend is available at `http://localhost:5173`. It uses `VITE_API_URL` from the root `.env` file to find the API; the default is `http://localhost:8080/api`. The root `.env.example` is a reference file and is not loaded automatically by Vite.

## Run the backend locally

Requirements: Java 17+, Maven 3.9+, and MySQL 8 for the database-backed profile.

### Quick demo (H2, no MySQL required)

In a second terminal, start the API with its demo profile. This profile uses an in-memory H2 database and seeds sample products. Demo data is temporary and resets when the API stops.

```powershell
cd backend
$env:SPRING_PROFILES_ACTIVE = "demo"
mvn spring-boot:run
```

The API is available at `http://localhost:8080/api`. Razorpay credentials are optional; payment checkout requires valid `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` values.

### MySQL profile

Create a MySQL database and configure the variables documented in `backend/.env.example` in your shell or IDE run configuration before starting the API. Spring Boot does not load `.env.example` automatically. At minimum, set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and a random `JWT_SECRET` of at least 32 characters. The default allowed frontend origin is `http://localhost:5173`; set `CORS_ALLOWED_ORIGINS` if your frontend uses another origin.

`ADMIN_EMAIL` and `ADMIN_PASSWORD` are optional; when both are set, the application seeds an admin account. Use a password of at least 12 characters. Keep database, JWT, admin, and Razorpay secrets out of source control. For production, apply schema migrations and set `DDL_AUTO=validate` rather than relying on the local `update` setting.

## Store API routes

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/products` supports category, brand, minPrice, maxPrice, inStock, and pagination filters; `GET /api/products/{id}`
- `GET /api/cart`, `POST /api/cart/add`, `DELETE /api/cart/remove/{itemId}` (authentication required)
- `POST /api/orders/checkout`, `GET /api/orders/my-orders`, `POST /api/payments/verify` (authentication required)
- Admin product and stock management at `/api/admin/products`; order management at `/api/admin/orders`; revenue analytics at `/api/admin/analytics/revenue` (admin role required)

The backend calculates prices and totals from database values. Stock is deducted after Razorpay signature verification and restored when an eligible order is cancelled. Product deletion is a soft delete so historical order items remain readable.
