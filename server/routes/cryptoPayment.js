const express = require('express');
const router = express.Router();
const cryptoPayment = require('../services/cryptoPayment');
const Booking = require('../models/Booking');
const { authenticate } = require('../middleware/auth');

// Create crypto payment
router.post('/create', authenticate, async (req, res) => {
  try {
    const { bookingId, method } = req.body;

    if (!bookingId || !method) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID and payment method are required'
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Create payment
    const paymentResult = await cryptoPayment.createPayment(booking, method);

    if (!paymentResult.success) {
      return res.status(400).json(paymentResult);
    }

    // Update booking with payment info
    booking.paymentMethod = method;
    booking.paymentStatus = 'pending';
    booking.paymentId = paymentResult.payment.id;
    booking.paymentUrl = paymentResult.payment.url;
    booking.paymentExpiresAt = paymentResult.payment.expiresAt;
    await booking.save();

    res.json({
      success: true,
      payment: paymentResult.payment,
      message: paymentResult.message,
      booking: {
        id: booking._id,
        totalPrice: booking.totalPrice,
        currency: booking.currency || 'USD'
      }
    });

  } catch (error) {
    console.error('Error creating crypto payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment'
    });
  }
});

// Verify payment
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { method, paymentId, bookingId } = req.body;

    if (!method || !paymentId || !bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Method, payment ID, and booking ID are required'
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify payment
    const verificationResult = await cryptoPayment.verifyPayment(method, paymentId);

    if (!verificationResult.success) {
      return res.status(400).json(verificationResult);
    }

    // Update booking status
    if (verificationResult.confirmed) {
      booking.paymentStatus = 'completed';
      booking.status = 'confirmed';
      booking.paidAt = new Date();
      booking.verificationData = verificationResult.details;
    } else {
      booking.paymentStatus = 'failed';
    }

    await booking.save();

    res.json({
      success: true,
      verified: verificationResult.confirmed,
      status: verificationResult.status,
      booking: {
        id: booking._id,
        paymentStatus: booking.paymentStatus,
        status: booking.status,
        paidAt: booking.paidAt
      },
      verification: verificationResult
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment'
    });
  }
});

// Get payment status
router.get('/status/:bookingId', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get payment status if payment exists
    let paymentStatus = null;
    if (booking.paymentId && booking.paymentMethod) {
      paymentStatus = await cryptoPayment.getPaymentStatus(
        booking.paymentMethod, 
        booking.paymentId
      );
    }

    res.json({
      success: true,
      booking: {
        id: booking._id,
        totalPrice: booking.totalPrice,
        currency: booking.currency || 'USD',
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        paymentId: booking.paymentId,
        paymentUrl: booking.paymentUrl,
        paymentExpiresAt: booking.paymentExpiresAt,
        status: booking.status,
        paidAt: booking.paidAt
      },
      paymentStatus
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status'
    });
  }
});

// Get supported payment methods
router.get('/methods', async (req, res) => {
  try {
    const methods = cryptoPayment.getSupportedMethods();
    
    res.json({
      success: true,
      methods
    });

  } catch (error) {
    console.error('Error getting payment methods:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment methods'
    });
  }
});

// Calculate exchange rates
router.post('/exchange-rate', async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;

    if (!amount || !fromCurrency || !toCurrency) {
      return res.status(400).json({
        success: false,
        error: 'Amount, from currency, and to currency are required'
      });
    }

    const exchangeResult = cryptoPayment.calculateExchangeRates(
      amount, 
      fromCurrency, 
      toCurrency
    );

    res.json({
      success: true,
      exchange: exchangeResult
    });

  } catch (error) {
    console.error('Error calculating exchange rate:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate exchange rate'
    });
  }
});

// Webhook for payment notifications (for production use)
router.post('/webhook/:method', async (req, res) => {
  try {
    const { method } = req.params;
    const webhookData = req.body;

    console.log(`Received webhook for ${method}:`, webhookData);

    // Process webhook based on method
    // This would handle real-time payment notifications from payment providers
    
    res.json({
      success: true,
      message: 'Webhook received'
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

// Cancel payment
router.post('/cancel/:bookingId', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Can only cancel pending payments
    if (booking.paymentStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel payment that is not pending'
      });
    }

    // Cancel payment (in production, this would call the payment provider's cancel API)
    booking.paymentStatus = 'cancelled';
    booking.paymentId = null;
    booking.paymentUrl = null;
    booking.paymentExpiresAt = null;
    await booking.save();

    res.json({
      success: true,
      message: 'Payment cancelled successfully',
      booking: {
        id: booking._id,
        paymentStatus: booking.paymentStatus
      }
    });

  } catch (error) {
    console.error('Error cancelling payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel payment'
    });
  }
});

module.exports = router;
