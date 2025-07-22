import React from 'react';
import {
  Box,
  Container,
  Table,
  Button,
  Group,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 表示する授業変更のデータ
export default function StudentNotification() {
  const { t } = useTranslation();

  // 表示する授業変更のデータ
  const classChanges = [
    {
      date: '7/10',
      period: '3-4',
      before: '',
      after: t('StudentNotification.realtimeOSEngineering'),
    },
    {
      date: '7/23',
      period: '5-6',
      before: t('StudentNotification.embeddedSystemsOverview'),
      after: t('StudentNotification.realtimeOSEngineering'),
    },
  ];
  const navigate = useNavigate();

  // テーブルヘッダーの定義
  const tableHeaders = [t('StudentNotification.date'), t('StudentNotification.period'), t('StudentNotification.before'), t('StudentNotification.after')];

  // テーブルの行を生成
  const rows = classChanges.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{item.date}</Table.Td>
      <Table.Td>{item.period}</Table.Td>
      <Table.Td>{item.before}</Table.Td>
      <Table.Td>{item.after}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Container className="notification-container">
      {/* ヘッダー */}
      <Box
        component="header"
        className="notification-header"
      >
        {t('StudentNotification.title')}
      </Box>

      {/* 授業変更テーブル */}
      <Table
        mt="md"
        withTableBorder
        className="notification-table"
      >
        <Table.Thead>
          <Table.Tr>
            {tableHeaders.map((header) => (
              <Table.Th key={header}>
                {header}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {/* 戻るボタン */}
      <Group className="back-button-group">
        <Button
          variant="filled"
          radius="xs"
          onClick={() => navigate(-1)}
          className="back-button"
        >
          {t('back')}
        </Button>
      </Group>
      <style>{`
        .notification-container {
          padding-top: 120px;
          padding-bottom: 100px;
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
          border-collapse: collapse;
        }
        .notification-table th, .notification-table td {
          border: 1px solid #ccc;
          white-space: normal; /* 明示的に設定 */
          word-wrap: break-word; /* 追加 */
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
            font-size: 28px;
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
