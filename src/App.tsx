import React, { useState, useEffect } from 'react';
import { storage } from './utils/storage';
import { Task, Project, ViewType } from './utils/types';
import InstallBanner from './components/InstallBanner';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskList from './components/TaskList';
import NewTaskInput from './components/NewTaskInput';

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedView, setSelectedView] = useState<ViewType>('inbox');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [showNewTask, setShowNewTask] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

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
  useEffect(() => {
    loadData();
  }, []);

  // データ保存
  useEffect(() => {
    if (tasks.length > 0 || projects.length > 0) {
      saveData();
    }
  }, [tasks, projects]);

  const loadData = async () => {
    try {
      const tasksResult = await storage.get('get-done-tasks');
      const projectsResult = await storage.get('get-done-projects');
      
      if (tasksResult?.value) setTasks(JSON.parse(tasksResult.value));
      if (projectsResult?.value) setProjects(JSON.parse(projectsResult.value));
    } catch (error) {
      console.log('初回起動');
    }
  };

  const saveData = async () => {
    try {
      await storage.set('get-done-tasks', JSON.stringify(tasks));
      await storage.set('get-done-projects', JSON.stringify(projects));
    } catch (error) {
      console.error('保存エラー:', error);
    }
  };

  const addTask = (text: string) => {
    if (!text.trim()) return;
    
    const newTask: Task = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      projectId: selectedView === 'project' ? selectedProject : null,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setShowNewTask(false);
  };

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const addProject = (name: string) => {
    const newProject: Project = {
      id: Date.now(),
      name,
      createdAt: new Date().toISOString(),
      color: '#3B82F6'
    };
    setProjects([...projects, newProject]);
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
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header
          title={getViewTitle()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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

