//通知画面　パワポp12

import React from 'react';
import {
  Box,
  Container,
  Table,
  Button,
  Group,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // ← 追加

const notifications = [
  {
    sender: '名前',
    subject: '却下されました',
    date: '1945/12/25',
  },
  {
    sender: '先生',
    subject: '承認されました',
    date: '1945/12/26',
  },
  {
    sender: '管理者',
    subject: '変更が必要です',
    date: '1945/12/27',
  },
];

export default function NotificationPage() {
  const navigate = useNavigate(); // ← 追加

  return (
    <Container style={{ paddingTop: 120 }}>
      <Box
        h={100}
        bg="var(--mantine-color-blue-filled)"
        style={{
          color: 'white',
          fontSize: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        通知
      </Box>

      <Table mt="md" withTableBorder style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '18px', textAlign: 'center' }}>
        <thead>
          <tr>
            {['差出人', '件名', '日付'].map((title) => (
              <th
                key={title}
                style={{
                  backgroundColor: 'var(--mantine-color-blue-filled)',
                  color: 'white',
                  border: '2px solid black',
                }}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {notifications.map((item, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ccc' }}>{item.sender}</td>
              <td style={{ border: '1px solid #ccc', color: '#3B72C3' }}>{item.subject}</td>
              <td style={{ border: '1px solid #ccc' }}>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Group
        style={{
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: '20px',
          left: 0,
          right: 0,
          padding: '0 20px',
        }}
      >
        <Button
          variant="filled"
          radius="xs"
          onClick={() => navigate(-1)} // ← 追加
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            width: '150px',
            height: '50px',
          }}
        >
          戻る
        </Button>
      </Group>
    </Container>
  );
}
