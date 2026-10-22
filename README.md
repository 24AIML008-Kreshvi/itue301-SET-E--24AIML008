# DriveEasy Car Rental System — Set E

ITUE301 Advanced Web Development Frameworks project.

Stack: React + Vite, Express.js, MongoDB with Mongoose.

## Setup

1. Start MongoDB locally.
2. In `backend`, copy `.env.example` to `.env` and configure `MONGO_URI`, `PORT`, and a private `JWT_SECRET`.
3. Run `cd backend`, `npm install`, `npm run seed`, and `npm start`.
4. In another terminal run `cd frontend`, `npm install`, and `npm run dev`.
5. Open the frontend URL shown by Vite.

Demo account: `customer@driveeasy.test` / `Demo@12345` (local development only).

Endpoints: POST `/api/v1/auth/login`, GET `/api/v1/vehicles`, POST `/api/v1/bookings`, GET `/api/v1/bookings/my`, PATCH `/api/v1/bookings/:id/status`.

Never commit `.env` or `node_modules`.
