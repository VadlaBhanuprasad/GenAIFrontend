import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Button, Typography, Tooltip, Tag, Spin } from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  StopOutlined,
  FilePdfOutlined,
  LinkOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const InputZone = styled.div`
  /* Mobile First */
  padding: 6px 10px calc(2px + env(safe-area-inset-bottom));
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  z-index: 10;

  /* Desktop Styles */
  @media (min-width: 769px) {
    padding: 12px 40px 8px;
  }
`;

const PDFBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f3effe;
  border: 1px solid #d0b8ff;
  border-radius: 10px;
  padding: 6px 12px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #7c3aed;
  font-weight: 500;
  
  /* Make banner text more compact on mobile */
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  @media (min-width: 769px) {
    padding: 8px 14px;
    margin-bottom: 10px;
    font-size: 13px;
    span {
      max-width: none;
    }
  }
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid #d1d1d6;
  border-radius: 12px;
  padding: 6px 8px;
  background: #fafafa;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    background: #ffffff;
  }

  @media (min-width: 769px) {
    padding: 10px 12px;
    gap: 10px;
    border-radius: 14px;
  }
`;

const AttachInput = styled.input`
  display: none;
`;

const AttachBtn = styled(Button)`
  color: #8e8e93 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 4px !important;
  height: 28px !important;
  width: 28px !important;
  flex-shrink: 0;
  font-size: 16px !important;

  &:hover {
    color: #7c3aed !important;
  }

  @media (min-width: 769px) {
     height: auto !important;
     width: auto !important;
     font-size: 16px !important;
  }
`;

const StyledTextarea = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  font-family: inherit;
  color: #1a1a1a;
  background: transparent;
  line-height: 1.3;
  max-height: 100px;
  overflow-y: auto;
  padding: 4px 0;

  &::placeholder {
    color: #b0b0b8;
  }

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #d1d1d6; border-radius: 4px; }

  @media (min-width: 769px) {
    font-size: 14px;
    line-height: 1.5;
    max-height: 160px;
  }
`;

const EnterHint = styled(Text)`
  display: none;
  font-size: 12px;
  color: #b0b0b8;
  white-space: nowrap;
  flex-shrink: 0;

  @media (min-width: 769px) {
    display: inline-block;
  }
`;

const SendBtn = styled(Button)`
  width: 30px !important;
  height: 30px !important;
  border-radius: 8px !important;
  background: ${({ $disabled }) =>
    $disabled ? '#e5e5ea' : 'linear-gradient(135deg,#7c3aed,#9d5cf0)'} !important;
  border: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0;
  box-shadow: ${({ $disabled }) =>
    $disabled ? 'none' : '0 2px 10px rgba(124,58,237,0.35)'} !important;
  transition: transform 0.15s !important;

  .anticon {
    font-size: 12px !important;
    color: ${({ $disabled }) => ($disabled ? '#b0b0b8' : '#ffffff')} !important;
  }

  &:hover:not([disabled]) {
    transform: scale(1.06) !important;
  }

  @media (min-width: 769px) {
    width: 36px !important;
    height: 36px !important;
    border-radius: 10px !important;
    .anticon {
        font-size: 15px !important;
    }
  }
`;

const StopBtn = styled(Button)`
  width: 24px !important;
  height: 24px !important;
  border-radius: 6px !important;
  border: none !important;
  color: #ffffff !important;
  background: #ff4d4f !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0;
  padding: 0 !important;
  transition: all 0.2s !important;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.25) !important;

  &:hover {
    background: #ff7875 !important;
    transform: scale(1.05) !important;
  }

  @media (min-width: 769px) {
    width: 28px !important;
    height: 28px !important;
    border-radius: 7px !important;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 6px;
  margin-bottom: 2px;
`;

const FooterText = styled(Text)`
  font-size: 10px;
  color: #b0b0b8;
  
  @media (min-width: 769px) {
    font-size: 11.5px;
  }
`;

const ChatInput = ({
  onSend,
  isStreaming,
  onStop,
  mode,
  onPDFUpload,
  onURLUpload,
  uploading,
  uploadedFile,
  sessionReady,
}) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  const handleSend = useCallback(() => {
    if (!value.trim() || isStreaming || uploading) return;
    
    // For weblink mode, first submission is the URL
    if (mode === 'weblink' && !sessionReady) {
        onURLUpload(value.trim());
        setValue('');
        return;
    }

    // Block document mode if PDF not ready
    if (mode === 'document' && !sessionReady) return;
    
    onSend(value, mode);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [value, isStreaming, onSend, mode, sessionReady, uploading, onURLUpload]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInput = (e) => {
    setValue(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onPDFUpload) onPDFUpload(file);
    e.target.value = '';
  };

  const getPlaceholder = () => {
    if (mode === 'document') {
      if (uploading) return 'Processing PDF...';
      if (!sessionReady) return 'Upload a PDF first, then ask questions...';
      return `Ask about "${uploadedFile}"...`;
    }
    if (mode === 'weblink') {
      if (uploading) return 'Extracting data from website...';
      if (!sessionReady) return 'Paste a website URL and press Enter...';
      return `Ask about the website...`;
    }
    if (mode === 'coding') return 'Ask a coding question...';
    if (mode === 'truelover') return 'Send a flirty message...';
    return 'Ask anything...';
  };

  const canSend =
    value.trim() &&
    !isStreaming &&
    !uploading &&
    (mode !== 'document' || sessionReady);

  return (
    <InputZone className="input-zone">
      {/* Ready Banner */}
      {(mode === 'document' || mode === 'weblink') && sessionReady && (
        <PDFBanner>
          <CheckCircleOutlined />
          <span>{uploadedFile}</span>
          <Tag color="purple" style={{ marginLeft: 'auto', fontSize: 11 }}>
            RAG Active
          </Tag>
        </PDFBanner>
      )}

      {/* Uploading indicator */}
      {(mode === 'document' || mode === 'weblink') && uploading && (
        <PDFBanner style={{ borderColor: '#faad14', background: '#fffbe6', color: '#d48806' }}>
          <Spin indicator={<LoadingOutlined />} size="small" />
          <span>{mode === 'weblink' ? 'Extracting website data...' : 'Processing PDF and building knowledge base...'}</span>
        </PDFBanner>
      )}

      <InputBox className="input-box">
        {/* Attach / Type button */}
        <Tooltip
          title={
            mode === 'document'
              ? 'Upload a PDF to chat with'
              : mode === 'weblink'
              ? 'Web Link mode active'
              : mode === 'truelover'
              ? 'Send some love'
              : 'Attach file (switch to Document mode for PDFs)'
          }
        >
          <AttachBtn
            icon={mode === 'weblink' ? <LinkOutlined /> : mode === 'document' ? <FilePdfOutlined /> : mode === 'truelover' ? <HeartOutlined /> : <PaperClipOutlined />}
            type="text"
            onClick={() => mode === 'document' && fileRef.current?.click()}
            style={(mode === 'document' || mode === 'weblink' || mode === 'truelover') ? { color: '#7c3aed' } : {}}
            disabled={mode === 'weblink' || mode === 'truelover'}
          />
        </Tooltip>
        <AttachInput
          ref={fileRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />

        <StyledTextarea
          ref={textareaRef}
          rows={1}
          placeholder={getPlaceholder()}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isStreaming || uploading || (mode === 'document' && !sessionReady)}
        />
        <EnterHint>⏎ Enter</EnterHint>

        {isStreaming ? (
          <StopBtn onClick={onStop}>
             <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1.2px' }} />
          </StopBtn>
        ) : (
          <SendBtn
            $disabled={!canSend}
            disabled={!canSend}
            icon={<SendOutlined />}
            onClick={handleSend}
          />
        )}
      </InputBox>

      <Footer>
        <FooterText>AI responses may produce inaccurate information.</FooterText>
      </Footer>
    </InputZone>
  );
};

export default ChatInput;
