import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Inbox, Star, CheckCircle2, Circle, Trash2, Download } from 'lucide-react';

// ストレージヘルパー関数
const storage = {
  async get(key) {
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
  async set(key, value) {
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

function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedView, setSelectedView] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // PWAインストールプロンプト
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
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
      const tasksResult = await storage.get('things-tasks');
      const projectsResult = await storage.get('things-projects');
      
      if (tasksResult?.value) setTasks(JSON.parse(tasksResult.value));
      if (projectsResult?.value) setProjects(JSON.parse(projectsResult.value));
    } catch (error) {
      console.log('初回起動');
    }
  };

  const saveData = async () => {
    try {
      await storage.set('things-tasks', JSON.stringify(tasks));
      await storage.set('things-projects', JSON.stringify(projects));
    } catch (error) {
      console.error('保存エラー:', error);
    }
  };

  const addTask = (text) => {
    if (!text.trim()) return;
    
    const newTask = {
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

  const toggleTask = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const addProject = (name) => {
    const newProject = {
      id: Date.now(),
      name,
      createdAt: new Date().toISOString(),
      color: '#3B82F6'
    };
    setProjects([...projects, newProject]);
  };

  const getFilteredTasks = () => {
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

  const getViewTitle = () => {
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
      {/* インストールバナー */}
      {showInstallBanner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#3B82F6',
          color: 'white',
          padding: '12px 16px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Download size={20} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              アプリをインストールして、オフラインでも使えるようにしますか?
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleInstallClick}
              style={{
                padding: '6px 16px',
                backgroundColor: 'white',
                color: '#3B82F6',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              インストール
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              style={{
                padding: '6px 16px',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              後で
            </button>
          </div>
        </div>
      )}

      {/* サイドバー */}
      <div style={{
        width: '256px',
        backgroundColor: '#F9FAFB',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Things</h1>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {/* インボックス */}
          <button
            onClick={() => { setSelectedView('inbox'); setSelectedProject(null); }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              backgroundColor: selectedView === 'inbox' ? '#DBEAFE' : 'transparent',
              color: selectedView === 'inbox' ? '#2563EB' : '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            <Inbox size={20} />
            <span>インボックス</span>
            <span style={{
              marginLeft: 'auto',
              fontSize: '12px',
              backgroundColor: '#E5E7EB',
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              {tasks.filter(t => !t.projectId && !t.completed).length}
            </span>
          </button>

          {/* 今日 */}
          <button
            onClick={() => { setSelectedView('today'); setSelectedProject(null); }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              backgroundColor: selectedView === 'today' ? '#DBEAFE' : 'transparent',
              color: selectedView === 'today' ? '#2563EB' : '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              marginTop: '4px'
            }}
          >
            <Star size={20} />
            <span>今日</span>
          </button>

          {/* プロジェクト */}
          <div style={{ marginTop: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase'
              }}>
                プロジェクト
              </span>
              <button
                onClick={() => {
                  const name = prompt('プロジェクト名:');
                  if (name) addProject(name);
                }}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedView('project');
                  setSelectedProject(project.id);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  backgroundColor: selectedView === 'project' && selectedProject === project.id ? '#DBEAFE' : 'transparent',
                  color: selectedView === 'project' && selectedProject === project.id ? '#2563EB' : '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginTop: '4px'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: project.color
                }} />
                <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {project.name}
                </span>
                <span style={{
                  fontSize: '12px',
                  backgroundColor: '#E5E7EB',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {tasks.filter(t => t.projectId === project.id && !t.completed).length}
                </span>
              </button>
            ))}
          </div>

          {/* 完了 */}
          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => { setSelectedView('completed'); setSelectedProject(null); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                backgroundColor: selectedView === 'completed' ? '#DBEAFE' : 'transparent',
                color: selectedView === 'completed' ? '#2563EB' : '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <CheckCircle2 size={20} />
              <span>完了</span>
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* ヘッダー */}
        <div style={{
          borderBottom: '1px solid #E5E7EB',
          padding: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{getViewTitle()}</h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }} />
              <input
                type="text"
                placeholder="検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* タスクリスト */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {getFilteredTasks().length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#9CA3AF'
            }}>
              <CheckCircle2 size={64} style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '18px' }}>タスクがありません</p>
            </div>
          ) : (
            <div>
              {getFilteredTasks().map(task => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: '1px solid #F3F4F6'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex'
                    }}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={20} color="#3B82F6" />
                    ) : (
                      <Circle size={20} color="#9CA3AF" />
                    )}
                  </button>

                  <p style={{
                    flex: 1,
                    fontSize: '14px',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#9CA3AF' : '#111827'
                  }}>
                    {task.text}
                  </p>

                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex'
                    }}
                  >
                    <Trash2 size={16} color="#9CA3AF" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 新規タスク入力 */}
        <div style={{
          borderTop: '1px solid #E5E7EB',
          padding: '16px'
        }}>
          {showNewTask ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Circle size={20} color="#9CA3AF" />
              <input
                type="text"
                autoFocus
                placeholder="新しいタスク..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTask(newTaskText);
                  if (e.key === 'Escape') {
                    setShowNewTask(false);
                    setNewTaskText('');
                  }
                }}
                onBlur={() => {
                  if (newTaskText.trim()) addTask(newTaskText);
                  else setShowNewTask(false);
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowNewTask(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#3B82F6',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <Plus size={20} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>新規</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
