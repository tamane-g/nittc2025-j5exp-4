//教師画面　パワポp4

import React from 'react';
import { Box, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';

export default function TeacherHome() {
  const { t, i18n } = useTranslation();

  const buttonConfigs = [
    { label: t('TeacherHome.timetable'), path: '/timetable' },
    { label: t('TeacherHome.changeRequest'), path: '/timetableClick' }, // 元の変更申請画面
    
    { label: t('TeacherHome.notification'), path: '/teachernotification' },
    { label: t('TeacherHome.languageSettings'), path: '/language' },
    { label: t('TeacherHome.logout'), path: '/' },
  ];

  const buttonStyle = {
    height: '150px',
    width: '160px',
    fontSize: '28px',
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
        {t('Home')}
      </Box>
            <div
        className={`button-container ${i18n.language === 'en' ? 'lang-en' : ''}`}
      >
        {buttonConfigs.map((btn, index) => (
          <Button
            key={index}
            component={Link}
            href={btn.path}
            variant="filled"
            radius="lg"
            onClick={() => {
              if (btn.label === t('TeacherHome.logout')) {
                i18n.changeLanguage('ja');
              }
            }}
            className="home-button"
            style={{
              fontSize:
                i18n.language === 'en' && btn.label === t('TeacherHome.languageSettings')
                  ? '18px' // 英語のLanguage Settingsのフォントサイズ
                  : btn.label === t('TeacherHome.logout')
                  ? '25px'
                  : buttonStyle.fontSize,
            }}
          >
            {btn.label}
          </Button>
        ))}
      </div>
      <style>{`
        .button-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 130px 40px;
        }
        .home-button {
          height: 150px; /* 日本語表示時の元の高さ */
          width: 160px;
          font-size: 28px;
        }
        .lang-en .home-button {
          height: 190px; /* 英語表示時の高さ */
          width: 230px; /* 英語表示時の幅 */
          font-size: 18px; /* 英語表示時のフォントサイズ */
          white-space: normal !important; /* テキストの折り返しを強制 */
          word-break: break-word !important; /* 単語の途中で改行を強制 */
        }
        @media (max-width: 768px) {
          .button-container {
            flex-direction: column;
            align-items: center;
            padding: 120px 20px;
          }
          .home-button {
            width: 80%;
            height: 80px;
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
