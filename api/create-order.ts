import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(401).json({ error: 'Razorpay API credentials are not configured' });
  }

  try {
    const { amount, currency = 'INR', receipt } = req.body;

    // Validate amount
    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || !Number.isInteger(numericAmount)) {
      return res.status(400).json({ error: 'Amount must be a valid integer in paise' });
    }

    if (numericAmount < 100) {
      return res.status(400).json({ error: 'Minimum amount must be 100 paise (₹1)' });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: numericAmount, // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: unknown) {
    console.error('Razorpay order creation error:', error);
    const err = error as { statusCode?: number; message?: string };
    
    // Check if authentication failure
    if (err.statusCode === 401 || (err.message && err.message.toLowerCase().includes('auth'))) {
      return res.status(401).json({ error: 'Authentication failure with Razorpay API' });
    }

    return res.status(500).json({
      error: 'Failed to create Razorpay order',
      details: err.message || String(error),
    });
  }
}
