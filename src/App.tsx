import React, { useState, useEffect } from 'react';
import { Task, Project, ViewType } from './utils/types';
import { supabase } from './utils/supabase';
import { database } from './utils/database';
import InstallBanner from './components/InstallBanner';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskList from './components/TaskList';
import NewTaskInput from './components/NewTaskInput';
import Login from './components/Login';

// BeforeInstallPromptEvent型の定義
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedView, setSelectedView] = useState<ViewType>('inbox');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [showNewTask, setShowNewTask] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  // 認証状態の監視
  useEffect(() => {
    // 現在のセッションを確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadData(session.user.id);
      } else {
        setTasks([]);
        setProjects([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // PWAインストールプロンプト
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(installEvent);
      setShowInstallBanner(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    
    setDeferredPrompt(null);
  };

  // データ読み込み
  const loadData = async (userId: string) => {
    try {
      const loadedTasks = await database.getTasks(userId);
      const loadedProjects = await database.getProjects(userId);
      setTasks(loadedTasks);
      setProjects(loadedProjects);
    } catch (error) {
      console.error('データ読み込みエラー:', error);
    }
  };

  // ログイン成功時の処理
  const handleLoginSuccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await loadData(session.user.id);
    }
  };

  const addTask = async (text: string, dueDate?: string, reminderMinutes?: number) => {
    if (!text.trim() || !user) return;
    
    const newTask: Task = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      projectId: selectedView === 'project' ? selectedProject : null,
      createdAt: new Date().toISOString(),
      dueDate,
      reminderMinutes,
      userId: user.id,
    };
    
    const savedTask = await database.saveTask(newTask);
    if (savedTask) {
      setTasks([...tasks, savedTask]);
      // リマインダーを設定
      if (dueDate && reminderMinutes) {
        scheduleNotification(savedTask);
      }
    }
    setNewTaskText('');
    setShowNewTask(false);
  };

  const toggleTask = async (taskId: number) => {
    if (!user) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTask = { ...task, completed: !task.completed };
    const savedTask = await database.saveTask(updatedTask);
    if (savedTask) {
      setTasks(tasks.map(t => 
        t.id === taskId ? savedTask : t
      ));
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!user) return;
    
    const success = await database.deleteTask(taskId, user.id);
    if (success) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const deleteProject = async (projectId: number) => {
    if (!user) return;
    const success = await database.deleteProject(projectId, user.id);
    if (success) {
      setProjects(projects.filter((p) => p.id !== projectId));
      // 関連するタスクも削除（表示上のみ）
      setTasks(tasks.filter((t) => t.projectId !== projectId));
    }
  };

  const addProject = async (name: string) => {
    console.log('addProject called', name, user);
    if (!user) return;
    
    const newProject: Project = {
      id: Date.now(),
      name,
      createdAt: new Date().toISOString(),
      color: '#3B82F6'
    };
    
    const savedProject = await database.saveProject(newProject, user.id);
    if (savedProject) {
      setProjects([...projects, savedProject]);
    }
  };

  const handleViewChange = (view: ViewType, projectId: number | null) => {
    setSelectedView(view);
    setSelectedProject(projectId);
  };

  const getFilteredTasks = (): Task[] => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (selectedView) {
      case 'inbox':
        return filtered.filter(t => !t.projectId && !t.completed);
      case 'today':
        return filtered.filter(t => !t.completed);
      case 'completed':
        return filtered.filter(t => t.completed);
      case 'project':
        return filtered.filter(t => t.projectId === selectedProject && !t.completed);
      default:
        return filtered;
    }
  };

  const getViewTitle = (): string => {
    switch (selectedView) {
      case 'inbox': return 'インボックス';
      case 'today': return '今日';
      case 'completed': return '完了';
      case 'project':
        const proj = projects.find(p => p.id === selectedProject);
        return proj ? proj.name : 'プロジェクト';
      default: return '';
    }
  };

  // 通知のスケジュール
  const scheduleNotification = (task: Task) => {
    if (!task.dueDate || !task.reminderMinutes) return;

    const dueDate = new Date(task.dueDate);
    const reminderTime = new Date(dueDate.getTime() - task.reminderMinutes * 60 * 1000);
    const now = new Date();

    if (reminderTime <= now) return; // 既に過ぎている場合はスキップ

    const delay = reminderTime.getTime() - now.getTime();

    // Service Worker経由で通知をスケジュール
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // タイマーで通知を送信
        setTimeout(() => {
          registration.showNotification('タスクのリマインダー', {
            body: task.text,
            icon: '/logo192.png',
            tag: `task-${task.id}`,
            badge: '/logo192.png',
            requireInteraction: false,
          });
        }, delay);
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      // Service Workerが使えない場合は通常の通知APIを使用
      setTimeout(() => {
        new Notification('タスクのリマインダー', {
          body: task.text,
          icon: '/logo192.png',
          tag: `task-${task.id}`,
        });
      }, delay);
    }
  };

  // 既存のタスクのリマインダーを再スケジュール
  useEffect(() => {
    if (!user) return;

    // 通知のスケジュール関数を定義
    const scheduleTaskNotification = (task: Task) => {
      if (!task.dueDate || !task.reminderMinutes) return;

      const dueDate = new Date(task.dueDate);
      const reminderTime = new Date(dueDate.getTime() - task.reminderMinutes * 60 * 1000);
      const now = new Date();

      if (reminderTime <= now) return; // 既に過ぎている場合はスキップ

      const delay = reminderTime.getTime() - now.getTime();

      // Service Worker経由で通知をスケジュール
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          setTimeout(() => {
            registration.showNotification('タスクのリマインダー', {
              body: task.text,
              icon: '/logo192.png',
              tag: `task-${task.id}`,
              badge: '/logo192.png',
              requireInteraction: false,
            });
          }, delay);
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        setTimeout(() => {
          new Notification('タスクのリマインダー', {
            body: task.text,
            icon: '/logo192.png',
            tag: `task-${task.id}`,
          });
        }, delay);
      }
    };

    tasks.forEach((task) => {
      if (task.dueDate && task.reminderMinutes && !task.completed) {
        scheduleTaskNotification(task);
      }
    });
  }, [tasks, user]);

  // ログアウト
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#F9FAFB'
      }}>
        <p style={{ color: '#6B7280' }}>読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
      <InstallBanner
        show={showInstallBanner}
        onInstall={handleInstallClick}
        onDismiss={() => setShowInstallBanner(false)}
      />

      <Sidebar
        selectedView={selectedView}
        selectedProject={selectedProject}
        tasks={tasks}
        projects={projects}
        onViewChange={handleViewChange}
        onAddProject={addProject}
        onDeleteProject={deleteProject}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header
          title={getViewTitle()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          user={user}
          onLogout={handleLogout}
        />

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <TaskList
            tasks={getFilteredTasks()}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </div>

        <NewTaskInput
          showNewTask={showNewTask}
          newTaskText={newTaskText}
          onTextChange={setNewTaskText}
          onShowChange={setShowNewTask}
          onAddTask={addTask}
        />
      </div>
    </div>
  );
}

export default App;

