
import { SecurityUtils } from '@/utils/security';

export const useAuthValidation = () => {
  const validateSignIn = (email: string, password: string) => {
    const sanitizedEmail = SecurityUtils.sanitizeInput(email);
    const emailValidation = SecurityUtils.validateInput(sanitizedEmail, 'email');
    
    return {
      sanitizedEmail,
      isValid: emailValidation.isValid,
      errors: emailValidation.errors
    };
  };

  const validateSignUp = (email: string, password: string, name?: string) => {
    const sanitizedEmail = SecurityUtils.sanitizeInput(email);
    const sanitizedName = name ? SecurityUtils.sanitizeInput(name) : '';
    
    const emailValidation = SecurityUtils.validateInput(sanitizedEmail, 'email');
    const passwordValidation = SecurityUtils.validateInput(password, 'password');

    return {
      sanitizedEmail,
      sanitizedName,
      isValid: emailValidation.isValid && passwordValidation.isValid,
      errors: [...emailValidation.errors, ...passwordValidation.errors]
    };
  };

  const validatePasswordReset = (email: string) => {
    const sanitizedEmail = SecurityUtils.sanitizeInput(email);
    const emailValidation = SecurityUtils.validateInput(sanitizedEmail, 'email');

    return {
      sanitizedEmail,
      isValid: emailValidation.isValid,
      errors: emailValidation.errors
    };
  };

  return {
    validateSignIn,
    validateSignUp,
    validatePasswordReset
  };
};
