//ログイン画面　パワポp8

import { Box, Button, Group, Stack, TextInput, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const form = useForm({
    initialValues: {
      name: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    const username = form.values.name.trim();

    if (username === 'Teacher') {
      navigate('/TeacherHome');
    } else if (username === 'Student') {
      navigate('/StudentHome');
    } else if (username === 'Admin') {
      navigate('/AdminHome');
    } else {
      alert('無効なユーザ名です');
    }
  };

  return (
    <Container style={{ position: 'fixed', padding: 0, margin: 0 }}>
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
          fontSize: '50px',
          paddingLeft: '100px',
          paddingRight: '100px',
        }}
      >
        ログイン
      </Box>

      <Stack style={{ width: '400px', marginTop: '20px', gap: '16px', padding: 10 }}>
        <Group style={{ flexDirection: 'row' }}>
          <TextInput
            size="lg"
            label="ユーザ名"
            placeholder="Teacher / Student / Admin"
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
        </Group>

        <Group style={{ flexDirection: 'row' }}>
          <TextInput
            type="password"
            size="lg"
            label="パスワード"
            placeholder="password"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
        </Group>
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
          variant="filled"
          radius="xs"
          onClick={handleSubmit}
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
      </Group>
    </Container>
  );
}
