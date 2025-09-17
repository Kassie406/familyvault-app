import express, { Request, Response } from 'express';
import { requireRecentReauth } from './reauth-middleware.js';

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    orgId?: string;
  };
}

/**
 * Test endpoint that requires step-up authentication
 * This demonstrates the flow: normal auth -> check recent reauth -> step-up if needed
 */
router.get('/download/:docId', requireRecentReauth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { docId } = req.params;
    
    // If we reach here, step-up authentication was successful
    // In a real app, this would generate a secure download URL
    const downloadUrl = `https://example.com/secure-download/${docId}?token=demo-token`;
    
    res.json({
      success: true,
      downloadUrl,
      message: 'Step-up authentication successful! Download authorized.'
    });
  } catch (error) {
    console.error('Test download error:', error);
    res.status(500).json({ error: 'Failed to authorize download' });
  }
});

/**
 * Test endpoint for sharing that requires step-up authentication
 */
router.post('/share', requireRecentReauth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { docId, email } = req.body;
    
    // If we reach here, step-up authentication was successful
    const shareId = `share-${Date.now()}`;
    
    res.json({
      success: true,
      shareId,
      message: `Document shared with ${email} after step-up verification`
    });
  } catch (error) {
    console.error('Test share error:', error);
    res.status(500).json({ error: 'Failed to create share' });
  }
});

/**
 * Test endpoint for billing operations that require step-up authentication
 */
router.post('/billing/update-card', requireRecentReauth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cardLast4 } = req.body;
    
    // If we reach here, step-up authentication was successful
    res.json({
      success: true,
      message: `Payment method ending in ${cardLast4} updated after step-up verification`
    });
  } catch (error) {
    console.error('Test billing error:', error);
    res.status(500).json({ error: 'Failed to update payment method' });
  }
});

export default router;