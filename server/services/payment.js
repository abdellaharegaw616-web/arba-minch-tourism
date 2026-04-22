const axios = require('axios');
const crypto = require('crypto');

// Chapa Payment Integration
class ChapaPayment {
  constructor() {
    this.secretKey = process.env.CHAPA_SECRET_KEY;
    this.baseURL = 'https://api.chapa.co/v1';
  }

  async initializePayment(data) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        {
          amount: data.amount,
          currency: 'ETB',
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          tx_ref: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          callback_url: `${process.env.APP_URL}/api/payment/verify`,
          return_url: `${process.env.CLIENT_URL}/payment-success`,
          customization: {
            title: 'Arba Minch Tourism',
            description: `Payment for ${data.service_name}` 
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Chapa payment error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || 'Payment failed' };
    }
  }

  async verifyPayment(tx_ref) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${tx_ref}`,
        {
          headers: { 'Authorization': `Bearer ${this.secretKey}` }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Telebirr Integration (Ethiopian Telecom)
class TelebirrPayment {
  constructor() {
    this.appId = process.env.TELEBIRR_APP_ID;
    this.appKey = process.env.TELEBIRR_APP_KEY;
    this.shortCode = process.env.TELEBIRR_SHORT_CODE;
  }

  async initializePayment(data) {
    try {
      const timestamp = Date.now();
      const nonce = crypto.randomBytes(16).toString('hex');
      const signature = crypto
        .createHash('sha256')
        .update(`${this.appId}${data.amount}${timestamp}${nonce}${this.appKey}`)
        .digest('hex');

      const response = await axios.post(
        'https://api.telebirr.com/v1/payment/initialize',
        {
          appId: this.appId,
          amount: data.amount,
          shortCode: this.shortCode,
          phoneNumber: data.phoneNumber,
          transactionId: `TXN${Date.now()}`,
          timestamp,
          nonce,
          signature,
          notifyUrl: `${process.env.APP_URL}/api/payment/telebirr-callback` 
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// CBE Birr Integration (Commercial Bank of Ethiopia)
class CBEPayment {
  constructor() {
    this.merchantId = process.env.CBE_MERCHANT_ID;
    this.apiKey = process.env.CBE_API_KEY;
    this.baseURL = 'https://api.cbe.com.et';
  }

  async initializePayment(data) {
    try {
      const response = await axios.post(
        `${this.baseURL}/payment/initialize`,
        {
          merchantId: this.merchantId,
          amount: data.amount,
          currency: 'ETB',
          orderId: `ORD${Date.now()}`,
          customerEmail: data.email,
          customerName: data.first_name,
          description: `Payment for ${data.service_name}`,
          returnUrl: `${process.env.CLIENT_URL}/payment-success`,
          cancelUrl: `${process.env.CLIENT_URL}/payment-cancelled`
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Awash Bank Integration
class AwashPayment {
  constructor() {
    this.merchantCode = process.env.AWASH_MERCHANT_CODE;
    this.apiKey = process.env.AWASH_API_KEY;
    this.baseURL = 'https://api.awashbank.com.et';
  }

  async initializePayment(data) {
    try {
      const response = await axios.post(
        `${this.baseURL}/payment/initiate`,
        {
          merchantCode: this.merchantCode,
          amount: data.amount,
          currency: 'ETB',
          transactionId: `AWA${Date.now()}`,
          customerEmail: data.email,
          customerName: data.first_name,
          description: `Payment for ${data.service_name}`,
          successUrl: `${process.env.CLIENT_URL}/payment-success`,
          failureUrl: `${process.env.CLIENT_URL}/payment-failed`
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Payment Service Factory
class PaymentService {
  constructor() {
    this.providers = {
      chapa: new ChapaPayment(),
      telebirr: new TelebirrPayment(),
      cbe: new CBEPayment(),
      awash: new AwashPayment()
    };
  }

  async initializePayment(paymentMethod, paymentData) {
    const provider = this.providers[paymentMethod];
    if (!provider) {
      return { success: false, error: 'Payment method not supported' };
    }

    return await provider.initializePayment(paymentData);
  }

  async verifyPayment(paymentMethod, reference) {
    const provider = this.providers[paymentMethod];
    if (!provider || !provider.verifyPayment) {
      return { success: false, error: 'Verification not supported for this method' };
    }

    return await provider.verifyPayment(reference);
  }

  getSupportedMethods() {
    return Object.keys(this.providers);
  }

  isMethodSupported(method) {
    return this.providers.hasOwnProperty(method);
  }
}

// Payment verification utility
const verifyWebhookSignature = (payload, signature, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

// Currency converter (ETB to USD and vice versa)
const convertCurrency = (amount, fromCurrency, toCurrency) => {
  const exchangeRates = {
    ETB_TO_USD: 0.018, // 1 ETB = 0.018 USD (approximate)
    USD_TO_ETB: 55.5    // 1 USD = 55.5 ETB (approximate)
  };

  if (fromCurrency === 'ETB' && toCurrency === 'USD') {
    return amount * exchangeRates.ETB_TO_USD;
  } else if (fromCurrency === 'USD' && toCurrency === 'ETB') {
    return amount * exchangeRates.USD_TO_ETB;
  } else if (fromCurrency === toCurrency) {
    return amount;
  } else {
    throw new Error('Currency conversion not supported');
  }
};

// Payment status mapper
const mapPaymentStatus = (providerStatus) => {
  const statusMap = {
    'success': 'completed',
    'completed': 'completed',
    'pending': 'pending',
    'failed': 'failed',
    'cancelled': 'cancelled',
    'refunded': 'refunded'
  };

  return statusMap[providerStatus.toLowerCase()] || 'pending';
};

// Generate payment reference
const generatePaymentReference = (prefix = 'PAY') => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}${timestamp}${random}`;
};

// Payment validation
const validatePaymentData = (data) => {
  const errors = [];

  if (!data.amount || data.amount <= 0) {
    errors.push('Valid amount is required');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.first_name || data.first_name.trim().length < 2) {
    errors.push('First name is required');
  }

  if (data.phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phoneNumber)) {
    errors.push('Valid phone number is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  ChapaPayment,
  TelebirrPayment,
  CBEPayment,
  AwashPayment,
  PaymentService,
  verifyWebhookSignature,
  convertCurrency,
  mapPaymentStatus,
  generatePaymentReference,
  validatePaymentData
};
