export function registerCleanupJobs() {
  const weekly = Number(process.env.CLEANUP_INTERVAL_HOURS || 168); // weekly
  setInterval(() => {
    // TODO: add Neon VACUUM / blob cleanup calls here
    console.log('[CLEANUP] running storage/DB maintenance');
  }, weekly * 3600 * 1000);
}