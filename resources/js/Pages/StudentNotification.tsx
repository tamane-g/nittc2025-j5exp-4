import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Table,
  Button,
  Group,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from '@inertiajs/react';

interface TimetableEntry {
  subject: { name: string };
  room: { name: string };
  user: { name: string };
}

interface ClassChange {
  date: string;
  before_timetable: TimetableEntry;
  after_timetable: TimetableEntry;
}

// 表示する授業変更のデータ
export default function StudentNotification() {
  const { t } = useTranslation();
  const [classChanges, setClassChanges] = useState<ClassChange[]>([]);

  useEffect(() => {
    const fetchStudentNotifications = async () => {
      try {
        const response = await axios.get('/notice');
        setClassChanges(response.data);
      } catch (error) {
        console.error("Error fetching student notifications:", error);
      }
    };
    fetchStudentNotifications();
  }, []);

  // テーブルヘッダーの定義
  const tableHeaders = [t('StudentNotification.date'), t('StudentNotification.period'), t('StudentNotification.before'), t('StudentNotification.after')];

  // テーブルの行を生成
  const rows = classChanges.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{item.date}</Table.Td>
      <Table.Td>{`${item.before_timetable.subject.name} (${item.before_timetable.user.name}先生) - ${item.before_timetable.room.name}`}</Table.Td>
      <Table.Td>{`${item.after_timetable.subject.name} (${item.after_timetable.user.name}先生) - ${item.after_timetable.room.name}`}</Table.Td>
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
          component={Link}
          href={'/'}
          variant="filled"
          radius="xs"
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
