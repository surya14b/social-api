import mongoose from 'mongoose';
import FriendRequest from '../models/friendRequest.js';
import User from '../models/user.js';
import { getPaginationOptions, createPaginationMeta } from '../utils/pagination.js';

// @route   POST /api/friends/request/:userId
// @desc    Send friend request
// @access  Private
export const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if trying to friend self
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }
    
    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    });
    
    if (existingRequest) {
      if (existingRequest.status === 'accepted') {
        return res.status(400).json({ message: 'You are already friends with this user' });
      } else if (existingRequest.status === 'pending' && 
                existingRequest.sender.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Friend request already sent' });
      } else if (existingRequest.status === 'pending' && 
                existingRequest.receiver.toString() === req.user._id.toString()) {
        return res.status(400).json({ 
          message: 'This user has already sent you a friend request. Check your incoming requests.' 
        });
      } else if (existingRequest.status === 'rejected') {
        // If rejected, we can update it back to pending
        existingRequest.status = 'pending';
        existingRequest.sender = req.user._id;
        existingRequest.receiver = userId;
        await existingRequest.save();
        
        return res.json({ message: 'Friend request sent' });
      }
    }
    
    // Create new friend request
    const newFriendRequest = new FriendRequest({
      sender: req.user._id,
      receiver: userId,
      status: 'pending'
    });
    
    await newFriendRequest.save();
    
    res.status(201).json({ message: 'Friend request sent' });
  } catch (error) {
    console.error('Send friend request error:', error.message);
    
    // Handle invalid ID format
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/friends/request/:requestId/accept
// @desc    Accept friend request
// @access  Private
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Find request
    const request = await FriendRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    // Check if user is the receiver
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }
    
    // Check if already accepted
    if (request.status === 'accepted') {
      return res.status(400).json({ message: 'Friend request already accepted' });
    }
    
    // Update request status
    request.status = 'accepted';
    await request.save();
    
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Accept friend request error:', error.message);
    
    // Handle invalid ID format
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/friends/request/:requestId/reject
// @desc    Reject friend request
// @access  Private
export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Find request
    const request = await FriendRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    // Check if user is the receiver
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }
    
    // Update request status
    request.status = 'rejected';
    await request.save();
    
    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Reject friend request error:', error.message);
    
    // Handle invalid ID format
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/friends
// @desc    List all friends
// @access  Private
export const listFriends = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationOptions(req);
    
    // Find total number of friends
    const totalFriendRequests = await FriendRequest.countDocuments({
      $or: [
        { sender: req.user._id, status: 'accepted' },
        { receiver: req.user._id, status: 'accepted' }
      ]
    });
    
    // Find accepted friend requests with pagination
    const friendRequests = await FriendRequest.find({
      $or: [
        { sender: req.user._id, status: 'accepted' },
        { receiver: req.user._id, status: 'accepted' }
      ]
    })
    .populate('sender receiver', 'name email bio')
    .skip(skip)
    .limit(limit);
    
    // Extract friend data
    const friends = friendRequests.map(request => {
      // Return the other user (not current user)
      return request.sender._id.toString() === req.user._id.toString() 
        ? request.receiver 
        : request.sender;
    });
    
    // Create pagination metadata
    const pagination = createPaginationMeta(page, limit, totalFriendRequests);
    
    res.json({
      friends,
      pagination
    });
  } catch (error) {
    console.error('List friends error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/friends/requests/incoming
// @desc    List incoming friend requests
// @access  Private
export const listIncomingRequests = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationOptions(req);
    
    // Count total incoming requests
    const totalItems = await FriendRequest.countDocuments({
      receiver: req.user._id,
      status: 'pending'
    });
    
    // Find pending friend requests where user is receiver with pagination
    const requests = await FriendRequest.find({
      receiver: req.user._id,
      status: 'pending'
    })
    .populate('sender', 'name email bio')
    .skip(skip)
    .limit(limit);
    
    // Create pagination metadata
    const pagination = createPaginationMeta(page, limit, totalItems);
    
    res.json({
      requests,
      pagination
    });
  } catch (error) {
    console.error('List incoming requests error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/friends/requests/outgoing
// @desc    List outgoing friend requests
// @access  Private
export const listOutgoingRequests = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationOptions(req);
    
    // Count total outgoing requests
    const totalItems = await FriendRequest.countDocuments({
      sender: req.user._id,
      status: 'pending'
    });
    
    // Find pending friend requests where user is sender with pagination
    const requests = await FriendRequest.find({
      sender: req.user._id,
      status: 'pending'
    })
    .populate('receiver', 'name email bio')
    .skip(skip)
    .limit(limit);
    
    // Create pagination metadata
    const pagination = createPaginationMeta(page, limit, totalItems);
    
    res.json({
      requests,
      pagination
    });
  } catch (error) {
    console.error('List outgoing requests error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};