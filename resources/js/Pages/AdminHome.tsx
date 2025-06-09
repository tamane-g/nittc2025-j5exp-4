// 管理画面　パワポp6

import React from 'react';
import { Box, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // ← 追加

export default function AdminHome() {
  const navigate = useNavigate(); // ← 追加

  const buttonData = [
    { label: '時間割', path: '/timetable' },
    { label: '時間割承認', path: '/admin' },
    { label: '通知', path: '/notification' },
    { label: 'ユーザ登録', path: '/registration' },
    { label: 'ユーザ削除', path: '/remove' },
    { label: '言語設定', path: '/language' },
    { label: 'ログアウト', path: '/' },
  ];

  const smallFont25 = ['ログアウト'];
  const smallFont23 = ['時間割承認', 'ユーザ登録', 'ユーザ削除'];

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
              fontSize:
                smallFont25.includes(label)
                  ? '25px'
                  : smallFont23.includes(label)
                  ? '23px'
                  : buttonStyle.fontSize,
            }}
            onClick={() => navigate(path)} // ← ここで遷移
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}