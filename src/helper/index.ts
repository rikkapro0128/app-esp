
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const rssiToPercent = (rssi: number) => Math.min(Math.max(2 * (rssi + 100), 0), 100)