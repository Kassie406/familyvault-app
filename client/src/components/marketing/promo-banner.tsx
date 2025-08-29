import { useState, useEffect } from 'react';
import { X, Gift, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromoBanner {
  id: string;
  title: string;
  message: string;
  ctaText: string;
  ctaUrl?: string;
  promoCode?: string;
  bgColor: string;
  textColor: string;
  icon?: 'gift' | 'zap' | 'clock';
  targetDomains?: string[];
  expiresAt?: string;
  isActive: boolean;
}

const STORAGE_KEY = 'fcs-dismissed-banners';

export default function PromoBanner() {
  const [banner, setBanner] = useState<PromoBanner | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [copying, setCopying] = useState(false);

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'gift': return <Gift className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'clock': return <Clock className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const copyPromoCode = async (code: string) => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(code);
      setTimeout(() => setCopying(false), 1000);
    } catch (error) {
      setCopying(false);
    }
  };

  const dismissBanner = (bannerId: string) => {
    const newDismissed = [...dismissed, bannerId];
    setDismissed(newDismissed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDismissed));
    setBanner(null);
  };

  const loadActiveBanner = async () => {
    try {
      const response = await fetch('/api/marketing/active-banner', { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return;
      
      const activeBanner: PromoBanner = await response.json();
      
      // Check if banner was dismissed
      if (dismissed.includes(activeBanner.id)) return;
      
      // Check if banner expired
      if (activeBanner.expiresAt && new Date() > new Date(activeBanner.expiresAt)) return;
      
      // Check domain targeting
      if (activeBanner.targetDomains && activeBanner.targetDomains.length > 0) {
        const currentDomain = window.location.hostname;
        const shouldShow = activeBanner.targetDomains.some(domain => 
          currentDomain === domain || currentDomain.endsWith(`.${domain}`)
        );
        if (!shouldShow) return;
      }
      
      setBanner(activeBanner);
    } catch (error) {
      console.error('Failed to load promotional banner:', error);
    }
  };

  useEffect(() => {
    // Load dismissed banners from storage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setDismissed(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    loadActiveBanner();
  }, [dismissed]);

  if (!banner) return null;

  return (
    <div 
      className="relative px-4 py-3 text-center transition-all duration-300 ease-out"
      style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
      data-testid="promo-banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-3">
          {getIcon(banner.icon)}
          
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>{banner.title}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{banner.message}</span>
          </div>
          
          {banner.promoCode && (
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-90">Code:</span>
              <button
                onClick={() => copyPromoCode(banner.promoCode!)}
                className="px-2 py-1 bg-black/20 dark:bg-white/20 rounded text-xs font-mono hover:bg-black/30 dark:hover:bg-white/30 transition-colors"
                data-testid="promo-code-button"
              >
                {copying ? 'Copied!' : banner.promoCode}
              </button>
            </div>
          )}
          
          {banner.ctaText && (
            <Button 
              size="sm" 
              variant="outline"
              className="ml-2 border-current text-current hover:bg-current hover:text-white dark:hover:text-black"
              onClick={() => banner.ctaUrl && window.open(banner.ctaUrl, '_blank')}
              data-testid="promo-cta"
            >
              {banner.ctaText}
            </Button>
          )}
        </div>
        
        <button
          onClick={() => dismissBanner(banner.id)}
          className="p-1 rounded hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
          data-testid="dismiss-banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Mobile layout */}
      <div className="sm:hidden mt-2 text-xs opacity-90">
        {banner.message}
      </div>
    </div>
  );
}