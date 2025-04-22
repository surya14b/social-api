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

### 🧑‍🤝‍🧑 Friend System
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
Install dependencies

bash
Copy
Edit
npm install
Create a .env file

ini
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialapi
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
Start the server

bash
Copy
Edit
# Development with auto-reload
npm run dev

# Production
npm start

# Run tests
npm test
📘 API Endpoints
🔐 Authentication
Register

arduino
Copy
Edit
POST /api/auth/register
json
Copy
Edit
{
  "name": "suryakanth",
  "email": "surya@example.com",
  "password": "password123"
}
Login

bash
Copy
Edit
POST /api/auth/login
json
Copy
Edit
{
  "email": "surya@example.com",
  "password": "password123"
}
Google OAuth

bash
Copy
Edit
GET /api/auth/google
Get Current User

vbnet
Copy
Edit
GET /api/auth/me
Headers: Authorization: Bearer <TOKEN>
👤 User Management
Get All Users (Except Self)


GET /api/users?page=1&limit=10
Headers: Authorization: Bearer <TOKEN>
Get Own Profile


GET /api/users/me
Headers: Authorization: Bearer <TOKEN>
Update Profile


PUT /api/users/me
Headers: Authorization: Bearer <TOKEN>
json

{
  "name": "surya Updated",
  "bio": "Software Developer from California"
}
Friend Suggestions


GET /api/users/suggestions
Headers: Authorization: Bearer <TOKEN>
Search Users


GET /api/users/search?query=John&page=1&limit=10
Headers: Authorization: Bearer <TOKEN>
🤝 Friend Management
Send Friend Request


POST /api/friends/request/:userId
Headers: Authorization: Bearer <TOKEN>
Accept Friend Request


PUT /api/friends/request/:requestId/accept
Headers: Authorization: Bearer <TOKEN>
Reject Friend Request


PUT /api/friends/request/:requestId/reject
Headers: Authorization: Bearer <TOKEN>
List Friends


GET /api/friends?page=1&limit=10
Headers: Authorization: Bearer <TOKEN>
List Incoming Friend Requests


GET /api/friends/requests/incoming
Headers: Authorization: Bearer <TOKEN>
List Outgoing Friend Requests


GET /api/friends/requests/outgoing
Headers: Authorization: Bearer <TOKEN>
🧩 Database Schema
📄 User Model

Field	Type	Description
name	String	Full name of the user
email	String	Unique email address
password	String	Hashed password
bio	String	User bio/description
authType	String	"local" or "google"
createdAt	Date	Timestamp of account creation
📄 FriendRequest Model

Field	Type	Description
sender	ObjectId	User who sent the request
receiver	ObjectId	User who received the request
status	String	"pending", "accepted", or "rejected"
createdAt	Date	Request creation timestamp
🚫 Error Handling
General Errors
json
Copy
Edit
{
  "message": "Error message here"
}
Validation Errors
json
Copy
Edit
{
  "errors": [
    {
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
🛡 Security Considerations
Passwords are hashed using bcrypt

Authentication uses JWT with expiration

HTTP security headers via helmet middleware

Input validation on all endpoints

MongoDB injection protection

CORS configuration for access control

🎁 Implemented Bonus Features
Search users by name

Friend suggestion algorithm (currently random)

Pagination on all list endpoints with metadata

Unit tests for:

Authentication

User Management

Friend Management

📈 Next Steps
Add socket.io for real-time friend request notifications

Implement rate limiting to prevent abuse

Smarter friend suggestions (mutual friends, interests)

Add image upload support for user profiles

Implement followers/following model

Implement user blocking feature
