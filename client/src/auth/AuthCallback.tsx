import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Processing auth callback...");
        
        // Get the session from the URL hash/params
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          alert(`Authentication failed: ${error.message}`);
          // Redirect to sign-in on error
          window.location.replace('/');
          return;
        }

        if (data.session) {
          console.log("Authentication successful:", data.session.user.email);
          // Successfully authenticated, redirect to main app
          window.location.replace('/');
        } else {
          console.log("No session found, redirecting to sign-in");
          window.location.replace('/');
        }
      } catch (err) {
        console.error("Unexpected error in auth callback:", err);
        window.location.replace('/');
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#D4AF37] text-lg font-semibold mb-2">
          Completing sign-in...
        </div>
        <div className="text-white/60">
          Please wait while we finish authenticating you.
        </div>
      </div>
    </div>
  );
}