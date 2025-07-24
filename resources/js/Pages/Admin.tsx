// 管理画面 (admin.tsx)

import { Box, Button, Container, Group, Table, Text, Textarea } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

// --- データ型の定義 ---
// 予定エントリ
interface ScheduleEntry {
  date: string;
  timeSlot: number;
  room: string;
  teacher: string;
  subject: string;
}

// 変更申請
interface ChangeRequest {
  id: number;
  date: string;
  timeSlot: number;
  originalSubject: string;
  newSubject: string;
  originalTeacher: string;
  newTeacher: string;
  originalRoom: string;
  newRoom: string;
  applicant: string;
  // 3. statusを言語に依存しないキーに変更
  status: 'pending' | 'approved' | 'rejected';
}


// --- 衝突チェックロジック ---
const checkConflicts = (request: ChangeRequest, existingTimetable: ScheduleEntry[]) => {
    let roomConflict = false;
    let teacherConflict = false;

    for (const entry of existingTimetable) {
        if (entry.date === request.date && entry.timeSlot === request.timeSlot) {
            if (entry.room === request.newRoom) roomConflict = true;
            if (entry.teacher === request.newTeacher) teacherConflict = true;
        }
    }
    return { roomConflict, teacherConflict };
};

// --- メインコンポーネント ---
export default function Admin() {
  // 1. 名前空間に'admin'と'common'を指定
  const { t, i18n } = useTranslation(['admin', 'common']);

  // --- モックデータ (実際のアプリケーションではAPIから取得) ---
  const [existingTimetable, setExistingTimetable] = useState<ScheduleEntry[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);

  // t関数が利用可能になってからモックデータを初期化
  useEffect(() => {
    setExistingTimetable([
        { date: '2025-07-14', timeSlot: 1, room: t('room5_5'), teacher: t('teacherName1'), subject: t('japanese') },
        { date: '2025-07-14', timeSlot: 2, room: t('practiceRoom'), teacher: t('teacherName2'), subject: t('programming') },
        { date: '2025-07-15', timeSlot: 1, room: t('room5_5'), teacher: t('teacherName1'), subject: t('math') },
    ]);
    setChangeRequests([
        { id: 1, date: '2025-07-14', timeSlot: 1, originalSubject: t('japanese'), newSubject: t('english'), originalTeacher: t('teacherName1'), newTeacher: t('teacherName1'), originalRoom: t('room5_5'), newRoom: t('room5_5'), applicant: t('teacherName1'), status: 'pending' },
        { id: 2, date: '2025-07-14', timeSlot: 2, originalSubject: t('programming'), newSubject: t('experiment'), originalTeacher: t('teacherName2'), newTeacher: t('teacherName2'), originalRoom: t('practiceRoom'), newRoom: t('practiceRoom'), applicant: t('teacherName2'), status: 'pending' },
        { id: 3, date: '2025-07-14', timeSlot: 1, originalSubject: t('japanese'), newSubject: t('physicalEducation'), originalTeacher: t('teacherName1'), newTeacher: t('teacherName1'), originalRoom: t('room5_5'), newRoom: t('gym'), applicant: t('teacherName1'), status: 'pending' },
    ]);
  }, [i18n.language, t]);
  // --- ここまでモックデータ ---


  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  useEffect(() => {
    setRequests(changeRequests.map(req => ({ ...req, status: 'pending' })));
  }, [changeRequests]);


  const [selectedConflict, setSelectedConflict] = useState<(ChangeRequest & { roomConflict: boolean, teacherConflict: boolean }) | null>(null);
  const [selectedButtons, setSelectedButtons] = useState<Array<'approved' | 'rejected' | null>>([]);
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [reasonSubmitted, setReasonSubmitted] = useState(false);
  const { data, setData, post } = useForm({ rejectionReason: '' });

  // 承認・却下ハンドラ
  const handleApproval = (index: number, newStatus: 'approved' | 'rejected') => {
    setSelectedButtons((prevSelected) => {
        const isCancelling = prevSelected[index] === newStatus;
        const finalStatus = isCancelling ? 'pending' : newStatus;

        setRequests(prev => prev.map((req, i) => i === index ? { ...req, status: finalStatus } : req));

        if (finalStatus === 'rejected') {
            setShowRejectionReason(true);
            setReasonSubmitted(false);
        } else {
            setShowRejectionReason(false);
        }

        return prevSelected.map((btn, i) => i === index ? (isCancelling ? null : newStatus) : btn);
    });
  };

  // 送信ハンドラ
  const handleSend = () => {
    console.log('Rejection reason submitted:', data.rejectionReason);
    setShowRejectionReason(false);
    setReasonSubmitted(true);
  };


  // --- レンダリング ---
  return (
    <Container className={`admin-container ${i18n.language}`}>
      <Box className="admin-header">
        {/* 2. キーを直接指定 */}
        {t('title')}
      </Box>

      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Table mt="md" className="admin-table">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="col-request">{t('request')}</Table.Th>
              <Table.Th className="col-conflict">{t('roomConflict')}</Table.Th>
              <Table.Th className="col-conflict">{t('teacherConflict')}</Table.Th>
              <Table.Th className="col-approval">{t('approval')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.map((request, index) => {
              const { roomConflict, teacherConflict } = checkConflicts(request, existingTimetable);
              const statusKey = request.status;
              const statusText = t(statusKey === 'pending' ? 'statusPending' : statusKey === 'approved' ? 'statusApproved' : 'statusRejected');
              const statusColor = statusKey === 'approved' ? 'green' : statusKey === 'rejected' ? 'red' : 'gray';

              return (
                <Table.Tr key={request.id}>
                  <Table.Td className={`col-request ${index % 2 === 0 ? 'even-row' : ''}`}>
                    <Group justify="space-between" wrap="nowrap">
                      <span>{request.date} {request.timeSlot}{t('timeSlotUnit')}</span>
                      <span>{request.originalSubject} → {request.newSubject}</span>
                      <span>{request.originalTeacher} → {request.newTeacher}</span>
                      <span>{request.originalRoom} → {request.newRoom}</span>
                      <span>{t('applicant')}: {request.applicant}</span>
                      <Button variant="filled" color={statusColor} size="xs" className="status-button">
                        {statusText}
                      </Button>
                    </Group>
                  </Table.Td>
                  <Table.Td
                    className="col-conflict"
                    style={{ backgroundColor: roomConflict ? 'red' : 'transparent', color: roomConflict ? 'white' : 'black', cursor: roomConflict ? 'pointer' : 'default' }}
                    onClick={() => roomConflict && setSelectedConflict(selectedConflict?.id === request.id ? null : { ...request, roomConflict, teacherConflict })}
                  >
                    {t(roomConflict ? 'conflictExists' : 'conflictNone')}
                  </Table.Td>
                  <Table.Td
                    className="col-conflict"
                    style={{ backgroundColor: teacherConflict ? 'red' : 'transparent', color: teacherConflict ? 'white' : 'black', cursor: teacherConflict ? 'pointer' : 'default' }}
                    onClick={() => teacherConflict && setSelectedConflict(selectedConflict?.id === request.id ? null : { ...request, roomConflict, teacherConflict })}
                  >
                    {t(teacherConflict ? 'conflictExists' : 'conflictNone')}
                  </Table.Td>
                  <Table.Td className="col-approval">
                    <Group justify="center">
                      <Button color="green" size="xs" variant={selectedButtons[index] === 'approved' ? 'filled' : 'light'} onClick={() => handleApproval(index, 'approved')}>
                        {t('approve')}
                      </Button>
                      <Button color="red" size="xs" variant={selectedButtons[index] === 'rejected' ? 'filled' : 'light'} onClick={() => handleApproval(index, 'rejected')}>
                        {t('reject')}
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Box>

      {showRejectionReason && !reasonSubmitted && (
        <Box mt="xl" p="md" className="rejection-box">
          <Textarea
            placeholder={t('rejectionReasonPlaceholder')}
            autosize
            minRows={2}
            mt="xs"
            value={data.rejectionReason}
            onChange={(event) => setData('rejectionReason', event.currentTarget.value)}
          />
          <Group mt="md" justify="flex-end">
            <Button variant="filled" color="blue" size="md" onClick={handleSend}>
              {t('send')}
            </Button>
          </Group>
        </Box>
      )}

      {selectedConflict && (
        <Box mt="xl" p="md" style={{ border: '2px solid red', borderRadius: '8px' }}>
          <Text size="lg" fw={700} mb="md">{t('conflictDetails')}</Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('date')}</Table.Th>
                <Table.Th>{t('timeSlot')}</Table.Th>
                <Table.Th>{t('room')}</Table.Th>
                <Table.Th>{t('teacher')}</Table.Th>
                <Table.Th>{t('subject')}</Table.Th>
                <Table.Th>{t('status')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr style={{ backgroundColor: '#FFCDD2' }}>
                <Table.Td>{selectedConflict.date}</Table.Td>
                <Table.Td>{selectedConflict.timeSlot}{t('timeSlotUnit')}</Table.Td>
                <Table.Td style={{ color: selectedConflict.roomConflict ? 'red' : 'inherit' }}>{selectedConflict.newRoom}</Table.Td>
                <Table.Td style={{ color: selectedConflict.teacherConflict ? 'red' : 'inherit' }}>{selectedConflict.newTeacher}</Table.Td>
                <Table.Td>{selectedConflict.newSubject}</Table.Td>
                <Table.Td>{t('statusPending')}</Table.Td>
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
                    <Table.Td>{entry.timeSlot}{t('timeSlotUnit')}</Table.Td>
                    <Table.Td style={{ color: selectedConflict.roomConflict && entry.room === selectedConflict.newRoom ? 'red' : 'inherit' }}>{entry.room}</Table.Td>
                    <Table.Td style={{ color: selectedConflict.teacherConflict && entry.teacher === selectedConflict.newTeacher ? 'red' : 'inherit' }}>{entry.teacher}</Table.Td>
                    <Table.Td>{entry.subject}</Table.Td>
                    <Table.Td>{t('statusExisting')}</Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Box>
      )}

      <Group mt="md" className="back-button-group">
        <Link href="/" className="back-button">
          <Button variant="filled" radius="xs">
            {t('back', { ns: 'common' })}
          </Button>
        </Link>
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


