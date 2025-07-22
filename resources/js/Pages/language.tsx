import React from 'react';
import {
  Box,
  Button,
  Group,
  Stack,
  Container,
  Select,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Language() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      i18n.changeLanguage(value);
    }
  };

  return (
    <>
      <Container className="language-container">
        <Box className="language-header">
          {t('languageSettings')}
        </Box>

        <Stack className="language-form">
          <Select
            label={t('language')}
            placeholder={t('selectLanguage')}
            data={[
              { value: 'ja', label: t('Language.japanese') },
              { value: 'en', label: t('Language.english') },
            ]}
            size="lg"
            value={i18n.language}
            onChange={handleLanguageChange}
          />
        </Stack>

        <Group className="language-buttons">
          <Button variant="filled" radius="xs" onClick={() => navigate(-1)} className="back-button">
            {t('back')}
          </Button>
        </Group>
      </Container>
      <style>{`
        /* Default (PC) styles to match original */
        .language-container {
          position: fixed;
          padding: 0;
          margin: 0;
          width: 500px;
          height: 100vh;
        }
        .language-header {
          background-color: var(--mantine-color-blue-filled);
          height: 100px;
          width: 500px;
          top: 0;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
        }
        .language-form {
          width: 400px;
          margin-top: 40px;
          padding: 10px;
        }
        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 150px;
          height: 50px;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .language-container {
            position: static;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 20px;
            box-sizing: border-box;
          }
          .language-header {
            position: static;
            width: 100%;
            max-width: 500px;
            height: auto;
            font-size: 28px;
            padding: 15px;
          }
          .language-form {
            width: 100%;
            max-width: 400px;
            margin-top: 30px;
          }
          .language-buttons {
            margin-top: 20px;
            width: 100%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .back-button {
            position: static;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
