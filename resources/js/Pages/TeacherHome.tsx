// resources/js/Pages/TeacherHome.tsx

import axios from 'axios';
import React, { useMemo } from 'react';
import { Box, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';

export default function TeacherHome() {
  // 1. 'home'と'common'の名前空間を指定
  const { t, i18n } = useTranslation(['home', 'common']);

  // 2. ボタンのデータを定義（言語に依存しないキーを追加）
  const buttonData = [
    { key: 'timetable', path: route('teacher.timetable.view') },
    { key: 'changeRequest', path: route('teacher.timetablechange.view') }, // 変更申請画面のパスを修正
    { key: 'notification', path: route('teacher.notice') },
    { key: 'languageSettings', path: route('language.view') },
  ];

  // フォントサイズを決定する関数
  const getFontSize = (key: string) => {
    if (i18n.language === 'en') {
      if (key === 'languageSettings' || key === 'changeRequest') {
        return '20px'; // 英語の場合
      }
      return '24px'; // 英語のデフォルト
    }
    // 日本語の場合
    return '28px'; // 日本語のデフォルト
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
        {/* 3. common.jsonから'home'キーを呼び出す */}
        {t('home', { ns: 'common' })}
      </Box>

      <div className={`button-container ${i18n.language === 'en' ? 'lang-en' : ''}`}>
        {buttonData.map(({ key, path }) => (
          <Button
            key={`${'home'}-${key}`}
            component={Link}
            href={path}
            variant="filled"
            radius="lg"
            className="home-button"
            style={{ fontSize: getFontSize(key) }}
          >
            {/* home.jsonのteacherセクションからキーを呼び出す */}
            {t(`teacher.${key}`, { ns: 'home' })}
          </Button>
        ))}

        <Button
          key="logout"
          variant="filled"
          radius="lg"
          className="home-button"
          style={{ fontSize: getFontSize('logout') }}
          onClick={async () => {
            try {
              await axios.post(route('teacher.logout'));
              window.location.href = '/';
            } catch (e) {
              console.error('Logout failed:', e);
            }
          }}
        >
          {t('logout', { ns: 'common' })}
        </Button>
      </div>

      {/* --- CSSスタイル --- */}
      <style>{`
        .button-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 130px 40px;
          justify-content: center; /* ボタンを中央揃え */
        }
       .home-button {
          min-width: 160px;
          padding: 20px;
          height: 150px;
          white-space: normal;
          word-break: break-word;
        }
        .lang-en .home-button {
          min-width: 180px; /* 英語だと少し余裕 */
          max-width: 250px;  /* 長すぎないように上限 */
        }
        @media (max-width: 768px) {
          .button-container {
            flex-direction: column;
            align-items: center;
            padding: 120px 20px;
          }
          .home-button {
            width: 80%;
            max-width: 300px; /* 最大幅を設定 */
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
}