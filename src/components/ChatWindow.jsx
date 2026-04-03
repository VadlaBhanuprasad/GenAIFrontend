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

const ChatWindow = ({ messages, isStreaming, selectedMode, onRetry }) => {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if we are close to the bottom (within 100px)
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

    // Only auto-scroll if we are near the bottom OR it's a new message
    if (isAtBottom || isStreaming) {
      bottomRef.current?.scrollIntoView({ behavior: isStreaming ? 'auto' : 'smooth' });
    }
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <WindowWrapper ref={containerRef}>
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} selectedMode={selectedMode} onRetry={onRetry} />
      ))}
      <div ref={bottomRef} style={{ height: '1px', flexShrink: 0 }} />
    </WindowWrapper>
  );
};

export default ChatWindow;
