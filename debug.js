/**
 * Debug utilities for Produco
 * Helper functions for debugging and logging
 */

const DEBUG = true;

function log(message, data = null) {
  if (!DEBUG) return;
  
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

function error(message, error = null) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`);
  if (error) {
    console.error(error);
  }
}

function warn(message) {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] WARN: ${message}`);
}

function trace(message) {
  if (DEBUG) {
    const timestamp = new Date().toISOString();
    console.trace(`[${timestamp}] TRACE: ${message}`);
  }
}

function measureTime(fn, label) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  log(`${label} took ${(end - start).toFixed(2)}ms`);
  return result;
}

async function measureTimeAsync(fn, label) {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  log(`${label} took ${(end - start).toFixed(2)}ms`);
  return result;
}

module.exports = {
  log,
  error,
  warn,
  trace,
  measureTime,
  measureTimeAsync,
  DEBUG
};
