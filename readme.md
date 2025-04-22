Social Backend API
A RESTful API for a social platform with user authentication, profile management, and friend functionality.
Features
User Authentication

Email/password registration with JWT authentication
Google OAuth authentication
JWT-based session management
Secure password hashing

User Management

User profiles with customizable fields
List all platform users
Search users by name
Update user profiles

Friend System

Send and receive friend requests
Accept/reject incoming requests
List friends and friendship statuses
Friend suggestions based on mutual connections
View incoming and outgoing friend requests

Tech Stack

Backend Framework: Express.js
Database: MongoDB with Mongoose
Authentication: JWT, Passport.js, Google OAuth
Validation: express-validator
Security: bcryptjs for password hashing, helmet for HTTP headers

Installation

Clone the repository:
git clone https://github.com/yourusername/social-api.git
cd social-api

Install dependencies:
npm install

Create a .env file in the root directory with the following variables:
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialapi
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000

Start the server:
bash# Development with auto-reload
npm run dev

# Production
npm start

# Run tests
npm test


API Endpoints
Authentication
Register a User
POST /api/auth/register
Request body:
json{
  "name": "suryakanth",
  "email": "surya@example.com",
  "password": "password123"
}
Login
POST /api/auth/login
Request body:
json{
  "email": "surya@example.com",
  "password": "password123"
}
Google Authentication
GET /api/auth/google
Get Current User
GET /api/auth/me
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
User Management
Get All Users (Except Self)
GET /api/users?page=1&limit=10
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Response:
json{
  "users": [
    {
      "_id": "60d5ec9af682fbd12a456789",
      "name": "bhavana",
      "email": "bhavana@example.com",
      "bio": "Software Engineer"
    },
    {
      "_id": "60d5ec9af682fbd12a456790",
      "name": "mahesh babu",
      "email": "babu@example.com",
      "bio": "UI Designer"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
Get User Profile
GET /api/users/me
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Update User Profile
PUT /api/users/me
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Request body:
json{
  "name": "surya Updated",
  "bio": "Software Developer from California"
}
Get Friend Suggestions
GET /api/users/suggestions
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Search Users
GET /api/users/search?query=John&page=1&limit=10
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Response:
json{
  "users": [
    {
      "_id": "60d5ec9af682fbd12a456789",
      "name": "mahesh babu",
      "email": "babu@example.com",
      "bio": "Software Engineer"
    },
    {
      "_id": "60d5ec9af682fbd12a456790",
      "name": "Johnny Walker",
      "email": "johnny@example.com",
      "bio": "UI Designer"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
Friend Management
Send Friend Request
POST /api/friends/request/:userId
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Accept Friend Request
PUT /api/friends/request/:requestId/accept
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Reject Friend Request
PUT /api/friends/request/:requestId/reject
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
List All Friends
GET /api/friends?page=1&limit=10
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Response:
json{
  "friends": [
    {
      "_id": "60d5ec9af682fbd12a456789",
      "name": "no name",
      "email": "hello@example.com",
      "bio": "Software Engineer"
    },
    {
      "_id": "60d5ec9af682fbd12a456790",
      "name": "salaar",
      "email": "salaar@example.com",
      "bio": "UI Designer"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
List Incoming Friend Requests
GET /api/friends/requests/incoming
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
List Outgoing Friend Requests
GET /api/friends/requests/outgoing
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Database Schema
User Model

name (String): User's full name
email (String): User's email address (unique)
password (String): Hashed password
bio (String): User bio/description
authType (String): Authentication type (local or google)
createdAt (Date): Account creation timestamp

FriendRequest Model

sender (ObjectId): User who sent the request
receiver (ObjectId): User who received the request
status (String): Status of the request (pending, accepted, rejected)
createdAt (Date): Request timestamp

Error Handling
The API uses consistent error responses:
json{
  "message": "Error message here"
}
For validation errors:
json{
  "errors": [
    {
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
Security Considerations

Passwords are hashed using bcrypt
Authentication uses JWT with expiration
HTTP security headers via helmet middleware
Input validation on all endpoints
MongoDB injection protection
CORS configuration for API access control

Implemented Bonus Features

 Search functionality to find users by name
 Friend suggestion algorithm (currently random, but structure allows for more complex algorithms)
 Pagination for listing endpoints

All list endpoints support page and limit query parameters
Response includes pagination metadata


 Unit tests for major endpoints

Authentication (register, login, get current user)
User management (get all users, get profile, update profile, search)
Friend functionality (send request, accept/reject request, list friends)



Next Steps
Potential improvements for the future:

Add pagination for user listings and friend lists
Implement socket.io for real-time notifications
Add rate limiting to prevent abuse
Implement more sophisticated friend suggestion algorithms
Add image upload functionality for user profiles
Add followers/following functionality
Implement blocking users

License
MIT