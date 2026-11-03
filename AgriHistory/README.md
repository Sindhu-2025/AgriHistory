# AgriHistory

AgriHistory is a full-stack field-history archive built with React, Express, MongoDB Atlas and Leaflet/OpenStreetMap. Farmers can save crop-season records linked to approximate field coordinates; visitors can explore public records. Farmers can keep individual records private.

## Features
- Farmer and visitor registration/login (bcrypt password hashing and JWT sessions)
- Farmer-only create, update and delete field histories
- Crop, season, year, location, soil, fertilizer, pest management, irrigation, yield and notes
- Public/private visibility and access checks
- Search and year filter, map pins, record detail pages
- Responsive landing page, dashboard and forms

## Languages, voice and images
- Switch between English, Telugu and Hindi with the language buttons (top right). The choice is remembered.
- All text lives in `client/src/i18n/translations.js`. To add a language, copy the `en` block, translate it, and add one line to `LANGUAGES`.
- Voice input: tap the mic beside a box (or the search box) and speak. It uses the browser's built-in speech recognition in the selected language, so use Chrome or Edge, and allow the microphone when asked. It works on `localhost` or HTTPS.
- Notes in any language: on the record form, choose the voice language (English / Telugu / Hindi) above the Notes box, then tap the mic. You can switch language between sentences, so one note can mix languages.
- Images: the landing page uses real photos (`hero.jpg`, `crop-paddy.jpg`, `crop-chilli.jpg`, `crop-cotton.jpg`, `auth.jpg`); other crops use drawn scenes in `client/public/images/`. To replace or add photos, put `.jpg` files in `client/public/images/` with the same names (also `crop-wheat.jpg`, `crop-sugarcane.jpg`, `crop-default.jpg`). Higher-resolution photos look sharper full-screen.

## Requirements
- Node.js 20.19+ (recommended) and npm
- MongoDB Atlas cluster or local MongoDB

## 1. Configure MongoDB
1. Create/choose a MongoDB Atlas database user and allow your development IP in Atlas Network Access.
2. Copy `server/.env.example` to `server/.env`.
3. Replace `MONGO_URI` with your Atlas connection string. Put the database name `agrihistory` before the query string if desired. URL-encode special characters in the database password.
4. Set `JWT_SECRET` to a long random secret. Never commit `.env` or share it.

## 2. Start backend (Terminal 1)
```powershell
cd E:\agriculture\AgriHistory\server
npm install
npm run dev
```
Expected: `MongoDB Atlas connected successfully!` and `AgriHistory server running on port 5000`.

## 3. Start frontend (Terminal 2)
```powershell
cd E:\agriculture\AgriHistory\client
copy .env.example .env
npm install
npm run dev
```
Open the URL printed by Vite (normally http://localhost:5173). Keep both terminals running.

## API endpoints
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create farmer/visitor account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/records` | Public | List public records; signed-in users also see their own private records |
| GET | `/api/records/:id` | Signed in | Read public record or own private record |
| POST | `/api/records` | Signed in | Create field record (farmer/admin) |
| PUT | `/api/records/:id` | Owner/admin | Update record |
| DELETE | `/api/records/:id` | Owner/admin | Delete record |

## Production build
```bash
cd client && npm run build   # outputs client/dist
cd ../server && npm start
```
Set `VITE_API_URL` to your deployed API URL before building the client, and `CLIENT_URL` on the server to your deployed site URL.

## Notes
- The map uses OpenStreetMap tiles and needs an internet connection.
- Coordinates are approximate map pins, not land-title or cadastral boundaries.
- This starter does not provide land ownership verification, official soil testing, agronomic recommendations, image uploads, password reset, email verification or an admin-management screen.
- Register as a farmer to add records. Visitor accounts can browse public records. Admin role must be assigned securely by an administrator in the database; public registration cannot create an admin.
