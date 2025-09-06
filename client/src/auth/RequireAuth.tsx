import { useEffect, useState } from "react";
import NewSignIn from "./NewSignIn";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status with our custom auth system
    fetch('/api/auth/user')
      .then(async (response) => {
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
        setReady(true);
      })
      .catch(() => {
        setUser(null);
        setReady(true);
      });
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