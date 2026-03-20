import React from 'react';
import { ConfigProvider } from 'antd';
import ChatLayout from './components/ChatLayout';
import { ThemeProviderWrapper } from './context/ThemeContext';
import './App.css';

const theme = {
  token: {
    colorPrimary: '#7c3aed',
    borderRadius: 10,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

function App() {
  return (
    <ThemeProviderWrapper>
      <ConfigProvider theme={theme}>
        <ChatLayout />
      </ConfigProvider>
    </ThemeProviderWrapper>
  );
}

export default App;
