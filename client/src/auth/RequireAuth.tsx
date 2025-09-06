import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import SignIn from "./SignIn";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setReady(true);
    });
    
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription?.subscription?.unsubscribe();
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
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="p-8 rounded-2xl bg-gradient-to-b from-zinc-900/60 to-zinc-950/70 border border-zinc-800/80 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Family Portal</h1>
            <p className="text-zinc-400">Sign in to access your family's secure portal</p>
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  );
}