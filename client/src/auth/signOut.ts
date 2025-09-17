// Centralized sign-out function for all users
export async function signOut() {
  console.log('🚪 Starting centralized sign-out...');
  
  try {
    // Call logout endpoint (never fail)
    await fetch('/auth/logout', { 
      method: 'POST', 
      credentials: 'include' 
    });
    console.log('✅ Server logout completed');
  } catch (error) {
    console.warn('⚠️ Server logout failed, continuing with client cleanup:', error);
  }
  
  // Nuke client state so guards don't spin
  localStorage.clear();
  sessionStorage.clear();
  console.log('🧹 Client state cleared');
  
  // Hard redirect to public login (cache-bust + full reload)
  const url = '/login?ts=' + Date.now();
  console.log('🔄 Redirecting to:', url);
  
  window.location.replace(url);
  setTimeout(() => window.location.reload(), 60); // belt & suspenders
}