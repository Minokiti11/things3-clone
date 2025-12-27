import { StorageResult } from './types';

export const storage = {
  async get(key: string): Promise<StorageResult | null> {
    try {
      if (window.storage) {
        return await window.storage.get(key);
      } else {
        const value = localStorage.getItem(key);
        return value ? { value } : null;
      }
    } catch (error) {
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    }
  },
  async set(key: string, value: string): Promise<StorageResult> {
    try {
      if (window.storage) {
        return await window.storage.set(key, value);
      } else {
        localStorage.setItem(key, value);
        return { key, value };
      }
    } catch (error) {
      localStorage.setItem(key, value);
      return { key, value };
    }
  }
};

