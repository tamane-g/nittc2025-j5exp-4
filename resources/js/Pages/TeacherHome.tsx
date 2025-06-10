//教師画面　パワポp4

import React from 'react';
import { Box, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function TeacherHome() {
  const navigate = useNavigate();

  const buttonConfigs = [
    { label: '時間割', path: '/timetable' },
    { label: '変更申請', path: '/timetableClick' },
    { label: '通知', path: '/notification' },
    { label: '言語設定', path: '/language' },
    { label: 'ログアウト', path: '/' },
  ];

  const buttonStyle = {
    height: '150px',
    width: '160px',
    fontSize: '28px',
  };

  return (
    <div>
      <Box
        h={100}
        w="100%"
        bg="var(--mantine-color-blue-filled)"
        style={{
          position: 'fixed',
          top: 0,
          fontSize: '50px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ホーム
      </Box>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: 130, paddingLeft: 40 }}>
        {buttonConfigs.map((btn, index) => (
          <Button
            key={index}
            variant="filled"
            radius="lg"
            onClick={() => navigate(btn.path)}
            style={{
              ...buttonStyle,
              fontSize: btn.label === 'ログアウト' ? '25px' : buttonStyle.fontSize,
            }}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}