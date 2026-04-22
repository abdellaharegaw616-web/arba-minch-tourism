const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get conversation between two users
router.get('/conversation/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { from: req.userId, to: userId },
        { from: userId, to: req.userId }
      ]
    })
    .populate('from', 'name profileImage')
    .populate('to', 'name profileImage')
    .sort({ timestamp: 1 });
    
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all conversations for current user
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: req.userId },
            { to: req.userId }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$from', req.userId] },
              then: '$to',
              else: '$from'
            }
          },
          lastMessage: { $first: '$message' },
          lastTimestamp: { $first: '$timestamp' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$to', req.userId] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          profileImage: '$user.profileImage',
          lastMessage: 1,
          lastTimestamp: 1,
          unreadCount: 1
        }
      }
    ]);

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read
router.put('/read/:userId', verifyToken, async (req, res) => {
  try {
    await Message.updateMany(
      { from: req.params.userId, to: req.userId, read: false },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
