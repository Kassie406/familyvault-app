import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

// CSRF protection service for enterprise security
export class CSRFService {
  /**
   * Create CSRF protection middleware with secure cookie configuration
   */
  static createProtection() {
    return csrf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 1000 * 60 * 60 * 2, // 2 hours
      },
      // Use session storage for development, cookie for production
      sessionKey: process.env.NODE_ENV === 'development' ? 'csrfSecret' : undefined,
    });
  }

  /**
   * Middleware to provide CSRF token to frontend
   */
  static tokenProvider() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.locals.csrfToken = (req as any).csrfToken();
      next();
    };
  }

  /**
   * API endpoint to get CSRF token
   */
  static getTokenEndpoint() {
    return (req: Request, res: Response) => {
      try {
        const token = (req as any).csrfToken?.();
        if (!token) {
          return res.status(500).json({ error: 'CSRF token generation failed' });
        }
        res.json({ 
          csrfToken: token,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: 'CSRF token generation failed' });
      }
    };
  }

  /**
   * Error handler for CSRF failures
   */
  static errorHandler() {
    return (err: any, req: Request, res: Response, next: NextFunction) => {
      if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
          error: 'Invalid CSRF token',
          code: 'CSRF_INVALID',
          message: 'Request rejected due to invalid security token'
        });
      }
      next(err);
    };
  }
}

export default CSRFService;