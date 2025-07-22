//ログイン画面　パワポp8

import { Box, Button, Group, Stack, TextInput, Container } from '@mantine/core';
import { useForm } from '@inertiajs/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const { data, setData, post } = useForm({
    name: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    // Inertia.jsのpostメソッドを使用します。
    post('/login');
  };

  return (
    <>
      <Container className="login-container">
        <Box className="login-header">
          {t('Login.Title')}
        </Box>

        <Stack className="login-form">
          <TextInput
            size="lg"
            label={t('Login.Username')}
            placeholder={t('Login.UsernamePlaceholder')}
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
          />
          <TextInput
            type="password"
            size="lg"
            label={t('Login.Password')}
            placeholder={t('Login.PasswordPlaceholder')}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
          />
        </Stack>

        <Group className="login-buttons">
          <Button variant="filled" radius="xs" className="back-button">
            {t('back')}
          </Button>
          <Button variant="filled" radius="xs" onClick={handleSubmit} className="submit-button">
            {t('Login.Submit')}
          </Button>
        </Group>
      </Container>
      <style>{`
        /* Default (PC) styles to match original */
        .login-container {
          position: fixed;
          padding: 0;
          margin: 0;
        }
        .login-header {
          background-color: var(--mantine-color-blue-filled);
          height: 100px;
          width: 500px;
          top: 0;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          padding-left: 100px;
          padding-right: 100px;
        }
        .login-form {
          width: 400px;
          margin-top: 20px;
          gap: 16px;
          padding: 10px;
        }
        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 150px;
          height: 50px;
        }
        .submit-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 150px;
          height: 50px;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .login-container {
            position: static; /* Override fixed positioning */
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 20px;
            box-sizing: border-box;
          }
          .login-header {
            position: static;
            width: 100%;
            max-width: 500px;
            height: auto;
            font-size: 36px;
            padding: 15px 20px;
          }
          .login-form {
            width: 100%;
            max-width: 400px;
            margin-top: 30px;
          }
          .login-buttons {
            margin-top: 20px;
            width: 100%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .back-button, .submit-button {
            position: static; /* Override fixed positioning */
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
