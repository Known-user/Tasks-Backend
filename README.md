# 📌 Task Management System – Backend

A secure and scalable **Task Management System Backend** built using **Node.js, TypeScript, Express, Prisma, and SQLite**.
This backend supports **JWT-based authentication**, **user-specific task management**, and **advanced querying features** such as pagination, filtering, and search.

---

## 🚀 Features

### 🔐 Authentication & Security
- User **Registration** and **Login**
- **JWT Authentication**
  - Access Token (short-lived)
  - Refresh Token (long-lived)
- Secure password hashing using **bcrypt**
- Protected routes using authentication middleware
- Token-based session handling

### 📝 Task Management
- Create, read, update, and delete tasks
- Toggle task completion status
- Tasks are **scoped per authenticated user**
- Accurate task statistics (total, completed, pending)

### 📄 Advanced Task Listing
- Pagination (`page`, `limit`)
- Filter by status (`completed`, `pending`)
- Case-insensitive search by title
- Consistent API responses

---

## 🛠 Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- SQLite
- JWT (jsonwebtoken)
- bcrypt

---

## 📁 Project Structure

```bash
src/
├── controllers/
│   ├── auth.controller.ts
│   └── task.controller.ts
├── routes/
│   ├── auth.routes.ts
│   └── task.routes.ts
├── middleware/
│   └── auth.middleware.ts
├── utils/
│   ├── prisma.ts
│   ├── jwt.ts
│   └── password.ts
├── app.ts
├── server.ts
prisma/
├── migrations/
├── schema.prisma
.env
tsconfig.json
package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

---

## 🧪 API Endpoints

### 🔑 Auth Routes

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login user |
| POST | /auth/refresh | Refresh access token |
| POST | /auth/logout | Logout user |

---

### 🗂 Task Routes (Protected)

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /tasks | Create a new task |
| GET | /tasks | Get tasks (pagination, filter, search) |
| GET | /tasks/stats | Get task statistics |
| PATCH | /tasks/:id | Update task |
| PATCH | /tasks/:id/toggle | Toggle task completion |
| DELETE | /tasks/:id | Delete task |

#### Query Parameters for GET /tasks
```
?page=1&limit=10
?status=completed | pending
?search=keyword
```

---

## ▶️ Running the Project Locally

1️⃣ Install dependencies
```bash
npm install
```

2️⃣ Generate Prisma Client
```bash
npx prisma generate
```

3️⃣ Run database migrations
```bash
npx prisma migrate dev
```

4️⃣ Start the server
```bash
npm run dev
```

Server runs at:
```
http://localhost:5000
```

---

## 🔐 Authentication Flow

- User logs in and receives **Access Token** and **Refresh Token**
- Access Token is sent in `Authorization: Bearer <token>` header
- Refresh Token is used to obtain a new access token
- Logout clears refresh token on client side

---

## 🧠 Design Decisions

- Stateless JWT authentication
- Short-lived access tokens for security
- Database-level pagination and filtering
- Prisma ORM for strong type safety
- Clean separation of concerns (routes, controllers, middleware)

---

## 👤 Author

**Abhay Rawat**  
Backend Developer | Full Stack Intern | Frontend Developer 

Portfolio: https://abhay-sigma.vercel.app  
LinkedIn: https://www.linkedin.com/in/abhay-rawat-b58b2226b  
GitHub: https://github.com/Known-user
