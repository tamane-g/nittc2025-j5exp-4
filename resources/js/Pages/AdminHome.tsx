// 管理画面　パワポp6

import React from 'react';
import { Box, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // ← 追加
import { useTranslation } from 'react-i18next';

export default function AdminHome() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); // ← 追加

  const buttonData = [
    { label: t('AdminHome.timetable'), path: '/timetable' },
    { label: t('AdminHome.timetableApproval'), path: '/admin' },
    { label: t('AdminHome.notification'), path: '/teachernotification' },
    { label: t('AdminHome.userRegistration'), path: '/registration' },
    { label: t('AdminHome.userDeletion'), path: '/remove' },
    { label: t('AdminHome.languageSettings'), path: '/language' },
    { label: t('AdminHome.logout'), path: '/' },
  ];

  const smallFont25 = [t('AdminHome.logout')];
  const smallFont23 = [t('AdminHome.timetableApproval'), t('AdminHome.userRegistration'), t('AdminHome.userDeletion')];

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
        {buttonData.map(({ label, path }, index) => (
          <Button
            key={index}
            variant="filled"
            radius="lg"
            className="home-button"
            style={{
              fontSize:
                i18n.language === 'en' && (label === t('AdminHome.timetableApproval') || label === t('AdminHome.languageSettings'))
                  ? '18px' // 英語のTimetable ApprovalとLanguage Settingsのフォントサイズ
                  : smallFont25.includes(label)
                  ? '25px'
                  : smallFont23.includes(label)
                  ? '23px'
                  : buttonStyle.fontSize,
            }}
            onClick={() => {
              if (label === t('AdminHome.logout')) {
                i18n.changeLanguage('ja');
              }
              navigate(path);
            }}
          >
            {label}
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
