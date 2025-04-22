import { Router } from 'express';
const router = Router();
import { getAllUsers, getProfile, updateProfile, getFriendSuggestions, searchUsers } from '../controllers/userController';
import auth from '../middleware/auth';
import { profileUpdateValidation, validate } from '../middleware/validation';

// @route   GET /api/users
// @desc    Get all users except self
// @access  Private
router.get('/', auth, getAllUsers);

// @route   GET /api/users/me
// @desc    Get user profile
// @access  Private
router.get('/me', auth, getProfile);

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, profileUpdateValidation, validate, updateProfile);

// @route   GET /api/users/suggestions
// @desc    Get friend suggestions
// @access  Private
router.get('/suggestions', auth, getFriendSuggestions);

// @route   GET /api/users/search
// @desc    Search users by name
// @access  Private
router.get('/search', auth, searchUsers);

export default router;