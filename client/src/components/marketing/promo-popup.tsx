import { useState, useEffect } from 'react';
import { X, Gift, Star, Percent, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface PromoPopup {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  promoCode: string;
  discount: string;
  ctaText: string;
  ctaUrl?: string;
  bgGradient: string;
  targetDomains?: string[];
  showAfterSeconds?: number;
  showOncePerSession?: boolean;
  expiresAt?: string;
  isActive: boolean;
}

const STORAGE_KEY = 'fcs-seen-popups';
const SESSION_KEY = 'fcs-session-popups';

export default function PromoPopupManager() {
  const [popup, setPopup] = useState<PromoPopup | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copying, setCopying] = useState(false);
  const [seenPopups, setSeenPopups] = useState<string[]>([]);
  const [sessionPopups, setSessionPopups] = useState<string[]>([]);

  const copyPromoCode = async (code: string) => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(code);
      setTimeout(() => setCopying(false), 2000);
    } catch (error) {
      setCopying(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (popup) {
      const newSeen = [...seenPopups, popup.id];
      setSeenPopups(newSeen);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSeen));
      
      if (popup.showOncePerSession) {
        const newSession = [...sessionPopups, popup.id];
        setSessionPopups(newSession);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      }
    }
  };

  const handleCTA = () => {
    if (popup?.ctaUrl) {
      window.open(popup.ctaUrl, '_blank');
    }
    handleClose();
  };

  const loadActivePopup = async () => {
    try {
      const response = await fetch('/api/marketing/active-popup', { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return;
      
      const activePopup: PromoPopup = await response.json();
      
      // Check if popup was already seen
      if (seenPopups.includes(activePopup.id)) return;
      
      // Check session-based showing
      if (activePopup.showOncePerSession && sessionPopups.includes(activePopup.id)) return;
      
      // Check if popup expired
      if (activePopup.expiresAt && new Date() > new Date(activePopup.expiresAt)) return;
      
      // Check domain targeting
      if (activePopup.targetDomains && activePopup.targetDomains.length > 0) {
        const currentDomain = window.location.hostname;
        const shouldShow = activePopup.targetDomains.some(domain => 
          currentDomain === domain || currentDomain.endsWith(`.${domain}`)
        );
        if (!shouldShow) return;
      }
      
      setPopup(activePopup);
      
      // Show popup after delay
      const delay = activePopup.showAfterSeconds || 3;
      setTimeout(() => {
        setIsOpen(true);
      }, delay * 1000);
      
    } catch (error) {
      console.error('Failed to load promotional popup:', error);
    }
  };

  useEffect(() => {
    // Load seen popups from storage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSeenPopups(JSON.parse(stored));
    }
    
    const sessionStored = sessionStorage.getItem(SESSION_KEY);
    if (sessionStored) {
      setSessionPopups(JSON.parse(sessionStored));
    }
  }, []);

  useEffect(() => {
    loadActivePopup();
  }, [seenPopups, sessionPopups]);

  if (!popup) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="max-w-md mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white border-0 shadow-2xl"
        style={{ background: popup.bgGradient }}
        data-testid="promo-popup"
      >
        <div className="relative p-6">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            data-testid="close-popup"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="text-center space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="p-3 bg-white/20 rounded-full">
                <Gift className="w-8 h-8" />
              </div>
            </div>
            
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold mb-1" data-testid="popup-title">
                {popup.title}
              </h2>
              {popup.subtitle && (
                <p className="text-white/90 text-sm" data-testid="popup-subtitle">
                  {popup.subtitle}
                </p>
              )}
            </div>
            
            {/* Discount Badge */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                <Percent className="w-5 h-5" />
                <span className="font-bold text-lg" data-testid="discount-amount">
                  {popup.discount}
                </span>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-white/90 text-sm" data-testid="popup-description">
              {popup.description}
            </p>
            
            {/* Promo Code */}
            <div className="space-y-2">
              <p className="text-xs text-white/80">Use promo code:</p>
              <button
                onClick={() => copyPromoCode(popup.promoCode)}
                className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-lg font-mono font-bold transition-colors"
                data-testid="popup-promo-code"
              >
                {copying ? '✓ Copied!' : popup.promoCode}
              </button>
            </div>
            
            {/* CTA Button */}
            <Button
              onClick={handleCTA}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3"
              data-testid="popup-cta"
            >
              {popup.ctaText}
            </Button>
            
            {/* Expiry Notice */}
            {popup.expiresAt && (
              <div className="flex items-center justify-center gap-1 text-xs text-white/70">
                <Clock className="w-3 h-3" />
                <span>Expires {new Date(popup.expiresAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}