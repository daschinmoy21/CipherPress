/**
 * Gets environment variable with type safety
 * @param key Environment variable key
 * @returns Environment variable value
 */
export function getEnvVar(key: keyof ImportMeta['env']): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

/**
 * Formats blockchain address for display
 * @param address Ethereum address
 * @param chars Number of characters to show
 */
export function formatAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars)}...${address.slice(-chars)}`;
} 