const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
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

// Get all approved gallery images
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isApproved: true };
    if (category) {
      filter.category = category;
    }
    
    const images = await Gallery.find(filter)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all images (admin only)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    
    const images = await Gallery.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload new image
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, imageUrl, category, location } = req.body;
    
    const image = new Gallery({
      title,
      description,
      imageUrl,
      category,
      location: location || '',
      uploadedBy: req.userId
    });
    
    await image.save();
    
    const populatedImage = await Gallery.findById(image._id)
      .populate('uploadedBy', 'name');
    
    res.status(201).json({ success: true, image: populatedImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve image (admin only)
router.put('/approve/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    
    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('uploadedBy', 'name');
    
    res.json({ success: true, image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete image (admin only or owner)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    if (user.role !== 'admin' && image.uploadedBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
