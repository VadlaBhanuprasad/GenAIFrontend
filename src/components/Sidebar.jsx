import React from 'react';
import styled from 'styled-components';
import { Button, Typography } from 'antd';
import {
    PlusOutlined,
    ThunderboltOutlined,
    CodeOutlined,
    FileTextOutlined,
    LinkOutlined,
    HeartOutlined,
    DatabaseOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const SidebarWrapper = styled.aside`
  width: 240px;
  min-width: 240px;
  height: 100vh;
  background: #f7f7f8;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NewChatBtn = styled(Button)`
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1.5px solid #d1d1d6;
  background: #ffffff;
  color: #1a1a1a;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  padding: 0 14px;
  box-shadow: none;
  margin-bottom: 20px;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: #ececec !important;
    border-color: #b0b0b8 !important;
    color: #1a1a1a !important;
  }
`;

const SectionLabel = styled(Text)`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #8e8e93;
  text-transform: uppercase;
  padding: 0 4px;
  margin-bottom: 6px;
  display: block;
`;

const ModeList = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d1d6;
    border-radius: 4px;
  }
`;

const ModeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  color: ${({ $active }) => ($active ? '#7c3aed' : '#3a3a3c')};
  background: ${({ $active }) => ($active ? '#e8e8f0' : 'transparent')};
  font-weight: ${({ $active }) => ($active ? '600' : '500')};

  &:hover {
    background: ${({ $active }) => ($active ? '#e8e8f0' : '#ececee')};
  }

  .anticon {
    font-size: 18px;
    color: ${({ $active }) => ($active ? '#7c3aed' : '#8e8e93')};
  }
`;

const BottomNav = styled.div`
  border-top: 1px solid #e5e5e5;
  padding-top: 12px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #3a3a3c;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s;

  &:hover {
    background: #ececee;
  }

  .anticon {
    font-size: 16px;
    color: #8e8e93;
  }
`;

const MODES = [
    { key: 'general', icon: <ThunderboltOutlined />, name: 'General Chat' },
    { key: 'coding', icon: <CodeOutlined />, name: 'Coding Assistant' },
    { key: 'document', icon: <FileTextOutlined />, name: 'Document Q&A' },
    { key: 'weblink', icon: <LinkOutlined />, name: 'Web Link Summary' },
    // { key: 'truelover', icon: <HeartOutlined />, name: 'True Lover' },
];

const Sidebar = ({ selectedMode, onModeSelect, onNewChat, onOpenSettings }) => {
    return (
        <SidebarWrapper>
            <NewChatBtn className="sidebar-btn" icon={<PlusOutlined />} onClick={onNewChat}>
                New Chat
            </NewChatBtn>

            <SectionLabel>Modes</SectionLabel>

            <ModeList>
                {MODES.map(mode => (
                    <ModeItem
                        key={mode.key}
                        $active={selectedMode === mode.key ? 1 : 0}
                        onClick={() => onModeSelect(mode.key)}
                        className={`mode-item ${selectedMode === mode.key ? 'mode-item-active' : ''}`}
                    >
                        {mode.icon}
                        <span>{mode.name}</span>
                    </ModeItem>
                ))}
            </ModeList>

            <BottomNav>
                <NavItem className="bottom-nav-item">
                    <DatabaseOutlined />
                    Knowledge Base
                </NavItem>
                <NavItem className="bottom-nav-item" onClick={onOpenSettings}>
                    <SettingOutlined />
                    Settings
                </NavItem>
            </BottomNav>
        </SidebarWrapper>
    );
};

export default Sidebar;
