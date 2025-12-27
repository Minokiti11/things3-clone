import React from 'react';
import { Plus, Circle } from 'lucide-react';

interface NewTaskInputProps {
  showNewTask: boolean;
  newTaskText: string;
  onTextChange: (text: string) => void;
  onShowChange: (show: boolean) => void;
  onAddTask: (text: string) => void;
}

const NewTaskInput: React.FC<NewTaskInputProps> = ({
  showNewTask,
  newTaskText,
  onTextChange,
  onShowChange,
  onAddTask
}) => {
  return (
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
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onAddTask(newTaskText);
              }
              if (e.key === 'Escape') {
                onShowChange(false);
                onTextChange('');
              }
            }}
            onBlur={() => {
              if (newTaskText.trim()) {
                onAddTask(newTaskText);
              } else {
                onShowChange(false);
              }
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
          onClick={() => onShowChange(true)}
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
  );
};

export default NewTaskInput;

