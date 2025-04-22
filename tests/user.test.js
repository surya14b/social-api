const request = require('supertest');
const mongoose = require('mongoose');
const { connectTestDB, closeTestDB, clearTestDB } = require('../config/test-db');
const User = require('../models/user');

// Create Express app for testing
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/users', require('../routes/users'));

// Set up test user ID
const TEST_USER_ID = new mongoose.Types.ObjectId();
const OTHER_USER_ID_1 = new mongoose.Types.ObjectId();
const OTHER_USER_ID_2 = new mongoose.Types.ObjectId();

// Mock middleware for protected routes
jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    req.user = {
      _id: TEST_USER_ID,
      name: 'Test User',
      email: 'test@example.com',
      bio: '',
    };
    next();
  };
});

describe('User Endpoints', () => {
  // Connect to test database before all tests
  beforeAll(async () => {
    await connectTestDB();
  });

  // Setup test data before each test
  beforeEach(async () => {
    // Create test user
    const testUser = new User({
      _id: TEST_USER_ID,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      bio: '',
      authType: 'local',
    });
    await testUser.save();

    // Create other users for testing
    const otherUser1 = new User({
      _id: OTHER_USER_ID_1,
      name: 'suryakanth',
      email: 'surya@example.com',
      password: 'password123',
      bio: 'Developer',
      authType: 'local',
    });
    await otherUser1.save();

    const otherUser2 = new User({
      _id: OTHER_USER_ID_2,
      name: 'bhavana',
      email: 'bhavana@example.com',
      password: 'password123',
      bio: 'Designer',
      authType: 'local',
    });
    await otherUser2.save();
  });

  // Clear database between tests
  afterEach(async () => {
    await clearTestDB();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await closeTestDB();
  });

  describe('GET /api/users', () => {
    it('should get all users except self', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.users.length).toBe(2);
      
      // Check pagination
      expect(response.body.pagination.totalItems).toBe(2);
      expect(response.body.pagination.currentPage).toBe(1);
      
      // Ensure test user is not included
      const userEmails = response.body.users.map(user => user.email);
      expect(userEmails).toContain('john@example.com');
      expect(userEmails).toContain('jane@example.com');
      expect(userEmails).not.toContain('test@example.com');
    });

    it('should respect pagination parameters', async () => {
      // Add more users to test pagination
      for (let i = 0; i < 10; i++) {
        const newUser = new User({
          name: `User ${i}`,
          email: `user${i}@example.com`,
          password: 'password123',
          authType: 'local',
        });
        await newUser.save();
      }

      const response = await request(app)
        .get('/api/users')
        .query({ page: 2, limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.users.length).toBeLessThanOrEqual(5);
      expect(response.body.pagination.currentPage).toBe(2);
      expect(response.body.pagination.itemsPerPage).toBe(5);
      expect(response.body.pagination.totalItems).toBe(12); // 2 from setup + 10 added here
    });
  });

  describe('GET /api/users/me', () => {
    it('should get current user profile', async () => {
      const response = await request(app).get('/api/users/me');

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.name).toBe('Test User');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update user profile', async () => {
      const updatedProfile = {
        name: 'Updated Name',
        bio: 'Updated Bio',
      };

      const response = await request(app)
        .put('/api/users/me')
        .send(updatedProfile);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedProfile.name);
      expect(response.body.bio).toBe(updatedProfile.bio);

      // Verify changes in database
      const updatedUser = await User.findById(TEST_USER_ID);
      expect(updatedUser.name).toBe(updatedProfile.name);
      expect(updatedUser.bio).toBe(updatedProfile.bio);
    });

    it('should allow partial updates', async () => {
      const partialUpdate = {
        bio: 'Only Bio Updated',
      };

      const response = await request(app)
        .put('/api/users/me')
        .send(partialUpdate);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test User'); // Name unchanged
      expect(response.body.bio).toBe(partialUpdate.bio);
    });
  });

  describe('GET /api/users/search', () => {
    it('should search users by name', async () => {
      const response = await request(app)
        .get('/api/users/search')
        .query({ query: 'john' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body.users.length).toBe(1);
      expect(response.body.users[0].name).toBe('John Smith');
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/users/search')
        .query({ query: 'nonexistent' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body.users.length).toBe(0);
    });

    it('should require search query parameter', async () => {
      const response = await request(app)
        .get('/api/users/search');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Search query is required');
    });
  });

  describe('GET /api/users/suggestions', () => {
    it('should return user suggestions', async () => {
      const response = await request(app)
        .get('/api/users/suggestions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // All other users should be suggested
      expect(response.body.length).toBeLessThanOrEqual(5);
    });
  });
});