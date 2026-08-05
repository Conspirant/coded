import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://qrdgvugivkqkfilodsbc.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZGd2dWdpdmtxa2ZpbG9kc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDk4MTcsImV4cCI6MjA4NzY4NTgxN30.0DpoalYldwlQT940rtGGcvhH4vpXgfEJKSwADZzLNdk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'CODED-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donor_name, is_anonymous, amount_inr } = req.body;

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
      const accessCode = generateAccessCode();
      const numAmount = Number(amount_inr) || 19;

      // 1. Insert generated access code
      try {
        await supabase.from('access_codes').insert({
          code: accessCode,
          is_used: false,
          payment_id: razorpay_payment_id
        });
      } catch (dbErr) {
        console.error('Failed to insert access_code in verify-payment:', dbErr);
      }

      // 2. Insert donor record
      try {
        await supabase.from('donors').insert({
          display_name: is_anonymous ? 'Anonymous' : (donor_name ? String(donor_name).trim() || 'Anonymous' : 'Anonymous'),
          amount_inr: numAmount,
          is_anonymous: Boolean(is_anonymous || !donor_name || !String(donor_name).trim()),
          payment_id: razorpay_payment_id,
        });
      } catch (dbErr) {
        console.error('Failed to insert donor in verify-payment:', dbErr);
      }

      return res.status(200).json({
        success: true,
        code: accessCode,
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

