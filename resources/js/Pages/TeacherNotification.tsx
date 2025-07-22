//通知画面　パワポp12

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

interface TeacherNotice {
  user: string;
  approval: string;
  date: string;
}

export default function TeacherNotification() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<TeacherNotice[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/notice');
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching teacher notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <Container className="notification-container">
      <Box
        className="notification-header"
      >
        {t('TeacherNotification.title')}
      </Box>

      <Table mt="md" withTableBorder className="notification-table">
        <Table.Thead>
          <Table.Tr>
            {[t('TeacherNotification.sender'), t('TeacherNotification.subject'), t('TeacherNotification.date')].map((title) => (
              <Table.Th key={title}>
                {title}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {notifications.map((item, index) => (
            <Table.Tr key={index}>
              <Table.Td>{item.user}</Table.Td>
              <Table.Td style={{ color: '#3B72C3' }}>{item.approval}</Table.Td>
              <Table.Td>{item.date}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

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
