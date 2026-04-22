const express = require('express');
const router = express.Router();
const { ChapaPayment, TelebirrPayment, PaymentService, verifyWebhookSignature, mapPaymentStatus, validatePaymentData } = require('../services/payment');
const { authenticate } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

const paymentService = new PaymentService();

// Initialize payment
router.post('/initialize', authenticate, async (req, res) => {
  try {
    const { bookingId, paymentMethod, amount, phoneNumber } = req.body;
    
    // Validate payment data
    const validation = validatePaymentData({
      amount,
      email: req.user.email,
      first_name: req.user.name,
      phoneNumber
    });

    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    // Get booking details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    // Check if payment method is supported
    if (!paymentService.isMethodSupported(paymentMethod)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment method not supported',
        supportedMethods: paymentService.getSupportedMethods()
      });
    }

    // Initialize payment with provider
    const result = await paymentService.initializePayment(paymentMethod, {
      amount,
      email: req.user.email,
      first_name: req.user.name,
      last_name: '',
      service_name: 'Arba Minch Tourism Booking',
      phoneNumber
    });

    if (result.success) {
      // Create payment record
      const payment = new Payment({
        booking: bookingId,
        user: req.user.id,
        amount,
        currency: 'ETB',
        method: paymentMethod,
        reference: result.data.tx_ref || result.data.transactionId,
        status: 'pending',
        providerResponse: result.data
      });

      await payment.save();

      // Update booking with payment reference
      booking.paymentReference = payment.reference;
      booking.paymentStatus = 'pending';
      await booking.save();
      
      res.json({ 
        success: true, 
        checkoutUrl: result.data.data?.checkout_url || result.data.checkoutUrl,
        paymentId: payment.reference,
        paymentMethod
      });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify payment (for Chapa)
router.get('/verify/:tx_ref', async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    const result = await paymentService.verifyPayment('chapa', tx_ref);
    
    if (result.success && result.data.data.status === 'success') {
      // Update payment record
      await Payment.findOneAndUpdate(
        { reference: tx_ref },
        { 
          status: 'completed',
          providerResponse: result.data,
          verifiedAt: new Date()
        }
      );

      // Update booking status
      await Booking.findOneAndUpdate(
        { paymentReference: tx_ref },
        { 
          paymentStatus: 'completed', 
          status: 'confirmed',
          confirmedAt: new Date()
        }
      );

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      // Update payment as failed
      await Payment.findOneAndUpdate(
        { reference: tx_ref },
        { 
          status: 'failed',
          providerResponse: result.data,
          verifiedAt: new Date()
        }
      );

      res.json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chapa webhook
router.post('/chapa/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-chapa-signature'];
    const payload = req.body;

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, process.env.CHAPA_SECRET_KEY)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { tx_ref, status } = payload;

    // Update payment record
    await Payment.findOneAndUpdate(
      { reference: tx_ref },
      { 
        status: mapPaymentStatus(status),
        providerResponse: payload,
        webhookReceivedAt: new Date()
      }
    );

    // Update booking if payment is successful
    if (status === 'success') {
      await Booking.findOneAndUpdate(
        { paymentReference: tx_ref },
        { 
          paymentStatus: 'completed', 
          status: 'confirmed',
          confirmedAt: new Date()
        }
      );
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Chapa webhook error:', error);
    res.status(500).send('Error');
  }
});

// Telebirr callback
router.post('/telebirr-callback', async (req, res) => {
  try {
    const { transactionId, status, amount } = req.body;

    // Update payment record
    await Payment.findOneAndUpdate(
      { reference: transactionId },
      { 
        status: mapPaymentStatus(status),
        providerResponse: req.body,
        webhookReceivedAt: new Date()
      }
    );

    // Update booking if payment is successful
    if (status === 'SUCCESS') {
      await Booking.findOneAndUpdate(
        { paymentReference: transactionId },
        { 
          paymentStatus: 'completed', 
          status: 'confirmed',
          confirmedAt: new Date()
        }
      );
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Telebirr callback error:', error);
    res.status(500).send('Error');
  }
});

// Get payment status
router.get('/status/:reference', authenticate, async (req, res) => {
  try {
    const { reference } = req.params;
    
    const payment = await Payment.findOne({ reference })
      .populate('booking', 'bookingReference status')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    // Check if payment belongs to user
    if (payment.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user payment history
router.get('/history', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { user: req.user.id };
    if (status) {
      filter.status = status;
    }

    const payments = await Payment.find(filter)
      .populate('booking', 'bookingReference')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);

    res.json({
      success: true,
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get supported payment methods
router.get('/methods', (req, res) => {
  try {
    const methods = paymentService.getSupportedMethods();
    
    res.json({
      success: true,
      methods: methods.map(method => ({
        id: method,
        name: method.charAt(0).toUpperCase() + method.slice(1),
        description: getPaymentMethodDescription(method),
        supported: true
      }))
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Refund payment (admin only)
router.post('/refund/:reference', authenticate, async (req, res) => {
  try {
    const { reference } = req.params;
    const { reason } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const payment = await Payment.findOne({ reference });
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ success: false, error: 'Only completed payments can be refunded' });
    }

    // Update payment as refunded
    payment.status = 'refunded';
    payment.refundedAt = new Date();
    payment.refundReason = reason;
    await payment.save();

    // Update booking status
    await Booking.findByIdAndUpdate(payment.booking, {
      status: 'refunded',
      refundedAt: new Date()
    });

    res.json({ success: true, message: 'Payment refunded successfully' });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to get payment method descriptions
function getPaymentMethodDescription(method) {
  const descriptions = {
    chapa: 'Pay with Ethiopian digital payment gateway',
    telebirr: 'Pay with Ethiopian Telecom mobile money',
    cbe: 'Pay with Commercial Bank of Ethiopia',
    awash: 'Pay with Awash Bank'
  };
  
  return descriptions[method] || 'Payment method';
}

module.exports = router;
