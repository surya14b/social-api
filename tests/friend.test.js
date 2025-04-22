const request = require('supertest');
const mongoose = require('mongoose');
const { connectTestDB, closeTestDB, clearTestDB } = require('../config/test-db');
const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');

// Create Express app for testing
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/friends', require('../routes/friends'));

// Set up test user IDs
const TEST_USER_ID = new mongoose.Types.ObjectId();
const FRIEND_USER_ID = new mongoose.Types.ObjectId();
const PENDING_USER_ID = new mongoose.Types.ObjectId();
const REQUEST_ID = new mongoose.Types.ObjectId();

// Mock middleware for protected routes
jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    req.user = {
      _id: TEST_USER_ID,
      name: 'Test User',
      email: 'test@example.com',
    };
    next();
  };
});

describe('Friend Endpoints', () => {
  // Connect to test database before all tests
  beforeAll(async () => {
    await connectTestDB();
  });

  // Setup test data before each test
  beforeEach(async () => {
    // Create test users
    const testUser = new User({
      _id: TEST_USER_ID,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      authType: 'local',
    });
    await testUser.save();

    const friendUser = new User({
      _id: FRIEND_USER_ID,
      name: 'Friend User',
      email: 'friend@example.com',
      password: 'password123',
      authType: 'local',
    });
    await friendUser.save();

    const pendingUser = new User({
      _id: PENDING_USER_ID,
      name: 'Pending User',
      email: 'pending@example.com',
      password: 'password123',
      authType: 'local',
    });
    await pendingUser.save();

    // Create an accepted friend request
    const acceptedRequest = new FriendRequest({
      sender: TEST_USER_ID,
      receiver: FRIEND_USER_ID,
      status: 'accepted',
    });
    await acceptedRequest.save();

    // Create a pending friend request to test user
    const pendingRequest = new FriendRequest({
      _id: REQUEST_ID,
      sender: PENDING_USER_ID,
      receiver: TEST_USER_ID,
      status: 'pending',
    });
    await pendingRequest.save();
  });

  // Clear database between tests
  afterEach(async () => {
    await clearTestDB();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await closeTestDB();
  });

  describe('GET /api/friends', () => {
    it('should list all friends', async () => {
      const response = await request(app).get('/api/friends');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('friends');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.friends.length).toBe(1);
      expect(response.body.friends[0].email).toBe('friend@example.com');
    });
  });

  describe('GET /api/friends/requests/incoming', () => {
    it('should list incoming friend requests', async () => {
      const response = await request(app).get('/api/friends/requests/incoming');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('requests');
      expect(response.body.requests.length).toBe(1);
      expect(response.body.requests[0].sender.email).toBe('pending@example.com');
      expect(response.body.requests[0].status).toBe('pending');
    });
  });

  describe('POST /api/friends/request/:userId', () => {
    it('should send a friend request', async () => {
      // Create a new user to send request to
      const newUser = new User({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        authType: 'local',
      });
      await newUser.save();

      const response = await request(app)
        .post(`/api/friends/request/${newUser._id}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Friend request sent');

      // Verify request was created in database
      const friendRequest = await FriendRequest.findOne({
        sender: TEST_USER_ID,
        receiver: newUser._id,
      });
      expect(friendRequest).toBeTruthy();
      expect(friendRequest.status).toBe('pending');
    });

    it('should not allow sending request to self', async () => {
      const response = await request(app)
        .post(`/api/friends/request/${TEST_USER_ID}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Cannot send friend request to yourself');
    });

    it('should not allow duplicate friend requests', async () => {
      const response = await request(app)
        .post(`/api/friends/request/${FRIEND_USER_ID}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('You are already friends with this user');
    });
  });

  describe('PUT /api/friends/request/:requestId/accept', () => {
    it('should accept a friend request', async () => {
      const response = await request(app)
        .put(`/api/friends/request/${REQUEST_ID}/accept`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Friend request accepted');

      // Verify status was updated in database
      const friendRequest = await FriendRequest.findById(REQUEST_ID);
      expect(friendRequest.status).toBe('accepted');
    });

    it('should not allow accepting non-existent request', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/friends/request/${nonExistentId}/accept`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Friend request not found');
    });
  });

  describe('PUT /api/friends/request/:requestId/reject', () => {
    it('should reject a friend request', async () => {
      const response = await request(app)
        .put(`/api/friends/request/${REQUEST_ID}/reject`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Friend request rejected');

      // Verify status was updated in database
      const friendRequest = await FriendRequest.findById(REQUEST_ID);
      expect(friendRequest.status).toBe('rejected');
    });
  });
});