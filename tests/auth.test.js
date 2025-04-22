const request = require('supertest');
const mongoose = require('mongoose');
const { connectTestDB, closeTestDB, clearTestDB } = require('../config/test-db');
const User = require('../models/user');

// Create Express app for testing
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/auth', require('../routes/auth'));

// Mock middleware for protected routes
jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    req.user = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@example.com',
    };
    next();
  };
});

describe('Authentication Endpoints', () => {
  // Connect to test database before all tests
  beforeAll(async () => {
    await connectTestDB();
  });

  // Clear database between tests
  afterEach(async () => {
    await clearTestDB();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await closeTestDB();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      const userData = {
        name: 'suryakanth',
        email: 'surya@gmail.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);

      // Check if user was actually created in the database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'suryakanth',
          // Missing email
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should not allow duplicate emails', async () => {
      const userData = {
        name: 'suryakanth',
        email: 'suryaexample.com',
        password: 'password123',
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        authType: 'local',
      });
      await user.save();
    });

    it('should login user and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return the current user', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe('test@example.com');
    });
  });
});