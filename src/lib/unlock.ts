import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = 'kcet_unlocked';
const EVENT_NAME = 'kcet-unlock-state-change';

// Set of valid keys (case-insensitive & trimmed)
const VALID_KEYS = new Set<string>([
  // No hardcoded keys for security. Only dynamic DB access codes.
]);

let globalPaywallDisabled = false;

export function setGlobalPaywallDisabled(disabled: boolean) {
  globalPaywallDisabled = disabled;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { unlocked: isUnlocked() } }));
}

export function isUnlocked(): boolean {
  if (globalPaywallDisabled) return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function unlockGlobally() {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { unlocked: true } }));
}

export function validateAndUnlock(key: string): boolean {
  const normalizedKey = key.trim().toUpperCase();
  if (VALID_KEYS.has(normalizedKey)) {
    unlockGlobally();
    return true;
  }
  return false;
}

export async function verifyAndUnlockAccessKey(keyInput: string): Promise<{ success: boolean; error?: string }> {
  const inputKey = keyInput.trim();
  if (!inputKey) {
    return { success: false, error: 'Please enter an access key.' };
  }

  // 1. Check static local keys
  if (validateAndUnlock(inputKey)) {
    return { success: true };
  }

  // 2. Check in database
  const uppercaseKey = inputKey.toUpperCase().replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, '-');
  try {
    const { data, error } = await supabase
      .from('access_codes' as any)
      .select('*')
      .eq('code', uppercaseKey)
      .maybeSingle();

    if (error) {
      console.error('Db fetch error:', error);
      return { success: false, error: 'Verification error. Please check your internet connection.' };
    }

    if (!data) {
      return { success: false, error: 'Invalid access key. Please check and try again.' };
    }

    if ((data as any).is_used) {
      return { success: false, error: 'This access key has already been used on another device.' };
    }

    // 3. Mark as used in database
    const { error: updateError } = await supabase
      .from('access_codes' as any)
      .update({ 
        is_used: true, 
        used_at: new Date().toISOString() 
      })
      .eq('code', uppercaseKey);

    if (updateError) {
      console.error('Db update error:', updateError);
      return { success: false, error: 'Failed to redeem the code. Please try again.' };
    }

    // 4. Unlock globally
    unlockGlobally();
    return { success: true };
  } catch (err: any) {
    console.error('Key validation exception:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

export function lockFeatures() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { unlocked: isUnlocked() } }));
}

export function subscribeToUnlockState(callback: (unlocked: boolean) => void) {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent;
    callback(customEvent.detail.unlocked);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

export async function initiatePremiumPayment(onSuccess: () => void, onFailure: () => void) {
  if (typeof (window as any).Razorpay === 'undefined') {
    toast.error('Razorpay SDK not loaded. Please disable content blockers or reload the page.');
    onFailure();
    return;
  }

  try {
    const paiseAmount = 1900; // ₹19
    // Step 1: Create Order
    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: paiseAmount })
    });

    if (!orderRes.ok) {
      const errData = await orderRes.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${orderRes.status}`);
    }

    const order = await orderRes.json();

    // Step 2: Open Razorpay Checkout Modal
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "KCET Coded",
      description: "Unlock Premium Counseling Features",
      order_id: order.order_id,
      handler: async function (response: any) {
        try {
          // Step 3: Verify Payment Signature
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          });

          const verifyData = await verifyRes.json().catch(() => ({}));

          if (verifyRes.ok && verifyData.success) {
            unlockGlobally(); // Automatically unlocks globally
            toast.success('Successfully unlocked all premium features!', {
              description: 'You now have full access to early tools.'
            });
            onSuccess();
          } else {
            toast.error('Verification failed', {
              description: verifyData.error || "Could not verify your payment signature."
            });
            onFailure();
          }
        } catch (err: any) {
          toast.error('Verification error', {
            description: err.message || "An error occurred while verifying the payment."
          });
          onFailure();
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#10b981", // emerald-500
      },
      modal: {
        ondismiss: function () {
          toast.error('Payment Cancelled', {
            description: "Left midway? Did it fail? Contact me on Reddit if you're facing any issues.",
            duration: 10000,
            position: 'top-center',
            action: {
              label: 'Contact Me',
              onClick: () => window.open('https://www.reddit.com/user/Elegant_Compote9073/', '_blank')
            }
          });
          onFailure();
        }
      }
    };

    const RazorpayClass = (window as any).Razorpay;
    const rzp = new RazorpayClass(options);
    rzp.on('payment.failed', function (response: any) {
      toast.error('Payment failed', {
        description: response.error?.description || "Did it fail? Contact me on Reddit if you're facing any issues.",
        duration: 10000,
        position: 'top-center',
        action: {
          label: 'Contact Me',
          onClick: () => window.open('https://www.reddit.com/user/Elegant_Compote9073/', '_blank')
        }
      });
      onFailure();
    });

    rzp.open();
  } catch (err: any) {
    console.error('Payment checkout initiation failed:', err);
    toast.error('Checkout failed', {
      description: err.message || "Could not connect to server or initiate payment."
    });
    onFailure();
  }
}
