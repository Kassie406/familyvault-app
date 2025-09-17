// API functions for approval workflow management

export async function listPending() {
  const response = await fetch(`/api/approvals?state=pending`);
  if (!response.ok) {
    throw new Error(`Failed to load approvals: ${response.statusText}`);
  }
  return response.json();
}

export async function approve(id: string, role: 'viewer' | 'commenter' | 'editor', expiresAt?: string) {
  const response = await fetch(`/api/approvals/${id}/approve`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ role, expiresAt })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to approve request: ${response.statusText}`);
  }
  return response.json();
}

export async function deny(id: string, reason?: string) {
  const response = await fetch(`/api/approvals/${id}/deny`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ reason })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to deny request: ${response.statusText}`);
  }
  return response.json();
}

export async function requestChanges(id: string, message?: string) {
  const response = await fetch(`/api/approvals/${id}/request-changes`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ message })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to request changes: ${response.statusText}`);
  }
  return response.json();
}