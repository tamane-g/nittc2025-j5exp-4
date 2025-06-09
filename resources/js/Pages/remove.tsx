//ユーザ登録画面　パワポp9

import React from 'react';
import {Box,Button} from '@mantine/core';
import { FileInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // ← 追加

export default function App() {
  const navigate = useNavigate(); // ← 追加
 
  return (
    <div>
      <Box
        h={100}
        bg="var(--mantine-color-blue-filled)"
        style={{
          position: 'fixed',
          top: 0,
          fontSize: '50px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start', 
          paddingLeft: '70px',
          paddingRight: '70px' 
        }}
      >
        ユーザー削除
      </Box>
      <Box style={{ marginTop: '120px', paddingLeft: '20px',fontSize: '20px' }}>
        CSVファイルを選択してください。
      </Box>
      <FileInput style={{ paddingLeft: '70px' }}
      w={300}
      size="lg"
      placeholder="CSVファイルを選択"
      styles={{
        input: { 
          border: '3px solid black',
          textAlign: 'center',
          marginTop: '20px', 
          padding: '10px',           
          fontSize: '16px',         
        },
      }}
    />
    <Button
        variant="filled"
        radius="xs"
        onClick={() => navigate(-1)} // ← 追加
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '100px',
          height: '50px',
        }}
      >
        戻る
    </Button>
    <Button
        variant="filled"
        radius="xs"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '150px',
          height: '50px',
        }}
      >
        送信
      </Button>
    </div>
  );
}
