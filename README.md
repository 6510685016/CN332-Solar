นี่คือไฟล์ `README.md` ที่อัปเดตให้ตรงกับโครงสร้างที่แสดงในภาพ:  

```md
# 🚀 Vite + Express + MongoDB Starter

This project is a full-stack web application built with **Vite (React)** for the frontend, **Express.js** for the backend, and **MongoDB (Mongoose)** as the database.

## 📌 Features

✅ Fast development with **Vite**  
✅ REST API with **Express.js**  
✅ NoSQL database using **MongoDB** with **Mongoose**  
✅ Environment variables using **dotenv**  
✅ CORS enabled for frontend-backend communication  
✅ Hot reloading with **nodemon**  

---

## ⚙️ Project Structure

```
my-project/
│── app/              # React frontend (Vite)
│   ├── src/          # React source code
│   ├── index.html    # Main HTML file
│   ├── vite.config.js # Vite configuration
│   ├── package.json  # Frontend dependencies
│── backend/          # Express.js backend
│   ├── models/       # Mongoose models
│   ├── routes/       # Express routes
│   ├── server.js     # Main Express server file
│   ├── .env          # Environment variables
│   ├── package.json  # Backend dependencies
│── public/           # Static files (if any)
│── README.md         # Project documentation
│── .gitignore        # Git ignore file
└── .env.example      # Example environment variables
```

---

## 🛠️ Setup & Installation

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2️⃣ **Setup Backend (Express + MongoDB)**
```sh
cd backend
npm install
```

#### Example `.env` file:
```
MONGO_URI=mongodb://localhost:27017/mydatabase
PORT=5000
```

Start the backend server:
```sh
npm run dev  # Uses nodemon
```
API will be available at `http://localhost:5000`

---

### 3️⃣ **Setup Frontend (Vite + React)**
```sh
cd app
npm install
```
Start the frontend development server:
```sh
npm run dev
```
The app will run at `http://localhost:5173`

---

## 🔥 API Endpoints

| Method | Endpoint   | Description |
|--------|-----------|-------------|
| GET    | `/users`  | Get all users |
| POST   | `/users`  | Create a new user |

Example request to create a user:
```sh
curl -X POST http://localhost:5000/users -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com", "age": 25}'
```

---

## 📜 Contribution Guide

1. **Fork the repository**  
2. **Create a new branch** (`git checkout -b feature-branch`)  
3. **Commit your changes** (`git commit -m "Add new feature"`)  
4. **Push to branch** (`git push origin feature-branch`)  
5. **Open a Pull Request**  

---

## 🛠️ Troubleshooting

- **MongoDB not running?** Start MongoDB manually:
  ```sh
  mongod --dbpath /path/to/db
  ```
  or use Docker:
  ```sh
  docker run --name mongo-container -d -p 27017:27017 mongo
  ```

- **Port conflict?** Change the port in `.env` file.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

🚀 Happy Coding! 🎉
```