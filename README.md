# DriveEasy Car Rental System — ITUE301 Set E

A full-stack exam project with React + Vite frontend, Express REST API, MongoDB and Mongoose.

## Run on Windows

Start MongoDB Community Server. Copy `backend/.env.example` to `backend/.env`; set `MONGO_URI=mongodb://127.0.0.1:27017/driveeasy`, `PORT=5000`, and a private random `JWT_SECRET`.

In terminal 1:
```powershell
cd backend
npm install
npm run seed
npm start
```

In terminal 2:
```powershell
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173.

## Demo accounts (local only)

Customer: customer@driveeasy.test
Manager: manager@driveeasy.test
Admin: admin@driveeasy.test

Password for each: `Demo@12345`. Do not deploy with these credentials.

## React pages
- `/` Login
- `/fleet` Protected fleet, vehicle filtering, booking form
- `/my-bookings` Protected list and cancellation
- `/admin` Protected, lazy-loaded staff dashboard

## API
- POST `/api/v1/auth/login`: login, obtain JWT
- GET `/api/v1/vehicles`: public fleet
- POST `/api/v1/bookings`: authenticated booking (201)
- GET `/api/v1/bookings/my`: populated booking records
- PATCH `/api/v1/bookings/:id/status`: permitted status changes
- GET `/api/v1/admin/summary`: staff dashboard counts

For protected requests use header `Authorization: Bearer YOUR_TOKEN`.

Never commit `.env` or `node_modules`. For exam submission include the public repository link, final commit SHA and screenshots of FleetPage, the booking API returning 201, and MongoDB Compass booking records.
