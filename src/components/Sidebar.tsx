import React from 'react';
import { Plus, Inbox, Star, CheckCircle2 } from 'lucide-react';
import { Task, Project, ViewType } from '../utils/types';

interface SidebarProps {
  selectedView: ViewType;
  selectedProject: number | null;
  tasks: Task[];
  projects: Project[];
  onViewChange: (view: ViewType, projectId: number | null) => void;
  onAddProject: (name: string) => void;
  onDeleteProject?: (projectId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedView,
  selectedProject,
  tasks,
  projects,
  onViewChange,
  onAddProject,
  onDeleteProject
}) => {
  return (
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
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Get Done</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {/* インボックス */}
        <button
          onClick={() => onViewChange('inbox', null)}
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
          onClick={() => onViewChange('today', null)}
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
                if (name) { onAddProject(name); }
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
            <div key={project.id} style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
              <button
                onClick={() => onViewChange('project', project.id)}
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
            <button
              onClick={() => onDeleteProject && onDeleteProject(project.id)}
              style={{ marginLeft: 8, background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 16 }}
              title="削除"
            >
              ×
            </button>
          </div>
          ))}
        </div>

        {/* 完了 */}
        <div style={{ marginTop: '24px' }}>
          <button
            onClick={() => onViewChange('completed', null)}
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
  );
};

export default Sidebar;

