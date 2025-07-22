//管理画面 パワポp7

import { Box, Button, Container, Group, Table, Text, Textarea} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

// モックデータ
interface ScheduleEntry {
  date: string; // YYYY-MM-DD
  timeSlot: number; // 1, 2, 3, 4
  room: string;
  teacher: string;
  subject: string;
}

interface ChangeRequest {
  id: number;
  date: string; // YYYY-MM-DD
  timeSlot: number;
  originalSubject: string;
  newSubject: string;
  originalTeacher: string;
  newTeacher: string;
  originalRoom: string;
  newRoom: string;
  applicant: string;
  status: '未承認' | '承認' | '却下';
}

const checkConflicts = (request: ChangeRequest, existingTimetable: ScheduleEntry[]) => {
  let roomConflict = false;
  let teacherConflict = false;

  for (const entry of existingTimetable) {
    // 同じ日付、同じ時限の場合
    if (entry.date === request.date && entry.timeSlot === request.timeSlot) {
      // 部屋の衝突チェック
      if (entry.room === request.newRoom) {
        roomConflict = true;
      }
      // 教員の衝突チェック
      if (entry.teacher === request.newTeacher) {
        teacherConflict = true;
      }
    }
  }
  return { roomConflict, teacherConflict };
};

export default function ManagementScreen() {
  const { t, i18n } = useTranslation();
  const existingTimetable: ScheduleEntry[] = [
    { date: '2025-07-14', timeSlot: 1, room: t('Admin.room5_5'), teacher: t('Admin.teacherName1'), subject: t('Admin.japanese') },
    { date: '2025-07-14', timeSlot: 2, room: t('Admin.practiceRoom'), teacher: t('Admin.teacherName2'), subject: t('Admin.programming') },
    { date: '2025-07-15', timeSlot: 1, room: t('Admin.room5_5'), teacher: t('Admin.teacherName1'), subject: t('Admin.math') },
  ];

  const changeRequests: ChangeRequest[] = [
    {
      id: 1,
      date: '2025-07-14',
      timeSlot: 1,
      originalSubject: t('Admin.japanese'),
      newSubject: t('Admin.english'),
      originalTeacher: t('Admin.teacherName1'),
      newTeacher: t('Admin.teacherName1'),
      originalRoom: t('Admin.room5_5'),
      newRoom: t('Admin.room5_5'),
      applicant: t('Admin.teacherName1'),
      status: t('Admin.statusPending') as '未承認' | '承認' | '却下',
    },
    {
      id: 2,
      date: '2025-07-14',
      timeSlot: 2,
      originalSubject: t('Admin.programming'),
      newSubject: t('Admin.experiment'),
      originalTeacher: t('Admin.teacherName2'),
      newTeacher: t('Admin.teacherName2'),
      originalRoom: t('Admin.practiceRoom'),
      newRoom: t('Admin.practiceRoom'),
      applicant: t('Admin.teacherName2'),
      status: t('Admin.statusPending') as '未承認' | '承認' | '却下',
    },
    {
      id: 3,
      date: '2025-07-14',
      timeSlot: 1,
      originalSubject: t('Admin.japanese'),
      newSubject: t('Admin.physicalEducation'),
      originalTeacher: t('Admin.teacherName1'),
      newTeacher: t('Admin.teacherName1'),
      originalRoom: t('Admin.room5_5'),
      newRoom: t('Admin.gym'),
      applicant: t('Admin.teacherName1'),
      status: t('Admin.statusPending') as '未承認' | '承認' | '却下',
    },
  ];

  const [requests, setRequests] = useState<ChangeRequest[]>(
    changeRequests.map((req): ChangeRequest => ({ ...req, status: '未承認' }))
  );
  const [selectedConflict, setSelectedConflict] = useState<(ChangeRequest & { roomConflict: boolean, teacherConflict: boolean }) | null>(null);
 const navigate = useNavigate();
  const [selectedButtons, setSelectedButtons] = useState(Array(requests.length).fill(null));
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [reasonSubmitted, setReasonSubmitted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, setData, post } = useForm({
    rejectionReason: '',
  });

  const handleApproval = (index: number, newStatus: '承認' | '却下') => {
  setSelectedButtons((prevSelected) => {
    const isCancelling = prevSelected[index] === newStatus;

    setRequests((prevRequests) => {
      return prevRequests.map((req, i) => {
        if (i === index) {
          return { ...req, status: isCancelling ? '未承認' : newStatus };
        }
        return req;
      });
    });

    // 却下取り消し時または承認ボタンが押されたとき
    setShowRejectionReason(false);
    if (isCancelling || newStatus === '承認') {
      setShowRejectionReason(false);
    } else if (newStatus === '却下') {
      setShowRejectionReason(true);
      setReasonSubmitted(false);
    }

    return prevSelected.map((btn, i) =>
      i === index ? (isCancelling ? null : newStatus) : btn
    );
  });
};


  const handleSend = () => {
    // APIへの送信処理
    // post('/api/reject-reason', data);
    console.log('Rejection reason submitted:', data.rejectionReason);
    setShowRejectionReason(false);
    setReasonSubmitted(true);
  };

  return (
<Container className={`admin-container ${i18n.language === 'en' ? 'lang-en' : ''}`}>
  {/* タイトル */}
  <Box
    className="admin-header"
      >
        {t('Admin.title')}
      </Box>

      {/* テーブル */}
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Table mt="md" className="admin-table">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="col-request">{t('Admin.request')}</Table.Th>
              <Table.Th className="col-conflict">{t('Admin.roomConflict')}</Table.Th>
              <Table.Th className="col-conflict">{t('Admin.teacherConflict')}</Table.Th>
              <Table.Th className="col-approval">{t('Admin.approval')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.map((request, index) => {
              const { roomConflict, teacherConflict } = checkConflicts(request, existingTimetable);
              const statusColor = requests[index].status === '承認' ? 'green' : requests[index].status === '却下' ? 'red' : 'gray';
              return (
              <Table.Tr key={request.id}>
                <Table.Td className={`col-request ${index % 2 === 0 ? 'even-row' : ''}`}>
                  <Group justify="space-between" wrap="nowrap"> {/* flexWrap="nowrap" を noWrap に変更 */}
                    <span>{request.date} {request.timeSlot}{t('Admin.timeSlotUnit')}</span>
                    <span>{request.originalSubject} → {request.newSubject}</span>
                    <span>{request.originalTeacher} → {request.newTeacher}</span>
                    <span>{request.originalRoom} → {request.newRoom}</span>
                    <span>{t('Admin.applicant')}: {request.applicant}</span>
                    <Button
                      variant="filled"
                      color={statusColor}
                      size="xs"
                      className="status-button"
                    >
                      {requests[index].status === '未承認' ? t('Admin.statusPending') : requests[index].status === '承認' ? t('Admin.statusApproved') : t('Admin.statusRejected')}
                    </Button>
                  </Group>
                </Table.Td>
                <Table.Td
                  className="col-conflict"
                  style={{
                    backgroundColor: roomConflict ? 'red' : 'transparent',
                    color: roomConflict ? 'white' : 'black',
                    cursor: roomConflict ? 'pointer' : 'default'
                  }}
                  onClick={() => {
                    if (roomConflict) {
                      setSelectedConflict(selectedConflict?.id === request.id ? null : { ...request, roomConflict, teacherConflict });
                    }
                  }}
                >
                  {roomConflict ? t('Admin.conflictExists') : t('Admin.conflictNone')}
                </Table.Td>
                <Table.Td
                  className="col-conflict"
                  style={{
                    backgroundColor: teacherConflict ? 'red' : 'transparent',
                    color: teacherConflict ? 'white' : 'black',
                    cursor: teacherConflict ? 'pointer' : 'default'
                  }}
                  onClick={() => {
                    if (teacherConflict) {
                      setSelectedConflict(selectedConflict?.id === request.id ? null : { ...request, roomConflict, teacherConflict });
                    }
                  }}
                >
                  {teacherConflict ? t('Admin.conflictExists') : t('Admin.conflictNone')}
                </Table.Td>
                <Table.Td className="col-approval">
                  <Group justify="center">
                    <Button
                      color="green"
                      size="xs"
                      variant={selectedButtons[index] === '承認' ? 'filled' : 'light'}
                      onClick={() => handleApproval(index, '承認')}
                    >
                      {t('Admin.approve')}
                    </Button>
                    <Button
                      color="red"
                      size="xs"
                      variant={selectedButtons[index] === '却下' ? 'filled' : 'light'}
                      onClick={() => handleApproval(index, '却下')}
                    >
                      {t('Admin.reject')}
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            )})}
          </Table.Tbody>
        </Table>
      </Box>

      {/* 却下理由と送信 */}
      {showRejectionReason && !reasonSubmitted && (
        <Box mt="xl" p="md" className="rejection-box">
          <Textarea placeholder={t('Admin.rejectionReasonPlaceholder')} autosize minRows={2} mt="xs"
            value={data.rejectionReason}
            onChange={(event) => setData('rejectionReason', event.currentTarget.value)}
          />

          <Group mt="md" justify="flex-end">
            <Button variant="filled" color="blue" size="md" onClick={handleSend}>
              {t('Admin.send')}
            </Button>
          </Group>
        </Box>
      )}

      {/* 衝突詳細表示 */}
      {selectedConflict && (
        <Box mt="xl" p="md" style={{ border: '2px solid red', borderRadius: '8px' }}>
          <Text size="lg" fw={700} mb="md">{t('Admin.conflictDetails')}</Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('Admin.date')}</Table.Th>
                <Table.Th>{t('Admin.timeSlot')}</Table.Th>
                <Table.Th>{t('Admin.room')}</Table.Th>
                <Table.Th>{t('Admin.teacher')}</Table.Th>
                <Table.Th>{t('Admin.subject')}</Table.Th>
                <Table.Th>{t('Admin.status')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr style={{ backgroundColor: '#FFCDD2' }}>
                <Table.Td>{selectedConflict.date}</Table.Td>
                <Table.Td>{selectedConflict.timeSlot}{t('Admin.timeSlotUnit')}</Table.Td>
                <Table.Td style={{ color: selectedConflict.roomConflict ? 'red' : 'inherit' }}>{selectedConflict.newRoom}</Table.Td>
                <Table.Td style={{ color: selectedConflict.teacherConflict ? 'red' : 'inherit' }}>{selectedConflict.newTeacher}</Table.Td>
                <Table.Td>{selectedConflict.newSubject}</Table.Td>
                <Table.Td>{t('Admin.statusPending')}</Table.Td>
              </Table.Tr>
              {existingTimetable
                .filter(entry =>
                  entry.date === selectedConflict.date &&
                  entry.timeSlot === selectedConflict.timeSlot &&
                  ((selectedConflict.roomConflict && entry.room === selectedConflict.newRoom) || (selectedConflict.teacherConflict && entry.teacher === selectedConflict.newTeacher))
                )
                .map((entry, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{entry.date}</Table.Td>
                    <Table.Td>{entry.timeSlot}{t('Admin.timeSlotUnit')}</Table.Td>
                    <Table.Td style={{ color: selectedConflict.roomConflict && entry.room === selectedConflict.newRoom ? 'red' : 'inherit' }}>{entry.room}</Table.Td>
                    <Table.Td style={{ color: selectedConflict.teacherConflict && entry.teacher === selectedConflict.newTeacher ? 'red' : 'inherit' }}>{entry.teacher}</Table.Td>
                    <Table.Td>{entry.subject}</Table.Td>
                    <Table.Td>{t('Admin.statusExisting')}</Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Box>
      )}

      {/* 戻るボタン */}
      <Group mt="md" className="back-button-group">
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
        .admin-container {
          padding-top: 120px;
          max-width: none !important; /* Container の最大幅を解除 */
          overflow-x: auto; /* 横スクロールを可能にする */
        }
        .admin-header {
          background-color: var(--mantine-color-blue-filled);
          color: white;
          font-size: 50px;
          display: flex;
          text-align: center;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
        }
        .admin-table {
          .admin-table {
          border-collapse: collapse;
          width: 3000px !important; /* 幅を 3000px に固定し、!important で強制 */
          table-layout: fixed !important; /* 追加 */
          max-width: 1200px; /* 追加: テーブルの最大幅を設定 */
          margin: 0 auto; /* 中央揃え */
        }
        }
        .admin-table th, .admin-table td {
          border: 1px solid #ccc;
          text-align: center;
          white-space: normal; 
          word-wrap: break-word; /* 追加 */
          overflow: hidden; /* 追加 */
          text-overflow: ellipsis; /* 追加 */
        }
        .admin-table th {
          background-color: var(--mantine-color-blue-filled);
          height: 60px;
          color: white;
        }
        .admin-table td {
          height: 60px;
        }
        .col-request {
          width: 900px;
        }
        .col-conflict {
          width: 150px;
        }
        .col-approval {
          width: 200px;
        }
        .even-row {
          background-color: #A4C6FF;
        }
        .status-button {
          width: 70px;
          margin: 10px;
        }
        .lang-en .status-button {
          width: 100px; /* 英語の時に幅を広げる */
        }
        .rejection-box {
          border: 1px dashed gray;
          width: 100%;
        }
        .back-button-group {
          justify-content: flex-start;
        }
        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 150px;
          height: 50px;
        }

        @media (max-width: 768px) {
          .admin-header {
            font-size: 36px;
            height: 80px;
          }
          .admin-table {
            font-size: 12px;
          }
          .admin-table td span {
            display: block;
            margin-bottom: 5px;
          }
          .status-button {
            width: 60px;
            font-size: 10px;
          }
          .back-button {
            width: 100%;
            left: 0;
            bottom: 0;
            border-radius: 0;
          }
        }
      `}</style>
    </Container>
  );
}


