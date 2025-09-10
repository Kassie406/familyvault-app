// Address parsing utility for US addresses
export function normalizeAddress(raw: string) {
  if (!raw) return { line1: '', line2: '', city: '', state: '', postal: '', country: 'US' };
  
  // Super small heuristic; swap in libpostal if you have it available
  // Example: "123 Main St Apt 4B, Newark, NJ 07102"
  const [first, cityStateZip] = raw.split(/\s*,\s*/, 2);
  let line1 = first ?? '';
  let city = '', state = '', postal = '', line2 = '';

  if (cityStateZip) {
    const m = cityStateZip.match(/^(.*)\s+([A-Z]{2})\s+(\d{5}(-\d{4})?)$/);
    if (m) { 
      city = m[1].trim(); 
      state = m[2]; 
      postal = m[3]; 
    }
  }
  
  // Crude apt detection
  const apt = line1.match(/\b(apt|unit|suite|ste|#)\s*([A-Za-z0-9-]+)$/i);
  if (apt) { 
    line2 = apt[0]; 
    line1 = line1.replace(apt[0], '').trim(); 
  }

  return { 
    line1: line1.trim(), 
    line2: line2.trim(), 
    city: city.trim(), 
    state: state.trim(), 
    postal: postal.trim(),
    country: 'US'
  };
}