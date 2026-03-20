import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 24px;
  animation: ${fadeIn} 0.4s ease;
`;

const IconBox = styled.div`
  width: 75px;
  height: 75px;
  border-radius: 32px;
  background: linear-gradient(135deg, #7c3aed, #9d5cf0);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  box-shadow: 0 12px 32px rgba(124, 58, 237, 0.35);

  .anticon {
    font-size: 35px;
    color: #ffffff;
  }
`;

const Heading = styled(Title)`
  && {
    font-size: 32px;
    font-weight: 700;
    color: inherit;
    margin-bottom: 10px;
    text-align: center;
  }
`;

const SubText = styled(Text)`
  font-size: 15px;
  color: inherit;
  opacity: 0.8;
  text-align: center;
  max-width: 360px;
  line-height: 1.6;
  display: block;
`;

const WelcomeScreen = () => {
  return (
    <Wrapper className="dark:text-white text-gray-900">
      <IconBox className="transform hover:scale-110 transition-transform duration-300">
        <ThunderboltOutlined />
      </IconBox>
      <Heading level={2}>
        Welcome to{" "}
        <span className="text-[#7c3aed] dark:text-[#a78bfa]">
          BhanuAI
        </span>
      </Heading>
      <SubText>
        I am ready to assist you. Select a mode from the sidebar or start typing below.
      </SubText>
    </Wrapper>
  );
};

export default WelcomeScreen;

