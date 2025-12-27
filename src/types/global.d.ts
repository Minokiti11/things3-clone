// グローバル型定義

interface Window {
  storage?: {
    get: (key: string) => Promise<{ value?: string; key?: string } | null>;
    set: (key: string, value: string) => Promise<{ value?: string; key?: string }>;
  };
}

