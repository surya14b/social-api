import { Router } from 'express';
const router = Router();
import { register, login, googleAuth, googleCallback, getCurrentUser } from '../controllers/authController';
import auth from '../middleware/auth';
import { registerValidation, loginValidation, validate } from '../middleware/validation';

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', registerValidation, validate, register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginValidation, validate, login);

// @route   GET /api/auth/google
// @desc    Auth with Google
// @access  Public
router.get('/google', googleAuth);

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get('/google/callback', googleCallback);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getCurrentUser);

export default router;