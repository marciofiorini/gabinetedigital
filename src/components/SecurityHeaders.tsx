
import { useEffect } from 'react';

export const SecurityHeaders = () => {
  useEffect(() => {
    // Set security headers for the application
    const setSecurityHeaders = () => {
      // Content Security Policy
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://xhuazohviheoxibwkozf.supabase.co https://api.ipify.org;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: https:;
        font-src 'self' data:;
        connect-src 'self' https://xhuazohviheoxibwkozf.supabase.co https://api.ipify.org wss://xhuazohviheoxibwkozf.supabase.co;
        media-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
      `.replace(/\s+/g, ' ').trim();
      document.head.appendChild(meta);

      // Referrer Policy
      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerMeta);

      // X-Content-Type-Options
      const contentTypeMeta = document.createElement('meta');
      contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
      contentTypeMeta.content = 'nosniff';
      document.head.appendChild(contentTypeMeta);

      // X-Frame-Options
      const frameMeta = document.createElement('meta');
      frameMeta.httpEquiv = 'X-Frame-Options';
      frameMeta.content = 'DENY';
      document.head.appendChild(frameMeta);

      // X-XSS-Protection
      const xssMeta = document.createElement('meta');
      xssMeta.httpEquiv = 'X-XSS-Protection';
      xssMeta.content = '1; mode=block';
      document.head.appendChild(xssMeta);

      // Permissions Policy
      const permissionsMeta = document.createElement('meta');
      permissionsMeta.httpEquiv = 'Permissions-Policy';
      permissionsMeta.content = 'camera=(), microphone=(), geolocation=(), payment=()';
      document.head.appendChild(permissionsMeta);
    };

    setSecurityHeaders();
  }, []);

  return null;
};
