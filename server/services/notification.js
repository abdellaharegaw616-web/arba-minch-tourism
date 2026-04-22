const nodemailer = require('nodemailer');
const twilio = require('twilio');

class NotificationService {
  constructor() {
    // Email setup
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      console.log('📧 Email service initialized');
    } else {
      console.log('⚠️ Email not configured - skipping email notifications');
    }

    // SMS setup - only if Twilio credentials exist
    if (process.env.TWILIO_ACCOUNT_SID && 
        process.env.TWILIO_AUTH_TOKEN && 
        process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
      try {
        this.twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        console.log('📱 SMS service initialized');
      } catch (error) {
        console.log('⚠️ Twilio initialization failed:', error.message);
      }
    } else {
      console.log('⚠️ SMS not configured - skipping SMS notifications');
    }
  }

  async sendBookingConfirmation(booking, user) {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #15803d, #065f46); color: white; padding: 20px; text-align: center;">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Welcome to Arba Minch Tourism</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Hello ${user.name}!</h2>
          <p>Your booking has been confirmed. Here are your details:</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Total Amount:</strong> $${booking.totalPrice}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            <p><strong>Arrival Date:</strong> ${new Date(booking.arrivalDate).toLocaleDateString()}</p>
          </div>
          
          <h3>Your Services:</h3>
          <ul>
            ${booking.services.map(s => `<li>${s.icon} ${s.name} - $${s.price}</li>`).join('')}
          </ul>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>📞 Need help?</strong> Contact us 24/7 at +251-911-111-111</p>
            <p><strong>📍 Airport Pickup:</strong> Look for our guide with your name sign</p>
          </div>
          
          <a href="${process.env.CLIENT_URL}/dashboard" style="background: #15803d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View My Booking
          </a>
        </div>
        
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>Arba Minch Tourist Assistance | 5 Local Guides Ready to Help</p>
          <p>© 2024 All rights reserved</p>
        </div>
      </div>
    `;

    // Send Email
    await this.transporter.sendMail({
      from: `"Arba Minch Tourism" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '✅ Booking Confirmed - Arba Minch Tourism',
      html: emailHtml
    });

    // Send SMS (if phone number provided)
    if (user.phone) {
      await this.twilioClient.messages.create({
        body: `🎉 Booking Confirmed! Welcome to Arba Minch. Booking ID: ${booking._id}. Total: $${booking.totalPrice}. Need help? Call +251-911-111-111`,
        to: user.phone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    }

    return true;
  }

  async sendPaymentConfirmation(booking, user) {
    await this.transporter.sendMail({
      from: `"Arba Minch Tourism" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '💰 Payment Received - Arba Minch Tourism',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #15803d, #065f46); color: white; padding: 20px; text-align: center;">
            <h1>💰 Payment Received!</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Thank you, ${user.name}!</h2>
            <p>Your payment of <strong>$${booking.totalPrice}</strong> has been received successfully.</p>
            <p>We're excited to welcome you to Arba Minch!</p>
          </div>
        </div>
      `
    });
  }

  async sendReminder(booking, user) {
    const daysUntil = Math.ceil((new Date(booking.arrivalDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 3 && daysUntil > 0) {
      await this.transporter.sendMail({
        from: `"Arba Minch Tourism" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '⏰ Your Arba Minch Trip is Coming Soon!',
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Hello ${user.name}!</h2>
            <p>Your trip to Arba Minch starts in ${daysUntil} day${daysUntil > 1 ? 's' : ''}!</p>
            <p>Please confirm your arrival details:</p>
            <ul>
              <li>Flight: ${booking.flightNumber || 'Not provided'}</li>
              <li>Arrival: ${new Date(booking.arrivalDate).toLocaleDateString()}</li>
            </ul>
            <p>Our guide will be waiting for you at airport with a sign.</p>
          </div>
        `
      });
    }
  }

  async sendWelcomeEmail(user) {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #15803d, #065f46); color: white; padding: 20px; text-align: center;">
          <h1>🌴 Welcome to Arba Minch Tourism!</h1>
          <p>Your Gateway to Ethiopia's Natural Paradise</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Hello ${user.name}!</h2>
          <p>Thank you for joining Arba Minch Tourist Assistance. We're excited to help you explore the beautiful lakes, wildlife, and culture of our region.</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>🎯 What We Offer:</h3>
            <ul>
              <li>🏞️ Lake Chamo & Abaya tours</li>
              <li>🐊 Crocodile market visits</li>
              <li>🏔️ Nech Sar National Park</li>
              <li>🏺 Dorze village cultural experiences</li>
              <li>🚤 Boat safaris</li>
              <li>🗣️ Translation services</li>
            </ul>
          </div>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>📞 Get Started:</h3>
            <p>Ready to book your adventure? <a href="${process.env.CLIENT_URL}/services" style="color: #15803d;">Browse our services</a></p>
            <p>Need help? Call us at +251-911-111-111</p>
          </div>
          
          <a href="${process.env.CLIENT_URL}" style="background: #15803d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Explore Arba Minch
          </a>
        </div>
        
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>Arba Minch Tourist Assistance | Your Local Travel Partner</p>
          <p>© 2024 All rights reserved</p>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Arba Minch Tourism" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🌴 Welcome to Arba Minch Tourism!',
      html: emailHtml
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #15803d, #065f46); color: white; padding: 20px; text-align: center;">
          <h1>🔐 Password Reset</h1>
          <p>Arba Minch Tourism</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Hello ${user.name}!</h2>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #15803d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>⚠️ Security Notice:</strong></p>
            <ul>
              <li>This link expires in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <p>Or copy and paste this link:</p>
          <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${resetUrl}
          </p>
        </div>
        
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>Arba Minch Tourist Assistance</p>
          <p>© 2024 All rights reserved</p>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Arba Minch Tourism" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 Password Reset - Arba Minch Tourism',
      html: emailHtml
    });
  }

  async sendAdminNotification(subject, message, priority = 'normal') {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${priority === 'high' ? 'linear-gradient(135deg, #dc2626, #991b1b)' : 'linear-gradient(135deg, #15803d, #065f46)'}; color: white; padding: 20px; text-align: center;">
          <h1>🔔 Admin Notification</h1>
          <p>Arba Minch Tourism Dashboard</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>${subject}</h2>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p>${message}</p>
          </div>
          
          <a href="${process.env.CLIENT_URL}/admin" style="background: #15803d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>Arba Minch Tourist Assistance</p>
          <p>© 2024 All rights reserved</p>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Arba Minch Tourism System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🔔 ${subject} - Arba Minch Tourism`,
      html: emailHtml
    });
  }

  async sendSMS(phoneNumber, message) {
    try {
      await this.twilioClient.messages.create({
        body: message,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
      });
      return { success: true };
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEmail(to, subject, html) {
    try {
      await this.transporter.sendMail({
        from: `"Arba Minch Tourism" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  // Template helper methods
  getBookingStatusColor(status) {
    const colors = {
      'pending': '#f59e0b',
      'confirmed': '#10b981',
      'completed': '#065f46',
      'cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  }

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

module.exports = new NotificationService();
