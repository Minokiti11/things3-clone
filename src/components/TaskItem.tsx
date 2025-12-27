import React from 'react';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Task } from '../utils/types';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div
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
        onClick={() => onToggle(task.id)}
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
        onClick={() => onDelete(task.id)}
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
  );
};

export default TaskItem;

