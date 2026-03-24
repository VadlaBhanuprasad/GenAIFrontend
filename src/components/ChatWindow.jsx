import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import MessageBubble from './MessageBubble';

const WindowWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d1d6;
    border-radius: 6px;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c0ca;
  font-size: 14px;
`;

const ChatWindow = ({ messages, selectedMode, onRetry }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <WindowWrapper>
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} selectedMode={selectedMode} onRetry={onRetry} />
      ))}
      <div ref={bottomRef} />
    </WindowWrapper>
  );
};

export default ChatWindow;
