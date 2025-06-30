
// Security utilities for input sanitization and validation
export class SecurityUtils {
  private static readonly XSS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]*onerror[^>]*>/gi,
    /<svg[^>]*onload[^>]*>/gi,
  ];

  private static readonly SQL_INJECTION_PATTERNS = [
    /('|(\\')|(;)|(\\;)|(\|)|(\*)|(%)|(<)|(>)|(\{)|(\})|(\[)|(\])|(\^)|(`)|(\~)|(!)|(@)|(#)|(\$)|(&)|(\()|(\))|(\+)|(=))/gi,
    /union[\s]+select/gi,
    /drop[\s]+table/gi,
    /insert[\s]+into/gi,
    /delete[\s]+from/gi,
    /update[\s]+set/gi,
    /exec[\s]*\(/gi,
    /script[\s]*\(/gi,
  ];

  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    let sanitized = input.trim();
    
    // Remove XSS patterns
    this.XSS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Encode HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    return sanitized;
  }

  static validateInput(input: string, type: 'email' | 'text' | 'password' | 'phone' | 'url'): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!input || typeof input !== 'string') {
      errors.push('Input inválido');
      return { isValid: false, errors, warnings };
    }

    // Check for potential XSS
    if (this.XSS_PATTERNS.some(pattern => pattern.test(input))) {
      errors.push('Input contém conteúdo potencialmente perigoso');
    }

    // Check for potential SQL injection
    if (this.SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input))) {
      errors.push('Input contém caracteres não permitidos');
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(input)) {
          errors.push('Formato de email inválido');
        }
        if (input.length > 254) {
          errors.push('Email muito longo');
        }
        break;
      
      case 'password':
        if (input.length < 8) {
          errors.push('Senha deve ter pelo menos 8 caracteres');
        }
        if (input.length > 128) {
          errors.push('Senha muito longa');
        }
        if (!/(?=.*[a-z])/.test(input)) {
          errors.push('Senha deve conter pelo menos uma letra minúscula');
        }
        if (!/(?=.*[A-Z])/.test(input)) {
          errors.push('Senha deve conter pelo menos uma letra maiúscula');
        }
        if (!/(?=.*\d)/.test(input)) {
          errors.push('Senha deve conter pelo menos um número');
        }
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(input)) {
          warnings.push('Considere adicionar símbolos especiais para maior segurança');
        }
        if (/(.)\1{2,}/.test(input)) {
          warnings.push('Evite sequências repetitivas na senha');
        }
        break;
      
      case 'text':
        if (input.length > 1000) {
          errors.push('Texto muito longo (máximo 1000 caracteres)');
        }
        break;
      
      case 'phone':
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (!phoneRegex.test(input)) {
          errors.push('Formato de telefone inválido. Use: (XX) XXXXX-XXXX');
        }
        break;
      
      case 'url':
        try {
          new URL(input);
        } catch {
          errors.push('URL inválida');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const cryptoArray = new Uint8Array(length);
    crypto.getRandomValues(cryptoArray);
    
    for (let i = 0; i < length; i++) {
      result += chars[cryptoArray[i] % chars.length];
    }
    
    return result;
  }

  static hashPassword(password: string): Promise<string> {
    // This would typically use bcrypt or similar, but for client-side we'll use a simple hash
    // In production, password hashing should be done server-side
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
      .then(buffer => Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(''));
  }

  static rateLimit = (() => {
    const attempts = new Map<string, { count: number; lastAttempt: number; blocked: boolean }>();
    const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
    const MAX_ATTEMPTS = 5;
    const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes

    return {
      check: (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
        const now = Date.now();
        const record = attempts.get(identifier);

        if (!record) {
          attempts.set(identifier, { count: 1, lastAttempt: now, blocked: false });
          return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetTime: now + RATE_LIMIT_WINDOW };
        }

        // Check if block period has expired
        if (record.blocked && (now - record.lastAttempt) > BLOCK_DURATION) {
          record.blocked = false;
          record.count = 0;
        }

        // Check if rate limit window has expired
        if ((now - record.lastAttempt) > RATE_LIMIT_WINDOW) {
          record.count = 0;
          record.blocked = false;
        }

        if (record.blocked) {
          return { allowed: false, remaining: 0, resetTime: record.lastAttempt + BLOCK_DURATION };
        }

        record.count++;
        record.lastAttempt = now;

        if (record.count > MAX_ATTEMPTS) {
          record.blocked = true;
          return { allowed: false, remaining: 0, resetTime: now + BLOCK_DURATION };
        }

        return { 
          allowed: true, 
          remaining: MAX_ATTEMPTS - record.count, 
          resetTime: now + RATE_LIMIT_WINDOW 
        };
      },

      reset: (identifier: string): void => {
        attempts.delete(identifier);
      }
    };
  })();
}
