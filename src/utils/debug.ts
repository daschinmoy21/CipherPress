/**
 * Utility functions for development/testing
 */

export const clearIPFSCache = (): void => {
  if (import.meta.env.DEV) {
    // Remove all IPFS-related items from localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ipfs-article-')) {
        localStorage.removeItem(key);
      }
    }
    console.log('IPFS cache cleared');
  }
};

export const inspectStoredCIDs = (): void => {
  if (import.meta.env.DEV) {
    console.log('Stored CIDs in localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ipfs-article-')) {
        const cid = key.replace('ipfs-article-', '');
        console.log(cid);
      }
    }
  }
}; 