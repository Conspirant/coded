import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ error: 'Razorpay API credentials are not configured' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Check for missing fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment verification fields' });
    }

    // Generate expected signature using HMAC-SHA256
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Compare signatures
    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: 'Payment verification successful',
      });
    } else {
      console.warn('Razorpay signature verification failed. Generated:', generatedSignature, 'Received:', razorpay_signature);
      return res.status(400).json({
        success: false,
        error: 'Signature mismatch. Verification failed.',
      });
    }
  } catch (error: unknown) {
    console.error('Razorpay signature verification error:', error);
    const err = error as { message?: string };
    return res.status(500).json({
      error: 'Internal server error during verification',
      details: err.message || String(error),
    });
  }
}
