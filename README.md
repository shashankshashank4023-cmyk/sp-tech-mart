# SP Computers

A React/Vite storefront and Spring Boot 3 API for an Indian computer hardware and custom PC store.

## Frontend preview

The Vite development preview runs at http://localhost:5173 while its dev server is running. Start it from the repository root with `pnpm install` and `pnpm dev`.

## Backend setup

Requirements: Java 17+, Maven 3.9+, and MySQL 8. The API listens at http://localhost:8080/api. Set the environment variables listed in `backend/.env.example`, create a MySQL user/database if needed, then run:

```powershell
cd backend
mvn spring-boot:run
```

The API uses `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` (at least 32 characters), `JWT_EXPIRATION_MS`, `CORS_ALLOWED_ORIGINS`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

`ADMIN_EMAIL` and `ADMIN_PASSWORD` seed an administrator on startup when both are provided; the password must be at least 12 characters. Leave Razorpay values empty to run the catalog, cart, and account API without checkout. Set real Razorpay credentials to activate checkout. Configure production secrets through your deployment secret manager and set `DDL_AUTO=validate` after applying managed schema migrations; local default is `update`.

The backend creates customers and carts on registration. Product prices and totals are calculated from database values. Stock is deducted only after Razorpay signature verification and restored when an eligible order is cancelled. Product deletion is a soft delete so historical order items remain readable.

## Store API routes

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/products` with category, brand, minPrice, maxPrice, inStock and pagination filters; `GET /api/products/{id}`
- `GET /api/cart`, `POST /api/cart/add`, `DELETE /api/cart/remove/{itemId}`
- `POST /api/orders/checkout`, `GET /api/orders/my-orders`, `POST /api/payments/verify`
- Admin product CRUD and stock at `/api/admin/products`; order management at `/api/admin/orders`; revenue at `/api/admin/analytics/revenue`

Frontend API base URL defaults to `http://localhost:8080/api`. Override with `VITE_API_URL` (see `.env.example`). Sample catalog data keeps the storefront preview usable while the API is offline.

## Deploy to Render

The repository includes `render.yaml` and `backend/Dockerfile` for a Render Blueprint deployment. Push this repository to GitHub, then in Render choose **New > Blueprint** and connect the `sp-tech-mart` repository. The Blueprint creates a static storefront, Spring Boot API, and MySQL 8 private service with a persistent disk. The MySQL service uses Render's MySQL template and its standard plan is paid.

At Blueprint creation, provide Razorpay test credentials when prompted. The API service uses the names `sp-computers-api` and `sp-computers-store`; if Render assigns different `onrender.com` URLs due to a naming conflict, update `VITE_API_URL` on the static site and `CORS_ALLOWED_ORIGINS` on the API to match the actual service URLs, then redeploy. Never add real credentials to this repository.
