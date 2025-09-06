import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      console.log("Attempting to send magic link to:", email);
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log("Supabase Anon Key:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "Present" : "Missing");
      
      const { data, error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      console.log("Supabase response:", { data, error });
      
      if (error) {
        console.error("Supabase error:", error);
        alert(`Authentication error: ${error.message}`);
      } else {
        console.log("Magic link sent successfully");
        setSent(true);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  return sent ? (
    <div className="text-white text-center">
      <p className="text-lg mb-2">✓ Check your email to finish sign-in</p>
      <p className="text-zinc-400 text-sm">We sent a secure login link to {email}</p>
    </div>
  ) : (
    <form onSubmit={sendLink} className="space-y-4">
      <input
        className="w-full px-4 py-3 rounded-lg bg-black/40 text-white border border-white/20 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
        placeholder="Enter your email address"
        type="email"
        required
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        data-testid="input-email"
      />
      <button 
        type="submit"
        className="w-full px-4 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#c5a000] text-black font-semibold transition-colors"
        data-testid="button-send-link"
      >
        Send Magic Link
      </button>
    </form>
  );
}