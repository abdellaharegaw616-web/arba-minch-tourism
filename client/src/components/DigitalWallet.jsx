import React, { useState, useEffect } from 'react';
import './DigitalWallet.css';

const DigitalWallet = ({ amount, onPaymentComplete, bookingId }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [showCryptoOptions, setShowCryptoOptions] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  // Fetch payment methods on component mount
  useEffect(() => {
    fetchPaymentMethods();
    fetchExchangeRates();
    fetchWalletBalance();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/crypto-payment/methods');
      const data = await response.json();
      if (data.success) {
        setPaymentMethods(data.methods);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Fallback methods
      setPaymentMethods([
        { id: 'chapa', name: 'Chapa', icon: '💳', description: 'Ethiopian payment gateway', currencies: ['ETB', 'USD'], fees: { type: 'percentage', value: 2.5 } },
        { id: 'telebirr', name: 'Telebirr', icon: '📱', description: 'Mobile money', currencies: ['ETB'], fees: { type: 'fixed', value: 5 } },
        { id: 'crypto', name: 'Cryptocurrency', icon: '🪙', description: 'BTC, ETH, USDT', currencies: ['BTC', 'ETH', 'USDT'], fees: { type: 'percentage', value: 1.5 } },
        { id: 'cbe', name: 'CBE Mobile', icon: '🏦', description: 'Commercial Bank of Ethiopia', currencies: ['ETB'], fees: { type: 'fixed', value: 10 } },
        { id: 'awash', name: 'Awash Bank', icon: '🏛️', description: 'Awash Bank digital services', currencies: ['ETB'], fees: { type: 'fixed', value: 8 } }
      ]);
    }
  };

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/crypto-payment/exchange-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1,
          fromCurrency: 'USD',
          toCurrency: 'ETB'
        })
      });
      const data = await response.json();
      if (data.success) {
        setExchangeRates({
          'USD-ETB': data.exchange.convertedAmount,
          'ETB-USD': 1 / data.exchange.convertedAmount
        });
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Fallback rates
      setExchangeRates({ 'USD-ETB': 55, 'ETB-USD': 1/55 });
    }
  };

  const fetchWalletBalance = async () => {
    try {
      // Simulate fetching wallet balance
      setWalletBalance(Math.floor(Math.random() * 1000) + 100);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance(0);
    }
  };

  const processPayment = async () => {
    if (!selectedMethod) return;

    setProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/crypto-payment/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: bookingId || 'demo-booking-' + Date.now(),
          method: selectedMethod === 'crypto' ? `${selectedCrypto.toLowerCase()}-payment` : selectedMethod
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.payment.url) {
          // Redirect to payment provider
          window.open(data.payment.url, '_blank');
          // In a real app, you'd handle the callback
          setTimeout(() => {
            onPaymentComplete && onPaymentComplete(data);
          }, 2000);
        } else {
          onPaymentComplete && onPaymentComplete(data);
        }
      } else {
        alert('Payment failed: ' + data.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotalAmount = () => {
    if (!selectedMethod || !paymentMethods.length) return amount;

    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return amount;

    let fee = 0;
    if (method.fees.type === 'percentage') {
      fee = amount * (method.fees.value / 100);
    } else {
      // Fixed fee - convert to USD if needed
      fee = method.fees.value / (exchangeRates['USD-ETB'] || 55);
    }

    return amount + fee;
  };

  const getConvertedAmount = (currency) => {
    if (currency === 'ETB') {
      return (amount * (exchangeRates['USD-ETB'] || 55)).toFixed(2);
    }
    return amount.toFixed(2);
  };

  const cryptoOptions = [
    { id: 'BTC', name: 'Bitcoin', icon: '₿' },
    { id: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { id: 'USDT', name: 'Tether', icon: '₮' }
  ];

  return (
    <div className="digital-wallet">
      <div className="wallet-header">
        <h2>💰 Digital Wallet</h2>
        <div className="wallet-balance">
          <span className="balance-label">Platform Balance:</span>
          <span className="balance-amount">${walletBalance.toFixed(2)}</span>
        </div>
      </div>

      <div className="amount-display">
        <div className="amount-info">
          <span className="amount-label">Total Amount:</span>
          <span className="amount-value">${amount.toFixed(2)} USD</span>
        </div>
        <div className="amount-converted">
          <span className="converted-amount">≈ {getConvertedAmount('ETB')} ETB</span>
        </div>
      </div>

      <div className="payment-methods">
        <h3>Choose Payment Method</h3>
        
        <div className="methods-grid">
          {paymentMethods.map(method => (
            <div
              key={method.id}
              onClick={() => {
                setSelectedMethod(method.id);
                if (method.id === 'crypto') {
                  setShowCryptoOptions(true);
                } else {
                  setShowCryptoOptions(false);
                }
              }}
              className={`method-card ${selectedMethod === method.id ? 'selected' : ''}`}
            >
              <div className="method-icon">{method.icon}</div>
              <div className="method-info">
                <h4>{method.name}</h4>
                <p>{method.description}</p>
                <div className="method-details">
                  <span className="currencies">{method.currencies?.join(', ') || 'USD'}</span>
                  <span className="fees">
                    Fee: {method.fees?.type === 'percentage' 
                      ? `${method.fees.value}%` 
                      : `${method.fees.value} ETB`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Crypto Options */}
        {showCryptoOptions && selectedMethod === 'crypto' && (
          <div className="crypto-options">
            <h4>Select Cryptocurrency</h4>
            <div className="crypto-grid">
              {cryptoOptions.map(crypto => (
                <div
                  key={crypto.id}
                  onClick={() => setSelectedCrypto(crypto.id)}
                  className={`crypto-option ${selectedCrypto === crypto.id ? 'selected' : ''}`}
                >
                  <span className="crypto-icon">{crypto.icon}</span>
                  <span className="crypto-name">{crypto.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Summary */}
      {selectedMethod && (
        <div className="payment-summary">
          <h4>Payment Summary</h4>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Processing Fee:</span>
            <span>${(calculateTotalAmount() - amount).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${calculateTotalAmount().toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="wallet-actions">
        <button
          onClick={processPayment}
          disabled={!selectedMethod || processing}
          className="pay-button"
        >
          {processing ? (
            <span className="processing-spinner">⏳ Processing...</span>
          ) : (
            <span>Pay ${calculateTotalAmount().toFixed(2)}</span>
          )}
        </button>

        <button className="add-funds-button">
          💳 Add Funds to Wallet
        </button>
      </div>

      {/* Security Info */}
      <div className="security-info">
        <div className="security-icon">🔒</div>
        <div className="security-text">
          <p>Secure payment powered by:</p>
          <div className="payment-providers">
            <span>Chapa</span>
            <span>Telebirr</span>
            <span>Coinbase</span>
            <span>CBE</span>
            <span>Awash</span>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="help-section">
        <h4>Need Help?</h4>
        <div className="help-links">
          <button className="help-link">📞 Payment Support</button>
          <button className="help-link">💬 Live Chat</button>
          <button className="help-link">📚 Payment Guide</button>
        </div>
      </div>
    </div>
  );
};

export default DigitalWallet;
