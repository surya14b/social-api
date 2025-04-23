# Social Backend API

A RESTful API for a social platform with user authentication, profile management, and friend functionality.

---

## 🚀 Features

### 🔐 User Authentication
- Email/password registration with JWT authentication
- Google OAuth authentication
- JWT-based session management
- Secure password hashing

### 👤 User Management
- User profiles with customizable fields
- List all platform users
- Search users by name
- Update user profiles

### 🧑‍🧙‍🧑 Friend System
- Send and receive friend requests
- Accept/reject incoming requests
- List friends and friendship statuses
- Friend suggestions based on mutual connections
- View incoming and outgoing friend requests

---

## 🛠 Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport.js, Google OAuth
- **Validation**: express-validator
- **Security**: bcryptjs, helmet

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/social-api.git
   cd social-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a .env file**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/socialapi
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development with auto-reload
   npm run dev

   # Production
   npm start
   ```

5. **Run tests**
   ```bash
   npm test
   ```

---

## 📘 API Endpoints

### 🔐 Authentication

#### Register
```http
POST /api/auth/register
```
**Request Body:**
```json
{
  "name": "suryakanth",
  "email": "surya@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "surya@example.com",
  "password": "password123"
}
```

#### Google OAuth
```http
GET /api/auth/google
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <TOKEN>
```

---

### 👤 User Management

#### Get All Users (Except Self)
```http
GET /api/users?page=1&limit=10
Authorization: Bearer <TOKEN>
```

#### Get Own Profile
```http
GET /api/users/me
Authorization: Bearer <TOKEN>
```

#### Update Profile
```http
PUT /api/users/me
Authorization: Bearer <TOKEN>
```
**Request Body:**
```json
{
  "name": "surya Updated",
  "bio": "Software Developer from California"
}
```

#### Friend Suggestions
```http
GET /api/users/suggestions
Authorization: Bearer <TOKEN>
```

#### Search Users
```http
GET /api/users/search?query=John&page=1&limit=10
Authorization: Bearer <TOKEN>
```

---

### 🤝 Friend Management

#### Send Friend Request
```http
POST /api/friends/request/:userId
Authorization: Bearer <TOKEN>
```

#### Accept Friend Request
```http
PUT /api/friends/request/:requestId/accept
Authorization: Bearer <TOKEN>
```

#### Reject Friend Request
```http
PUT /api/friends/request/:requestId/reject
Authorization: Bearer <TOKEN>
```

#### List Friends
```http
GET /api/friends?page=1&limit=10
Authorization: Bearer <TOKEN>
```

#### List Incoming Friend Requests
```http
GET /api/friends/requests/incoming?page=1&limit=10
Authorization: Bearer <TOKEN>
```

#### List Outgoing Friend Requests
```http
GET /api/friends/requests/outgoing?page=1&limit=10
Authorization: Bearer <TOKEN>
```

---

## 🧰 Database Schema

### 📄 User Model

| Field     | Type     | Description                   |
|----------|----------|-------------------------------|
| name     | String   | Full name of the user         |
| email    | String   | Unique email address          |
| password | String   | Hashed password               |
| bio      | String   | User bio/description          |
| authType | String   | "local" or "google"           |
| createdAt| Date     | Timestamp of account creation |

### 📄 FriendRequest Model

| Field     | Type     | Description                          |
|----------|----------|--------------------------------------|
| sender   | ObjectId | User who sent the request            |
| receiver | ObjectId | User who received the request        |
| status   | String   | "pending", "accepted", or "rejected" |
| createdAt| Date     | Request creation timestamp           |

---

## 🚫 Error Handling

### General Errors
```json
{
  "message": "Error message here"
}
```

### Validation Errors
```json
{
  "errors": [
    {
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
```

---

## 🛡 Security Considerations

- Passwords are hashed using bcrypt
- Authentication uses JWT with expiration
- HTTP security headers via helmet middleware
- Input validation on all endpoints
- MongoDB injection protection
- CORS configuration for access control

---

## 🏱 Implemented Bonus Features

- Search users by name
- Friend suggestion algorithm (currently random)
- Pagination on all list endpoints with metadata
- Unit tests for:
  - Authentication
  - User Management
  - Friend Management

---

## 🔎 Testing Workflow

1. Register at least 2–3 different users.
2. Login with each user and save their JWT tokens.
3. Use one user's token to send friend requests to the others.
4. Use the other users' tokens to accept or reject those requests.
5. Use listing endpoints to verify the results.

---

## 📊 Next Steps

- Add socket.io for real-time friend request notifications
- Implement rate limiting to prevent abuse
- Smarter friend suggestions (mutual friends, interests)
- Add image upload support for user profiles
- Implement followers/following model
- Implement user blocking feature
