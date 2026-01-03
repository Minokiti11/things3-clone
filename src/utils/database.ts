import { supabase } from './supabase';
import { Task, Project } from './types';

export const database = {
  // タスクの取得
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('タスク取得エラー:', error);
      return [];
    }

    return (data || []).map((task: any) => ({
      id: task.id,
      text: task.text,
      completed: task.completed,
      projectId: task.project_id,
      createdAt: task.created_at,
      dueDate: task.due_date,
      reminderMinutes: task.reminder_minutes,
      userId: task.user_id,
    }));
  },

  // タスクの保存
  async saveTask(task: Task): Promise<Task | null> {
    if (!task.userId) {
      console.error('ユーザーIDがありません');
      return null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .upsert({
        id: task.id,
        user_id: task.userId,
        text: task.text,
        completed: task.completed,
        project_id: task.projectId,
        created_at: task.createdAt,
        due_date: task.dueDate,
        reminder_minutes: task.reminderMinutes,
      })
      .select()
      .single();

    if (error) {
      console.error('タスク保存エラー:', error);
      return null;
    }

    return {
      id: data.id,
      text: data.text,
      completed: data.completed,
      projectId: data.project_id,
      createdAt: data.created_at,
      dueDate: data.due_date,
      reminderMinutes: data.reminder_minutes,
      userId: data.user_id,
    };
  },

  // タスクの削除
  async deleteTask(taskId: number, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) {
      console.error('タスク削除エラー:', error);
      return false;
    }

    return true;
  },

  // プロジェクトの取得
  async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('プロジェクト取得エラー:', error);
      return [];
    }

    return (data || []).map((project: any) => ({
      id: project.id,
      name: project.name,
      createdAt: project.created_at,
      color: project.color || '#3B82F6',
    }));
  },

  // プロジェクトの削除
  async deleteProject(projectId: number, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);
    if (error) {
      console.error('プロジェクト削除エラー:', error);
      return false;
    }
    return true;
  },

  // プロジェクトの保存
  async saveProject(project: Project, userId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .upsert({
        id: project.id,
        user_id: userId,
        name: project.name,
        created_at: project.createdAt,
        color: project.color,
      })
      .select()
      .single();

    if (error) {
      console.error('プロジェクト保存エラー:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
      color: data.color,
    };
  },
};

