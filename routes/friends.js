import express from 'express';
import * as friendController from '../controllers/friendController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/friends/request/:userId
// @desc    Send friend request
// @access  Private
router.post('/request/:userId', auth, friendController.sendFriendRequest);

// @route   PUT /api/friends/request/:requestId/accept
// @desc    Accept friend request
// @access  Private
router.put('/request/:requestId/accept', auth, friendController.acceptFriendRequest);

// @route   PUT /api/friends/request/:requestId/reject
// @desc    Reject friend request
// @access  Private
router.put('/request/:requestId/reject', auth, friendController.rejectFriendRequest);

// @route   GET /api/friends
// @desc    List all friends
// @access  Private
router.get('/', auth, friendController.listFriends);

// @route   GET /api/friends/requests/incoming
// @desc    List incoming friend requests
// @access  Private
router.get('/requests/incoming', auth, friendController.listIncomingRequests);

// @route   GET /api/friends/requests/outgoing
// @desc    List outgoing friend requests
// @access  Private
router.get('/requests/outgoing', auth, friendController.listOutgoingRequests);

export default router;