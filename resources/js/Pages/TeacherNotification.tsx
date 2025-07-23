// resources/js/Pages/TeacherNotification.tsx

import React, { useState, useEffect } from 'react';
import { Box, Container, Table, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
// Inertia's Link is no longer needed for the back button, but you might need it elsewhere
// import { Link } from '@inertiajs/react';

// --- Data Type Definition ---
interface TeacherNotice {
  user: string;
  // 3. Use a language-independent key for the subject
  approvalKey: 'rejected' | 'approved' | 'changeNeeded';
  date: string;
}

// --- Main Component ---
export default function TeacherNotification() {
  // 1. Specify the 'notification' and 'common' namespaces
  const { t, i18n } = useTranslation(['notification', 'common']);
  const [notifications, setNotifications] = useState<TeacherNotice[]>([]);

  useEffect(() => {
    // This is a placeholder for your actual API call.
    const fetchNotifications = async () => {
      try {
        // const response = await axios.get('/api/teacher/notifications');
        // setNotifications(response.data);

        // For now, we'll use mock data that is set after `t` is ready.
        const mockData: TeacherNotice[] = [
          { user: t('teacher.name', { ns: 'notification' }), approvalKey: 'rejected', date: '2025-07-21' },
          { user: t('admin', { ns: 'common' }), approvalKey: 'approved', date: '2025-07-20' },
          { user: t('admin', { ns: 'common' }), approvalKey: 'changeNeeded', date: '2025-07-19' },
        ];
        setNotifications(mockData);

      } catch (error) {
        console.error("Error fetching teacher notifications:", error);
      }
    };
    fetchNotifications();
  }, [i18n.language, t]); // Re-fetch or re-set data when language changes

  // --- Table Headers ---
  const tableHeaders = [
    { key: 'sender', label: t('teacher.sender', { ns: 'notification' }) },
    { key: 'subject', label: t('teacher.subject', { ns: 'notification' }) },
    { key: 'date', label: t('teacher.date', { ns: 'notification' }) },
  ];

  return (
    <Container className="notification-container">
      <Box className="notification-header">
        {/* 2. Use the correct key for the title */}
        {t('teacher.title', { ns: 'notification' })}
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
            <Table.Tr key={index}>
              <Table.Td>{item.user}</Table.Td>
              {/* 3. Translate the subject using the language-independent key */}
              <Table.Td style={{ color: '#3B72C3' }}>
                {t(`teacher.${item.approvalKey}`, { ns: 'notification' })}
              </Table.Td>
              <Table.Td>{item.date}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group className="back-button-group">
        {/* 4. Use a standard button to go back to the previous page */}
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