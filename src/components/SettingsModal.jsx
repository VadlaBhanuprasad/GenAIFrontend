import React from 'react';
import { Modal, Switch, Typography, Divider } from 'antd';
import { useThemeContext } from '../context/ThemeContext';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

const { Text, Title } = Typography;

const SettingsModal = ({ open, onClose }) => {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0, color: isDarkMode ? '#e0e0e0' : 'inherit' }}>Settings</Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      styles={{ 
        body: { padding: '20px 0' },
        content: { background: isDarkMode ? '#1e1e1e' : '#fff', borderColor: isDarkMode ? '#333' : '#fff' },
        header: { background: isDarkMode ? '#1e1e1e' : '#fff', borderBottom: isDarkMode ? '1px solid #333' : '1px solid #f0f0f0' },
        mask: { backdropFilter: 'blur(4px)' }
      }}
      closeIcon={<span style={{ color: isDarkMode ? '#e0e0e0' : 'inherit' }}>X</span>}
    >
      <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text strong style={{ fontSize: 16, display: 'block', color: isDarkMode ? '#e0e0e0' : 'inherit' }}>Appearance</Text>
          <Text type="secondary" style={{ color: isDarkMode ? '#a0a0a0' : 'inherit' }}>Toggle between Dark and Light mode</Text>
        </div>
        <Switch 
          checked={isDarkMode} 
          onChange={toggleTheme} 
          checkedChildren={<BulbFilled />} 
          unCheckedChildren={<BulbOutlined />}
        />
      </div>
      <Divider style={{ borderColor: isDarkMode ? '#333' : '#f0f0f0' }} />
      <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text strong style={{ fontSize: 16, display: 'block', color: isDarkMode ? '#e0e0e0' : 'inherit' }}>True Lover Mode</Text>
          <Text type="secondary" style={{ color: isDarkMode ? '#a0a0a0' : 'inherit' }}>AI acts intimately and goes by the name "Diya"</Text>
        </div>
        <Text strong style={{ color: '#7c3aed' }}>Active</Text>
      </div>
    </Modal>
  );
};

export default SettingsModal;
