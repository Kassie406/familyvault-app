export class Semaphore {
  private q: Array<() => void> = [];
  private active = 0;
  constructor(private readonly limit = 2) {}
  async run<T>(fn: () => Promise<T>): Promise<T> {
    if (this.active >= this.limit) await new Promise<void>(r => this.q.push(r));
    this.active++;
    try { return await fn(); }
    finally {
      this.active--;
      const next = this.q.shift(); if (next) next();
    }
  }
}