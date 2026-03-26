import React, { useState } from 'react';
import styled from 'styled-components';
import { message, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import WelcomeScreen from './WelcomeScreen';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import SettingsModal from './SettingsModal';
import { useChat, useDocumentUpload } from '../hooks/useChat';

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
`;

const MainArea = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

const MobileHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
  height: 56px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const ChatLayout = () => {
    const [selectedMode, setSelectedMode] = useState('general');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Pass selectedMode so the hook operates on the correct chat history
    const { messages, isStreaming, sendMessage, retryLastMessage, stopStreaming, newChat } = useChat(selectedMode);
    const { uploading, sessionId, uploadedFile, uploadPDF, uploadURL, clearUpload } = useDocumentUpload();

    const handleSend = (text) => {
        // For document/weblink mode, pass the active sessionId
        const useSession = selectedMode === 'document' || selectedMode === 'weblink';
        sendMessage(text, selectedMode, useSession ? sessionId : null);
    };

    const handleNewChat = () => {
        newChat(selectedMode);
        clearUpload();
    };


    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
        // Clear session when switching away from document/url mode
        if (mode !== 'document' && mode !== 'weblink') clearUpload();
    };

    const handlePDFUpload = async (file) => {
        try {
            await uploadPDF(file);
            message.success(`"${file.name}" uploaded and processed! You can now ask questions about it.`);
        } catch (err) {
            message.error(`Upload failed: ${err.message}`);
        }
    };

    const handleURLUpload = async (url) => {
        try {
            await uploadURL(url);
            message.success(`Website processed! You can now ask questions about it.`);
        } catch (err) {
            message.error(`Processing fail: ${err.message}`);
        }
    };

    const isWelcome = messages.length === 0;

    return (
        <LayoutWrapper>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                selectedMode={selectedMode}
                onModeSelect={handleModeSelect}
                onNewChat={handleNewChat}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />
            <MainArea>
                <MobileHeader>
                    <Button 
                        icon={<MenuOutlined />} 
                        type="text" 
                        onClick={() => setIsSidebarOpen(true)}
                        style={{ fontSize: '20px', padding: 0, width: '40px', height: '40px' }}
                    />
                    <div style={{ marginLeft: '12px', fontWeight: 600, fontSize: '16px' }}>
                        {selectedMode === 'general' ? 'General Chat' : 
                         selectedMode === 'coding' ? 'Coding Assistant' : 
                         selectedMode === 'document' ? 'Document Q&A' : 'Web Summary'}
                    </div>
                </MobileHeader>

                {isWelcome ? (
                    <WelcomeScreen />
                ) : (
                    <ChatWindow messages={messages} selectedMode={selectedMode} onRetry={retryLastMessage} />
                )}
                <ChatInput
                    onSend={handleSend}
                    isStreaming={isStreaming}
                    onStop={stopStreaming}
                    mode={selectedMode}
                    onPDFUpload={handlePDFUpload}
                    onURLUpload={handleURLUpload}
                    uploading={uploading}
                    uploadedFile={uploadedFile}
                    sessionReady={!!sessionId}
                />
            </MainArea>
            <SettingsModal 
                open={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
            />
        </LayoutWrapper>
    );
};

export default ChatLayout;
