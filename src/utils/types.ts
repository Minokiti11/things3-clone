export interface Task {
  id: number;
  text: string;
  completed: boolean;
  projectId: number | null;
  createdAt: string;
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

