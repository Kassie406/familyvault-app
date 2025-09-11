import { useEffect, useState } from "react";
import NewSignIn from "./NewSignIn";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  // Check if we're on a portal domain and should bypass authentication
  const hostname = window.location.hostname;
  const isPortalDomain = hostname.includes('replit.dev') || hostname.includes('repl.co') || 
                         hostname === 'portal.familycirclesecure.com' || 
                         hostname.includes('portal');
  
  // Always bypass authentication for portal domains (public family portal)
  if (isPortalDomain) {
    return <>{children}</>;
  }

  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Add timeout fallback to prevent infinite loading
    const checkAuth = async () => {
      timeoutId = setTimeout(() => {
        if (!ready) {
          console.warn('Auth check timeout - showing login');
          setUser(null);
          setReady(true);
        }
      }, 5000); // 5 second timeout
      
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.warn('Auth check failed:', error);
        setUser(null);
      } finally {
        clearTimeout(timeoutId);
        setReady(true);
      }
    };
    
    checkAuth();
    
    return () => clearTimeout(timeoutId);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full" />
      </div>
    );
  }

  return user ? (
    children
  ) : (
    <NewSignIn />
  );
}