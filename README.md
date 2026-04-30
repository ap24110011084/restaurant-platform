# 🍽️ Restaurant Reservation & Management System

A full-stack web application developed using the MERN stack to manage restaurant operations such as table reservations, waitlist handling, user management, and analytics. This system helps automate manual processes and improves efficiency in restaurant management.

---

## 🚀 Features

### 👤 Customer
- User Registration & Login
- Book a table online
- View and cancel reservations
- Join waitlist when tables are unavailable

### 🧑‍💼 Admin
- Dashboard with analytics
- Manage users (Add/Edit/Delete)
- Manage tables (availability, capacity)
- View and control reservations
- Monitor waitlist

### 👨‍🍳 Staff
- View reservations
- Update table status (available/occupied)
- Manage daily customer flow

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- bcrypt (Password Hashing)

---

## 📁 Project Structure
restaurant-platform/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ ├── seed.js
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── context/
│ │ ├── layouts/
│ │ ├── pages/
│ │ └── utils/
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css

🔐 Authentication
JWT-based authentication
Secure login system
Role-based access control:
Admin
Staff
Customer

📊 Core Modules
User Management
Table Management
Reservation System
Waitlist Management
Dashboard & Analytics
POS (Point of Sale - Optional)

🔄 Project Workflow
User logs in via frontend
Frontend sends API request to backend
Backend validates request using middleware
Controller processes logic
Data stored/retrieved from MongoDB
Response sent back to frontend
UI updates dynamically

📌 Future Enhancements
Online payment integration
Email/SMS notifications
Cloud deployment (Render/AWS)
Multi-branch support
AI-based table prediction

👥 Team Members
Yarramsetti u s k siddarda
perla vijay
odugu venkata ajay
kovassi madhu sandeep
payavula shanmukh siddarth

📜 License
This project is developed for academic purposes only.

⭐ Acknowledgment
This project was developed as part of a Full Stack project to demonstrate real-world application of the MERN stack.
