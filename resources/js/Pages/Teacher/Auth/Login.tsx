// resources/js/Pages/Auth/Login.tsx

import { Box, Button, Group, Stack, TextInput, Container, Checkbox, Text } from '@mantine/core';
import { useForm, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { HTMLAttributes, useEffect } from 'react';

// エラー表示用のコンポーネント
function InputError({ message, className = '', ...props }: { message?: string } & HTMLAttributes<HTMLParagraphElement>) {
  return message ? (
    <p {...props} className={`text-sm text-red-600 ${className}`}>
      {message}
    </p>
  ) : null;
}

// Propsの型定義
interface LoginProps {
  status?: string;
  canResetPassword?: boolean;
}

export default function LoginAdmin({ status, canResetPassword }: LoginProps) {
  const { t } = useTranslation('login');

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false as boolean,
  });

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post('/teacher/login', {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <Container className="login-container">
        <Box className="login-header">
          {t('title')}
        </Box>

        {status && <Text className="login-status">{status}</Text>}

        <form onSubmit={submit}>
          <Stack className="login-form">
            <TextInput
              size="lg"
              label={t('username')}
              placeholder="your@email.com"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
            <InputError message={errors.email} />

            <TextInput
              type="password"
              size="lg"
              label={t('password')}
              placeholder={t('passwordPlaceholder')}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              required
              autoComplete="current-password"
            />
            <InputError message={errors.password} />

            <Checkbox
              label={t('rememberMe', 'Remember me')}
              checked={data.remember}
              onChange={(event) => setData('remember', event.currentTarget.checked)}
            />
          </Stack>

          <Group className="login-buttons-wrapper">
            <Group className="bottom-left-buttons">
              <Link href="/student/login" as="button">
                <Button variant="outline" radius="xs" className="link-button">
                  生徒
                </Button>
              </Link>
              <Button component="span" variant="outline" radius="xs" className="link-button" disabled>
                教師
              </Button>
              <Link href="/admin/login" as="button">
                <Button variant="outline" radius="xs" className="link-button">
                  管理人
                </Button>
              </Link>
            </Group>

            <Button type="submit" variant="filled" radius="xs" className="submit-button" disabled={processing}>
              {t('submit')}
            </Button>
          </Group>
        </form>
      </Container>

      <style>{`
        .login-container {
          position: fixed;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
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
          padding: 0 100px;
        }
        .login-status {
          margin-top: 1rem;
          font-weight: 500;
          color: var(--mantine-color-green-7);
        }
        .login-form {
          width: 400px;
          margin-top: 20px;
          gap: 16px;
          padding: 10px;
        }
        .login-actions {
          width: 400px;
          justify-content: flex-end;
          margin-top: 10px;
        }
        .forgot-password-link {
          font-size: var(--mantine-font-size-sm);
          color: var(--mantine-color-gray-6);
          text-decoration: none;
        }
        .forgot-password-link:hover {
          text-decoration: underline;
        }
        .text-sm {
          font-size: 0.875rem;
        }
        .text-red-600 {
          color: #DC2626;
        }
        .login-buttons-wrapper {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .bottom-left-buttons {
          gap: 15px;
        }
        .link-button {
          width: 120px;
          height: 50px;
        }
        .submit-button {
          width: 150px;
          height: 50px;
        }

        @media (max-width: 768px) {
          .login-container {
            position: static;
            width: 100%;
            min-height: 100vh;
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
          .login-form, .login-actions {
            width: 100%;
            max-width: 400px;
          }
          .login-buttons-wrapper {
            position: static;
            margin-top: 30px;
            flex-direction: column-reverse;
            gap: 20px;
            width: 100%;
            max-width: 400px;
          }
          .bottom-left-buttons {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            width: 100%;
            gap: 10px;
          }
          .link-button, .submit-button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
