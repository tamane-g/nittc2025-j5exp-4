// resources/js/Pages/AdminHome.tsx

import React, { useMemo } from 'react';
import { Box, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, router } from '@inertiajs/react';

export default function AdminHome() {
  // 1. 'home'と'common'の名前空間を指定
  const { t, i18n } = useTranslation(['home', 'common']);

  // 2. ボタンのデータを定義（言語に依存しないキーを追加）
  const buttonData = [
    { key: 'timetableApproval', path: route('admin.timetablechange.index') },
    { key: 'userRegistration', path: route('admin.regist.view') },
    { key: 'userDeletion', path: route('admin.remove.view') },
    { key: 'languageSettings', path: route('language.view') },
  ];

  // フォントサイズを決定する関数
  const getFontSize = (key: string) => {
    if (i18n.language === 'en') {
      if (key === 'timetableApproval' || key === 'languageSettings') {
        return '18px';
      }
      return '22px'; // 英語のデフォルト
    }
    // 日本語の場合
    if (key === 'logout') return '25px';
    if (['timetableApproval', 'userRegistration', 'userDeletion'].includes(key)) {
      return '23px';
    }
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
            {/* home.jsonのadminセクションからキーを呼び出す */}
            {t(`admin.${key}`, { ns: 'home' })}
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
              await axios.post(route('admin.logout'));
              window.location.href = '/';
            } catch (e) {
              console.error('Logout failed:', e);
            }
          }}
        >
          {t('admin.logout', { ns: 'common' })}
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
          height: 150px;
          width: 160px;
          white-space: normal; /* テキストの折り返しを許可 */
          word-break: break-word; /* 単語の途中でも改行 */
        }
        .lang-en .home-button {
          height: 150px; /* 英語でも高さを統一 */
          width: 180px; /* 少し幅を広げる */
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