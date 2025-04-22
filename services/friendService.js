const FriendRequest = require('../models/friendRequest');
const User = require('../models/user');

/**
 * Check if two users are friends
 * @param {string} userId1 First user ID
 * @param {string} userId2 Second user ID
 * @returns {Promise<boolean>} True if users are friends, false otherwise
 */
exports.areFriends = async (userId1, userId2) => {
  const request = await FriendRequest.findOne({
    $or: [
      { sender: userId1, receiver: userId2, status: 'accepted' },
      { sender: userId2, receiver: userId1, status: 'accepted' }
    ]
  });
  
  return !!request;
};

/**
 * Get friendship status between two users
 * @param {string} userId1 First user ID
 * @param {string} userId2 Second user ID
 * @returns {Promise<string>} Friendship status (none, pending, accepted, rejected)
 */
exports.getFriendshipStatus = async (userId1, userId2) => {
    const request = await FriendRequest.findOne({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    });
    
    if (!request) {
      return 'none';
    }
    
    return request.status;
  };
  
  /**
   * Get mutual friend count between two users
   * @param {string} userId1 First user ID
   * @param {string} userId2 Second user ID
   * @returns {Promise<number>} Number of mutual friends
   */
  exports.getMutualFriendCount = async (userId1, userId2) => {
    // Get friends of first user
    const user1Requests = await FriendRequest.find({
      $or: [
        { sender: userId1, status: 'accepted' },
        { receiver: userId1, status: 'accepted' }
      ]
    });
    
    const user1FriendIds = user1Requests.map(request => 
      request.sender.toString() === userId1.toString() 
        ? request.receiver.toString() 
        : request.sender.toString()
    );
    
    // Get friends of second user
    const user2Requests = await FriendRequest.find({
      $or: [
        { sender: userId2, status: 'accepted' },
        { receiver: userId2, status: 'accepted' }
      ]
    });
    
    const user2FriendIds = user2Requests.map(request => 
      request.sender.toString() === userId2.toString() 
        ? request.receiver.toString() 
        : request.sender.toString()
    );
    
    // Count mutual friends
    const mutualFriends = user1FriendIds.filter(id => user2FriendIds.includes(id));
    
    return mutualFriends.length;
  };