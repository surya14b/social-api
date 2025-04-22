import User, { findOne } from '../models/user.js';
import { authenticate } from '../config/passport.js';

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password,
      authType: 'local'
    });
    
    await user.save();
    
    // Generate JWT
    const token = user.generateToken();
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check if Google user trying to login with password
    if (user.authType === 'google' && user.password.startsWith('google-auth-')) {
      return res.status(400).json({ 
        message: 'This account uses Google authentication. Please login with Google.'
      });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = user.generateToken();
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}

export const googleAuth = authenticate('google', {
  scope: ['profile', 'email']
});

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
export function googleCallback(req, res) {
  try {
    // Generate JWT
    const token = req.user.generateToken();
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/login/success?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error.message);
    res.redirect(`${process.env.FRONTEND_URL}/login/error`);
  }
}

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
export async function getCurrentUser(req, res) {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get current user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}