/**
 * Performance optimization utilities for Produco
 * Code optimization and performance monitoring
 */

export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    this.metrics.set(name, end - start);
    return result;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    this.metrics.set(name, end - start);
    return result;
  }

  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

export class Debouncer {
  private timeout: number | null = null;

  debounce(func: () => void, delay: number): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      func();
      this.timeout = null;
    }, delay);
  }
}

export class Throttler {
  private lastCall: number = 0;

  throttle(func: () => void, limit: number): void {
    const now = Date.now();
    if (now - this.lastCall >= limit) {
      func();
      this.lastCall = now;
    }
  }
}

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export function batchOperations<T>(operations: (() => T)[], batchSize: number = 10): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    const batchResults = batch.map(op => op());
    results.push(...batchResults);
  }
  
  return Promise.resolve(results);
}
