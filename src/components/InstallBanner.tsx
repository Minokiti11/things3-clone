import React from 'react';
import { Download } from 'lucide-react';

interface InstallBannerProps {
  show: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

const InstallBanner: React.FC<InstallBannerProps> = ({ show, onInstall, onDismiss }) => {
  if (!show) return null;

  return (
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
          onClick={onInstall}
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
          onClick={onDismiss}
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
  );
};

export default InstallBanner;

