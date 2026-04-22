const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'ETB',
    enum: ['ETB', 'USD']
  },
  method: {
    type: String,
    required: true,
    enum: ['chapa', 'telebirr', 'cbe', 'awash', 'cash']
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  providerResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  webhookReceivedAt: {
    type: Date
  },
  verifiedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  refundReason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
PaymentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for better query performance
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ booking: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ method: 1 });

// Virtual for formatted amount
PaymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency === 'ETB' ? 'ETB' : 'USD'
  }).format(this.amount);
});

// Virtual for status display
PaymentSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending',
    'completed': 'Completed',
    'failed': 'Failed',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded'
  };
  return statusMap[this.status] || this.status;
});

// Method to check if payment can be refunded
PaymentSchema.methods.canBeRefunded = function() {
  return this.status === 'completed' && !this.refundedAt;
};

// Method to get payment duration
PaymentSchema.methods.getProcessingDuration = function() {
  if (this.verifiedAt && this.createdAt) {
    return this.verifiedAt.getTime() - this.createdAt.getTime();
  }
  return null;
};

// Static method to get payment statistics
PaymentSchema.statics.getStats = async function(userId = null) {
  const matchStage = userId ? { user: mongoose.Types.ObjectId(userId) } : {};
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  const result = {
    total: 0,
    totalAmount: 0,
    pending: { count: 0, amount: 0 },
    completed: { count: 0, amount: 0 },
    failed: { count: 0, amount: 0 },
    cancelled: { count: 0, amount: 0 },
    refunded: { count: 0, amount: 0 }
  };

  stats.forEach(stat => {
    result[stat._id] = {
      count: stat.count,
      amount: stat.totalAmount
    };
    result.total += stat.count;
    result.totalAmount += stat.totalAmount;
  });

  return result;
};

// Static method to get method statistics
PaymentSchema.statics.getMethodStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$method',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        successCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        }
      }
    }
  ]);

  return stats.map(stat => ({
    method: stat._id,
    count: stat.count,
    totalAmount: stat.totalAmount,
    successCount: stat.successCount,
    successRate: ((stat.successCount / stat.count) * 100).toFixed(2)
  }));
};

// Static method to get daily revenue
PaymentSchema.statics.getDailyRevenue = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const revenue = await this.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  return revenue;
};

// Ensure virtuals are included in JSON output
PaymentSchema.set('toJSON', { virtuals: true });
PaymentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Payment', PaymentSchema);
