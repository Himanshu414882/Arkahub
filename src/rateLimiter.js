class RateLimiter {
  constructor(delay = 1000) {
    this.queue = [];
    this.running = false;
    this.delay = delay;
  }

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }

  async run() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      try {
        resolve(await task());
      } catch (e) {
        reject(e);
      }
      await new Promise((r) => setTimeout(r, this.delay));
    }

    this.running = false;
  }
}

module.exports = RateLimiter;
