import React from 'react';
import {
  Box,
  Button,
  Group,
  Stack,
  Container,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom'; // ← 追加

export default function Language() {
  const form = useForm({
    initialValues: {
      name: '',
      language: '',
    },
  });

  const navigate = useNavigate(); // ← 追加

  const handleSubmit = () => {
    console.log('送信データ:', form.values);
  };

  return (
    <Container
      style={{
        position: 'fixed',
        padding: 0,
        margin: 0,
        width: 500,
        height: '100vh',
      }}
    >
      <Box
        bg="var(--mantine-color-blue-filled)"
        h={100}
        w={500}
        style={{
          top: 0,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
        }}
      >
        言語設定
      </Box>

      <Stack style={{ width: '400px', marginTop: '40px', padding: 10 }}>
        <Select
          label="言語"
          placeholder="選択してください"
          data={['日本語', '英語']}
          size="lg"
          {...form.getInputProps('language')}
        />
      </Stack>

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
        <Button
          onClick={handleSubmit}
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
          設定
        </Button>
      </Group>
    </Container>
  );
}