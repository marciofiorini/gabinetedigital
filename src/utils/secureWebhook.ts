
import crypto from 'crypto';

export class SecureWebhook {
  private static readonly WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';
  private static readonly MAX_TIMESTAMP_DIFF = 5 * 60 * 1000; // 5 minutes

  static verifySignature(payload: string, signature: string, timestamp: string): boolean {
    try {
      // Verify timestamp to prevent replay attacks
      const timestampMs = parseInt(timestamp) * 1000;
      const now = Date.now();
      
      if (Math.abs(now - timestampMs) > this.MAX_TIMESTAMP_DIFF) {
        console.warn('Webhook timestamp too old');
        return false;
      }

      // Create expected signature
      const expectedSignature = crypto
        .createHmac('sha256', this.WEBHOOK_SECRET)
        .update(timestamp + '.' + payload)
        .digest('hex');

      // Compare signatures using timing-safe comparison
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  static sanitizeWebhookData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return {};
    }

    const sanitized: any = {};
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (typeof value === 'string') {
        // Remove potential XSS and injection patterns
        sanitized[key] = value
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeWebhookData(item) : item
        );
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeWebhookData(value);
      }
    });

    return sanitized;
  }

  static rateLimiter = (() => {
    const requests = new Map<string, number[]>();
    const WINDOW_SIZE = 60 * 1000; // 1 minute
    const MAX_REQUESTS = 100;

    return {
      isAllowed: (identifier: string): boolean => {
        const now = Date.now();
        const windowStart = now - WINDOW_SIZE;
        
        if (!requests.has(identifier)) {
          requests.set(identifier, []);
        }
        
        const userRequests = requests.get(identifier)!;
        
        // Remove old requests
        const validRequests = userRequests.filter(time => time > windowStart);
        requests.set(identifier, validRequests);
        
        if (validRequests.length >= MAX_REQUESTS) {
          return false;
        }
        
        validRequests.push(now);
        return true;
      }
    };
  })();
}
