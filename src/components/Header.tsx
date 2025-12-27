import React from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ title, searchQuery, onSearchChange }) => {
  return (
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
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{title}</h2>
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
            onChange={(e) => onSearchChange(e.target.value)}
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
  );
};

export default Header;

