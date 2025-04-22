import express from 'express';
import * as userController from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import { profileUpdateValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users except self
// @access  Private
router.get('/', auth, userController.getAllUsers);

// @route   GET /api/users/me
// @desc    Get user profile
// @access  Private
router.get('/me', auth, userController.getProfile);

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, profileUpdateValidation, validate, userController.updateProfile);

// @route   GET /api/users/suggestions
// @desc    Get friend suggestions
// @access  Private
router.get('/suggestions', auth, userController.getFriendSuggestions);

// @route   GET /api/users/search
// @desc    Search users by name
// @access  Private
router.get('/search', auth, userController.searchUsers);

export default router;