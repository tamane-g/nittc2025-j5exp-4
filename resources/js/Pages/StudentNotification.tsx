// resources/js/Pages/studentNotification.tsx

import React, { useState } from 'react'; // useStateをインポート
import { Box, Container, Table, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';

// --- バックエンドから渡されるデータの型定義 ---
interface NoticeFromBackend {
  id: number;
  title?: string | null;
  description?: string | null;
  owner?: string | null;
  created_at: string;
  updated_at: string;
}

// --- フロントエンドで表示に使うデータの型定義 (descriptionを追加) ---
interface StudentNotice {
  user: string;
  subject: string;
  description: string; // 詳細表示のために追加
  date: string;
}

// --- Main Component ---
export default function StudentNotification() {
  const { t } = useTranslation(['notification', 'common']);
  
  // 1. 開いている行のインデックスを管理するStateを追加
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { notice: noticesFromProps } = usePage().props as { notice: NoticeFromBackend[] };

  const notifications: StudentNotice[] = noticesFromProps.map((item) => {
    const formattedDate = new Date(item.created_at).toISOString().split('T')[0];
    
    return {
      user: item.owner || t('admin', { ns: 'common' }),
      subject: item.title || `(${t('student.noSubject', { ns: 'notification' })})`,
      // descriptionもここで設定
      description: item.description || '', 
      date: formattedDate,
    };
  });

  // --- Table Headers ---
  const tableHeaders = [
    { key: 'sender', label: t('student.sender', { ns: 'notification' }) },
    { key: 'subject', label: t('student.subject', { ns: 'notification' }) },
    { key: 'date', label: t('student.date', { ns: 'notification' }) },
  ];
  
  // 2. 件名クリック時の処理を定義
  const handleSubjectClick = (index: number) => {
    // 同じ行がクリックされたら閉じる、違う行なら開く
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Container className="notification-container">
      <Box className="notification-header">
        {t('student.title', { ns: 'notification' })}
      </Box>

      <Table mt="md" withTableBorder className="notification-table">
        <Table.Thead>
          <Table.Tr>
            {tableHeaders.map((header) => (
              <Table.Th key={header.key}>{header.label}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {notifications.map((item, index) => (
            // 3. React.Fragment を使って複数の行をグループ化
            <React.Fragment key={index}>
              <Table.Tr>
                <Table.Td>{item.user}</Table.Td>
                <Table.Td
                  onClick={() => handleSubjectClick(index)} // クリックイベントを追加
                  style={{ color: '#3B72C3', cursor: 'pointer', fontWeight: 'bold' }} // クリック可能であることを示すスタイル
                >
                  {item.subject}
                </Table.Td>
                <Table.Td>{item.date}</Table.Td>
              </Table.Tr>
              {/* 4. expandedIndexが現在の行と一致する場合に詳細行を表示 */}
              {expandedIndex === index && (
                <Table.Tr>
                  <Table.Td colSpan={tableHeaders.length} style={{ textAlign: 'left', padding: '16px' }}>
                    {item.description}
                  </Table.Td>
                </Table.Tr>
              )}
            </React.Fragment>
          ))}
        </Table.Tbody>
      </Table>

      <Group className="back-button-group">
        <Button
          onClick={() => window.history.back()}
          variant="filled"
          radius="xs"
          className="back-button"
        >
          {t('back', { ns: 'common' })}
        </Button>
      </Group>

      {/* --- Styles --- */}
      <style>{`
        /* スタイル部分は変更なしなので省略 */
        .notification-container {
          padding-top: 120px;
        }
        .notification-header {
          background-color: var(--mantine-color-blue-filled);
          color: white;
          font-size: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1;
          height: 100px;
        }
        .notification-table {
          margin-left: auto;
          margin-right: auto;
          font-size: 18px;
          text-align: center;
        }
        .notification-table th, .notification-table td {
          border: 1px solid #ccc;
          white-space: normal;
          word-wrap: break-word;
        }
        .notification-table th {
          background-color: var(--mantine-color-blue-filled);
          color: white;
          border: 2px solid black;
        }
        .back-button-group {
          position: fixed;
          bottom: 20px;
          left: 20px;
        }
        .back-button {
          width: 150px;
          height: 50px;
        }
        @media (max-width: 768px) {
          .notification-header {
            font-size: 36px;
            height: 80px;
          }
          .notification-table {
            font-size: 14px;
          }
          .back-button-group {
            width: calc(100% - 40px);
            left: 20px;
            bottom: 20px;
          }
          .back-button {
            width: 100%;
          }
        }
      `}</style>
    </Container>
  );
}