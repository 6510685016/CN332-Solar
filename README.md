## Installation
### Prerequisites
- Node.js (LTS version)
- MongoDB
- Docker (optional)

### Backend Setup
```sh
cd backend
npm install
npm install express mongoose dotenv bcryptjs jsonwebtoken passport passport-google-oauth20 cookie-session cors

```
Create a `.env` file inside `backend` and add:
```
MONGO_URI=mongodb://localhost:27017/mydatabase
PORT=5000
```
Run the backend server:
```sh
npm start
```

### Frontend Setup
```sh
cd frontend
npm install
npm install @react-oauth/google

```
Run the frontend server:
```sh
npm start
```

## API Endpoints
### User Routes
- `GET /users` - Get all users
- `POST /users` - Create a new user

