let dailyCount = 0;
let day = new Date().toDateString();

export function incAndCheckBudget() {
  const today = new Date().toDateString();
  if (today !== day) { day = today; dailyCount = 0; }
  dailyCount += 1;
  const MAX_REQ = Number(process.env.MAX_AGENT_REQUESTS_PER_DAY || 500);
  if (dailyCount > MAX_REQ) throw new Error('Daily agent budget exceeded');
  return { dailyCount, MAX_REQ };
}

export function getBudgetStatus() {
  const MAX_REQ = Number(process.env.MAX_AGENT_REQUESTS_PER_DAY || 500);
  return { dailyCount, MAX_REQ, day };
}