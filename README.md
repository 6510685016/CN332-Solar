## Installation
### Prerequisites
- Node.js (LTS version)
- MongoDB
- Docker (optional)

### Backend Setup
```sh
cd backend
npm install

```
Create a `.env` file inside `backend` and add:
```
# MongoDB Connection URI
MONGO_URI=
PORT=5000

# JWT Secret Key (Used for Token Signing)
JWT_SECRET=your_super_secret_key

# Google OAuth Credentials (If Using Google Login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Session Secret Key
SESSION_SECRET=your_random_session_secret
```
Run the backend server:
```sh
node server.js
```

### Frontend Setup
```sh
cd frontend
npm install

```
Run the frontend server:
```sh
npm start
```

## API Endpoints
### User Routes
- `GET /users` - Get all users
- `POST /users` - Create a new user

