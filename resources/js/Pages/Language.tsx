// resources/js/Pages/Language.tsx

import React, { useEffect } from 'react';
import { Box, Button, Group, Stack, Container, Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
// Linkは不要になるので削除してもOKです
// import { Link } from '@inertiajs/react';

export default function Language() {
  // 1. 'common'の名前空間を明示的に指定
  const { t, i18n } = useTranslation('common');

  // 2. 画面表示時に一度だけ言語設定をサーバーから取得
  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await axios.get('/language');
        const lang = response.data?.user?.language;
        if (lang && i18n.language !== lang) {
          i18n.changeLanguage(lang);
        }
      } catch (error) {
        console.error("Error fetching language:", error);
      }
    };
    fetchLanguage();
  }, []); // 依存配列を空にして、初回レンダリング時のみ実行

  // 言語が変更されたときの処理
  const handleLanguageChange = async (value: string | null) => {
    if (value) {
      try {
        // サーバーに新しい言語設定を保存
        await axios.post('/language', { language: value });
        // フロントエンドの言語を即座に切り替え
        i18n.changeLanguage(value);
      } catch (error) {
        console.error("Error updating language:", error);
      }
    }
  };

  return (
    <>
      <Container className="language-container">
        <Box className="language-header">
          {/* 3. キーを直接指定 */}
          {t('languageSettings')}
        </Box>

        <Stack className="language-form">
          <Select
            label={t('language')}
            placeholder={t('selectLanguage')}
            data={[
              // 3. キーを直接指定
              { value: 'ja', label: t('japanese') },
              { value: 'en', label: t('english') },
            ]}
            size="lg"
            value={i18n.language}
            onChange={handleLanguageChange}
          />
        </Stack>

        <Group className="language-buttons">
          {/* 4. 直前のページに戻るボタン */}
          <Button
            onClick={() => window.history.back()}
            variant="filled"
            radius="xs"
            className="back-button"
          >
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
