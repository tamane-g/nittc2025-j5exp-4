// resources/js/Pages/StudentNotification.tsx

import React ,{ useState, useEffect } from 'react';
import { Box, Container, Table, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
// Linkコンポーネントは「戻る」ボタンには不要になります
// import { Link } from '@inertiajs/react';

// --- データ型定義 ---
interface TimetableEntry {
  subject: { name: string };
  room: { name: string };
  user: { name: string };
}

interface ClassChange {
  id: number; // データの識別用にIDを追加
  before_date: string;
  before_period: number;
  after_date: string;
  after_period: number;
  before_timetable: TimetableEntry;
  after_timetable: TimetableEntry;
}

// --- メインコンポーネント ---
export default function StudentNotification() {
  // 1. 'notification'と'common'の名前空間を指定
  const { t, i18n } = useTranslation(['notification', 'common']);
  const [classChanges, setClassChanges] = useState<ClassChange[]>([]);

  // --- データ取得ロジック ---
  useEffect(() => {
    const fetchStudentNotifications = async () => {
      try {
        // const response = await axios.get('/api/student/notifications');
        // setClassChanges(response.data);

        // モックデータ (API実装まで)
        const mockData: ClassChange[] = [
          {
            id: 1,
            before_date: '2025/07/21',
            before_period: 3,
            after_date: '2025/07/21',
            after_period: 3,
            before_timetable: { subject: { name: t('student.realtimeOSEngineering', { ns: 'notification' }) }, user: { name: '田中' }, room: { name: '4-1' } },
            after_timetable: { subject: { name: t('student.embeddedSystemsOverview', { ns: 'notification' }) }, user: { name: '佐藤' }, room: { name: '講義室A' } },
          },
        ];
        setClassChanges(mockData);

      } catch (error) {
        console.error("Error fetching student notifications:", error);
      }
    };
    fetchStudentNotifications();
  }, [i18n.language, t]); // 言語が変更されたらデータを再設定

  // --- テーブルヘッダー ---
  const tableHeaders = [
    t('student.date', { ns: 'notification' }),
    t('student.period', { ns: 'notification' }),
    t('student.before', { ns: 'notification' }),
    t('student.after', { ns: 'notification' }),
  ];

  return (
    <Container className="notification-container">
      <Box component="header" className="notification-header">
        {/* 2. キーを修正 */}
        {t('student.title', { ns: 'notification' })}
      </Box>

      <Table mt="md" withTableBorder className="notification-table">
        <Table.Thead>
          <Table.Tr>
            {tableHeaders.map((header) => (
              <Table.Th key={header}>{header}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {classChanges.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>{item.before_date}</Table.Td>
              <Table.Td>{item.before_period}</Table.Td>
              <Table.Td>
                {`${item.before_timetable.subject.name} (${item.before_timetable.user.name}${t('teacherSuffix', { ns: 'common' })}) - ${item.before_timetable.room.name}`}
              </Table.Td>
              <Table.Td>
                {`${item.after_timetable.subject.name} (${item.after_timetable.user.name}${t('teacherSuffix', { ns: 'common' })}) - ${item.after_timetable.room.name}`}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group className="back-button-group">
        {/* 3. 直前のページに戻るボタンに変更 */}
        <Button
          onClick={() => window.history.back()}
          variant="filled"
          radius="xs"
          className="back-button"
        >
          {t('back', { ns: 'common' })}
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
