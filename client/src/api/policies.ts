// API functions for link policies management

export async function fetchPolicy(scopeType: 'workspace' | 'collection', scopeId?: string) {
  const params = new URLSearchParams({ scope: scopeType });
  if (scopeType === 'collection' && scopeId) {
    params.append('scopeId', scopeId);
  }
  
  const response = await fetch(`/api/link-policies?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to load policy: ${response.statusText}`);
  }
  return response.json();
}

export async function savePolicy(payload: any) {
  const response = await fetch(`/api/link-policies`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`Failed to save policy: ${response.statusText}`);
  }
  return response.json();
}

export async function reconcilePolicy() {
  const response = await fetch(`/api/link-policies/reconcile`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to reconcile policy: ${response.statusText}`);
  }
  return response.json();
}