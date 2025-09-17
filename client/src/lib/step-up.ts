/**
 * Client-side helper for automatic step-up authentication
 * When API returns re_auth_required, shows modal and retries request
 */

let stepUpModal: {
  open: () => Promise<boolean>;
} | null = null;

// Register the step-up modal component
export function registerStepUpModal(modalInstance: { open: () => Promise<boolean> }) {
  stepUpModal = modalInstance;
}

/**
 * Enhanced fetch that automatically handles re-authentication
 * If server returns 401 with re_auth_required, shows step-up modal
 */
export async function secureFetch(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const makeRequest = async (): Promise<Response> => {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });

    // Check if re-authentication is required
    if (response.status === 401) {
      try {
        const errorData = await response.clone().json();
        if (errorData.error === 're_auth_required') {
          // Show step-up modal and wait for completion
          if (stepUpModal) {
            const success = await stepUpModal.open();
            if (success) {
              // Retry the original request after successful step-up
              return fetch(url, {
                credentials: 'include',
                ...options,
              });
            }
          }
          // If modal not available or authentication failed, return original response
          return response;
        }
      } catch (e) {
        // If response is not JSON, return original response
        return response;
      }
    }

    return response;
  };

  return makeRequest();
}

/**
 * Helper for actions that require step-up authentication
 * Automatically handles re-auth flow for download/share/billing actions
 */
export async function performSecureAction<T>(
  actionFn: () => Promise<T>
): Promise<T> {
  try {
    return await actionFn();
  } catch (error: any) {
    // If it's a re-auth error, show modal and retry
    if (error?.status === 401 && error?.error === 're_auth_required') {
      if (stepUpModal) {
        const success = await stepUpModal.open();
        if (success) {
          return await actionFn();
        }
      }
    }
    throw error;
  }
}

/**
 * Example usage functions for protected actions
 */

export async function downloadDocument(docId: string): Promise<void> {
  const response = await secureFetch(`/api/storage/download-url/${docId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get download URL');
  }
  
  const { url } = await response.json();
  
  // Trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function shareDocument(docId: string, shareData: any): Promise<any> {
  const response = await secureFetch('/api/shares/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ docId, ...shareData }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create share');
  }
  
  return response.json();
}

export async function performBillingAction(action: string, data: any): Promise<any> {
  const response = await secureFetch(`/api/billing/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to perform billing action: ${action}`);
  }
  
  return response.json();
}