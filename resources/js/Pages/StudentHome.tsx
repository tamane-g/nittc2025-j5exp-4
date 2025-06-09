// 学生画面　パワポp5

import React from 'react';
import { Box, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // ← 追加

export default function StudentHome() {
  const navigate = useNavigate(); // ← 追加

  const buttonData = [
    { label: '時間割', path: '/timetable' },
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
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          padding: 130,
          paddingLeft: 40,
        }}
      >
        {buttonData.map(({ label, path }, index) => (
          <Button
            key={index}
            variant="filled"
            radius="lg"
            style={{
              ...buttonStyle,
              fontSize: label === 'ログアウト' ? '25px' : buttonStyle.fontSize,
            }}
            onClick={() => navigate(path)} // ← 追加
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
