// resources/js/Pages/NotificationPage.tsx (ファイル名も変更をおすすめします)

import React, { useEffect, useState } from 'react';
import { Box, Container, Table, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react'; // InertiaのLinkコンポーネントを使用

// --- データ型定義 ---
interface Notification {
  sender: string;
  // 3. 言語に依存しないキーに変更
  subjectKey: 'rejected' | 'approved' | 'changeNeeded';
  date: string;
}

// --- メインコンポーネント ---
export default function NotificationPage() {
  // 1. 'notification'と'common'の名前空間を指定
  const { t, i18n } = useTranslation(['notification', 'common']);

  // --- モックデータ ---
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // t関数が使えるようになってからデータを設定
    setNotifications([
      { sender: t('teacher:name', { ns: 'notification' }), subjectKey: 'rejected', date: '1945/12/25' },
      { sender: t('teacher', { ns: 'common' }), subjectKey: 'approved', date: '1945/12/26' },
      { sender: t('admin', { ns: 'common' }), subjectKey: 'changeNeeded', date: '1945/12/27' },
    ]);
  }, [i18n.language, t]);
  // --- ここまでモックデータ ---


  // --- テーブルヘッダー ---
  const tableHeaders = [
    { key: 'sender', label: t('teacher:sender', { ns: 'notification' }) },
    { key: 'subject', label: t('teacher:subject', { ns: 'notification' }) },
    { key: 'date', label: t('teacher:date', { ns: 'notification' }) },
  ];

  return (
    <Container style={{ paddingTop: 120 }}>
      <Box
        h={100}
        bg="var(--mantine-color-blue-filled)"
        style={{
          color: 'white',
          fontSize: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        {/* 2. t関数でタイトルを翻訳 */}
        {t('teacher:title', { ns: 'notification' })}
      </Box>

      <Table mt="md" withTableBorder style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '18px', textAlign: 'center' }}>
        <Table.Thead>
          <Table.Tr>
            {tableHeaders.map((header) => (
              <th
                key={header.key}
                style={{
                  backgroundColor: 'var(--mantine-color-blue-filled)',
                  color: 'white',
                  border: '2px solid black',
                }}
              >
                {header.label}
              </th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {notifications.map((item, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ccc' }}>{item.sender}</td>
              {/* 3. subjectKeyを使って翻訳 */}
              <td style={{ border: '1px solid #ccc', color: '#3B72C3' }}>{t(`teacher:${item.subjectKey}`, { ns: 'notification' })}</td>
              <td style={{ border: '1px solid #ccc' }}>{item.date}</td>
            </tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
        }}
      >
        {/* 4. 「戻る」ボタンをInertiaのLinkに変更 */}
        <Link href="/">
          <Button
            variant="filled"
            radius="xs"
            style={{ width: '150px', height: '50px' }}
          >
            {t('back', { ns: 'common' })}
          </Button>
        </Link>
      </Group>
    </Container>
  );
}