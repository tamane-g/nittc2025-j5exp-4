//管理画面 パワポp7

import { Box, Button, Container, Group, Table, Textarea} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← 追加

export default function ManagementScreen() {
  const [statuses, setStatuses] = useState(
    Array(3).fill({ status: '未承認', color: 'gray' })
  );
 const navigate = useNavigate(); // ← 追加
  const [selectedButtons, setSelectedButtons] = useState(Array(3).fill(null));
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [reasonSubmitted, setReasonSubmitted] = useState(false);


const handleApproval = (index: number, newStatus: '承認' | '却下') => {
  setSelectedButtons((prevSelected) => {
    const isCancelling = prevSelected[index] === newStatus;



    setStatuses((prevStatuses) => {
      let status = '未承認';
      let color = 'gray';

      if (!isCancelling) {
        status = newStatus;
        color = newStatus === '承認' ? 'green' : 'red';
      }

      return prevStatuses.map((item, i) =>
        i === index ? { status, color } : item
      );
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
    setShowRejectionReason(false);
    setReasonSubmitted(true);
  };

  return (
<Container style={{ paddingTop: 120 }}>
  {/* タイトル */}
  <Box
    h={100}
    bg="var(--mantine-color-blue-filled)"
    style={{
      color: 'white',
      fontSize: '50px',
      display: 'flex',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
        }}
      >
        管理画面
      </Box>

      {/* テーブル */}
      <Table mt="md" style={{ borderCollapse: 'collapse', width: '100%' ,}}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "var(--mantine-color-blue-filled)",height: '60px',color: "white",textAlign: 'center', border: '1px solid #ccc'}}>申請</th>
            <th style={{ textAlign: 'center', border: '1px solid #ccc' }}>承認</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2].map((_, index) => (
            <tr key={index}>
              <td style={{ border: '2px solid #ccc' ,height: '60px',backgroundColor: index % 2 === 0 ? '#A4C6FF' : 'white',}}>
                <Group justify="space-between">
                  <span>〇月〇日〇時間目</span>
                  <span>教科</span>
                  <span>→</span>
                  <span>教科</span>
                  <span>相手の承認</span>
                  <Button
                    variant="filled"
                    color={statuses[index].color}
                    size="xs"
                    style={{
                    width: 70,
                    margin: 10
                    }}
                  >
                    {statuses[index].status}
                  </Button>
                </Group>
              </td>
              <td style={{ border: '1px solid #ccc' }}>
                <Group justify="center">
                  <Button
                    color="green"
                    size="xs"
                    variant={selectedButtons[index] === '承認' ? 'filled' : 'light'}
                    onClick={() => handleApproval(index, '承認')}
                  >
                    承認
                  </Button>
                  <Button
                    color="red"
                    size="xs"
                    variant={selectedButtons[index] === '却下' ? 'filled' : 'light'}
                    onClick={() => handleApproval(index, '却下')}
                  >
                    却下
                  </Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 却下理由と送信 */}
      {showRejectionReason && !reasonSubmitted && (
        <Box mt="xl" p="md" style={{ border: '1px dashed gray', width: '100%' }}>
          <Textarea placeholder="却下理由" autosize minRows={2} mt="xs" />

          <Group mt="md" justify="flex-end">
            <Button variant="filled" color="blue" size="md" onClick={handleSend}>
              送信
            </Button>
          </Group>
        </Box>
      )}

      {/* 戻るボタン */}
      <Group mt="md" justify="flex-start">
    <Button
        variant="filled"
        radius="xs"
        onClick={() => navigate(-1)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '150px',
          height: '50px',
        }}
      >
        戻る
    </Button>
      </Group>
    </Container>
  );
}


