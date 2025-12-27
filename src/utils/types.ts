export interface Task {
  id: number;
  text: string;
  completed: boolean;
  projectId: number | null;
  createdAt: string;
  dueDate?: string; // ISO string形式の期限日時
  reminderMinutes?: number; // リマインダー時間（分）
  userId?: string; // SupabaseのユーザーID
}

export interface Project {
  id: number;
  name: string;
  createdAt: string;
  color: string;
}

export type ViewType = 'inbox' | 'today' | 'completed' | 'project';

export interface StorageResult {
  value?: string;
  key?: string;
}

