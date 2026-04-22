const express = require('express');
const router = express.Router();
const notificationService = require('../services/notification');
const { authenticate, requireAdmin } = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Send booking confirmation
router.post('/booking-confirmation', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('user');
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const result = await notificationService.sendBookingConfirmation(booking, booking.user);
    
    res.json({ 
      success: true, 
      message: 'Booking confirmation sent successfully',
      result 
    });
  } catch (error) {
    console.error('Send booking confirmation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send payment confirmation
router.post('/payment-confirmation', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('user');
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const result = await notificationService.sendPaymentConfirmation(booking, booking.user);
    
    res.json({ 
      success: true, 
      message: 'Payment confirmation sent successfully',
      result 
    });
  } catch (error) {
    console.error('Send payment confirmation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send reminder
router.post('/reminder', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('user');
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const result = await notificationService.sendReminder(booking, booking.user);
    
    res.json({ 
      success: true, 
      message: 'Reminder sent successfully',
      result 
    });
  } catch (error) {
    console.error('Send reminder error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send welcome email
router.post('/welcome', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const result = await notificationService.sendWelcomeEmail(user);
    
    res.json({ 
      success: true, 
      message: 'Welcome email sent successfully',
      result 
    });
  } catch (error) {
    console.error('Send welcome email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send password reset email
router.post('/password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Generate reset token (you'll need to add this to your User model)
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const result = await notificationService.sendPasswordResetEmail(user, resetToken);
    
    res.json({ 
      success: true, 
      message: 'Password reset email sent successfully',
      result 
    });
  } catch (error) {
    console.error('Send password reset error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send admin notification
router.post('/admin', requireAdmin, async (req, res) => {
  try {
    const { subject, message, priority } = req.body;
    
    const result = await notificationService.sendAdminNotification(subject, message, priority);
    
    res.json({ 
      success: true, 
      message: 'Admin notification sent successfully',
      result 
    });
  } catch (error) {
    console.error('Send admin notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send SMS
router.post('/sms', authenticate, async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    
    if (!phoneNumber || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number and message are required' 
      });
    }

    const result = await notificationService.sendSMS(phoneNumber, message);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'SMS sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send email
router.post('/email', authenticate, async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    
    if (!to || !subject || !html) {
      return res.status(400).json({ 
        success: false, 
        error: 'To, subject, and html are required' 
      });
    }

    const result = await notificationService.sendEmail(to, subject, html);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Email sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send bulk notifications (admin only)
router.post('/bulk', requireAdmin, async (req, res) => {
  try {
    const { type, message, subject, users } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Type and message are required' 
      });
    }

    let results = [];
    let successCount = 0;
    let errorCount = 0;

    // Get users if not provided
    let targetUsers = users;
    if (!targetUsers) {
      targetUsers = await User.find({});
    }

    for (const user of targetUsers) {
      try {
        let result;
        
        switch (type) {
          case 'email':
            result = await notificationService.sendEmail(
              user.email, 
              subject || 'Notification from Arba Minch Tourism', 
              message
            );
            break;
          case 'sms':
            if (user.phone) {
              result = await notificationService.sendSMS(user.phone, message);
            } else {
              result = { success: false, error: 'No phone number' };
            }
            break;
          default:
            result = { success: false, error: 'Invalid notification type' };
        }
        
        results.push({
          userId: user._id,
          email: user.email,
          phone: user.phone,
          success: result.success,
          error: result.error
        });

        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        results.push({
          userId: user._id,
          email: user.email,
          phone: user.phone,
          success: false,
          error: error.message
        });
        errorCount++;
      }
    }

    res.json({
      success: true,
      message: `Bulk notification completed. Success: ${successCount}, Errors: ${errorCount}`,
      results,
      summary: {
        total: results.length,
        success: successCount,
        errors: errorCount
      }
    });
  } catch (error) {
    console.error('Send bulk notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get notification templates
router.get('/templates', authenticate, async (req, res) => {
  try {
    const templates = {
      bookingConfirmation: {
        name: 'Booking Confirmation',
        description: 'Sent when a booking is confirmed',
        variables: ['user.name', 'booking.id', 'booking.totalPrice', 'booking.services']
      },
      paymentConfirmation: {
        name: 'Payment Confirmation',
        description: 'Sent when payment is received',
        variables: ['user.name', 'booking.totalPrice']
      },
      tripReminder: {
        name: 'Trip Reminder',
        description: 'Sent before the trip starts',
        variables: ['user.name', 'booking.arrivalDate', 'booking.flightNumber']
      },
      welcomeEmail: {
        name: 'Welcome Email',
        description: 'Sent when a user registers',
        variables: ['user.name']
      },
      passwordReset: {
        name: 'Password Reset',
        description: 'Sent when user requests password reset',
        variables: ['user.name', 'resetToken']
      }
    };

    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Get notification templates error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test notification (admin only)
router.post('/test', requireAdmin, async (req, res) => {
  try {
    const { type, to, subject, message } = req.body;
    
    let result;
    switch (type) {
      case 'email':
        result = await notificationService.sendEmail(to, subject, message);
        break;
      case 'sms':
        result = await notificationService.sendSMS(to, message);
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid notification type. Use "email" or "sms"' 
        });
    }

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test notification sent successfully',
        result 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
