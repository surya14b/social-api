import { Router } from 'express';
const router = Router();
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, listFriends, listIncomingRequests, listOutgoingRequests } from '../controllers/friendController';
import auth from '../middleware/auth';
import friendController from '../controllers/friendController.js';

// @route   POST /api/friends/request/:userId
// @desc    Send friend request
// @access  Private
router.post('/request/:userId', auth, sendFriendRequest);

// @route   PUT /api/friends/request/:requestId/accept
// @desc    Accept friend request
// @access  Private
router.put('/request/:requestId/accept', auth, acceptFriendRequest);

// @route   PUT /api/friends/request/:requestId/reject
// @desc    Reject friend request
// @access  Private
router.put('/request/:requestId/reject', auth, rejectFriendRequest);

// @route   GET /api/friends
// @desc    List all friends
// @access  Private
router.get('/', auth, listFriends);

// @route   GET /api/friends/requests/incoming
// @desc    List incoming friend requests
// @access  Private
router.get('/requests/incoming', auth, listIncomingRequests);

// @route   GET /api/friends/requests/outgoing
// @desc    List outgoing friend requests
// @access  Private
router.get('/requests/outgoing', auth, listOutgoingRequests);

export default router;