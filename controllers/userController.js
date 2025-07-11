import mongoose from 'mongoose';
import User from '../models/user.js';
import FriendRequest from '../models/friendRequest.js';
import { getPaginationOptions, createPaginationMeta } from '../utils/pagination.js';

// @route   GET /api/users
// @desc    Get all users except self
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationOptions(req);
    
    // Get total count
    const totalItems = await User.countDocuments({ _id: { $ne: req.user._id } });
    
    // Get all users except current user with pagination
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('name email bio createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Create pagination metadata
    const pagination = createPaginationMeta(page, limit, totalItems);
    
    res.json({
      users,
      pagination
    });
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/users/me
// @desc    Get user profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    // User is already in req.user from auth middleware
    res.json(req.user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    
    // Find and update user
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/users/suggestions
// @desc    Get friend suggestions
// @access  Private
export const getFriendSuggestions = async (req, res) => {
  try {
    // Get current user's friends
    const friendRequests = await FriendRequest.find({
      $or: [
        { sender: req.user._id, status: 'accepted' },
        { receiver: req.user._id, status: 'accepted' }
      ]
    });
    
    // Extract friend IDs
    const friendIds = friendRequests.map(request => {
      return request.sender.toString() === req.user._id.toString() 
        ? request.receiver 
        : request.sender;
    });
    
    // Also add current user ID to exclude
    friendIds.push(req.user._id);
    
    // Get pending requests
    const pendingRequests = await FriendRequest.find({
      $or: [
        { sender: req.user._id, status: 'pending' },
        { receiver: req.user._id, status: 'pending' }
      ]
    });
    
    // Extract pending IDs
    pendingRequests.forEach(request => {
      const pendingId = request.sender.toString() === req.user._id.toString() 
        ? request.receiver 
        : request.sender;
      
      if (!friendIds.includes(pendingId)) {
        friendIds.push(pendingId);
      }
    });
    
    // Find 5 random users excluding friends and self
    const suggestions = await User.aggregate([
      { $match: { _id: { $nin: friendIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      { $sample: { size: 5 } },
      { $project: { name: 1, email: 1, bio: 1 } }
    ]);
    
    res.json(suggestions);
  } catch (error) {
    console.error('Get friend suggestions error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/users/search
// @desc    Search users by name
// @access  Private
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const { page, limit, skip } = getPaginationOptions(req);
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Get total count
    const totalItems = await User.countDocuments({
      _id: { $ne: req.user._id },
      name: { $regex: query, $options: 'i' }
    });
    
    // Search users by name (case insensitive) with pagination
    const users = await User.find({
      _id: { $ne: req.user._id },
      name: { $regex: query, $options: 'i' }
    })
    .select('name email bio')
    .skip(skip)
    .limit(limit);
    
    // Create pagination metadata
    const pagination = createPaginationMeta(page, limit, totalItems);
    
    res.json({
      users,
      pagination
    });
  } catch (error) {
    console.error('Search users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};