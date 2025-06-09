//件名表示　パワポp13

import { Box, Button, Container, Table, Text } from '@mantine/core';

export default function MessageDetailScreen() {
  return (
    <Container style={{ paddingTop: 120 }}>
      {/* ヘッダー */}
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
        }}
      >
        件名表示
      </Box>

      {/* テーブル風表示 */}
      <Table withTableBorder style={{ width: '100%', marginTop: '20px' }}>
        <tbody>
          <tr>
            <td style={cellStyleHeader}>差出人</td>
            <td style={cellStyleContent}>
              <Text>山田太郎</Text>
            </td>
          </tr>
          <tr>
            <td style={cellStyleHeader}>日付</td>
            <td style={cellStyleContent}>
              <Text>2025/05/24</Text>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ ...cellStyleHeader, textAlign: 'center' }}>
              メッセージ
            </td>
          </tr>
<tr>
  <td colSpan={2} style={{ ...cellStyleContent, height: '200px', verticalAlign: 'top' }}>
    <Text style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
      〇〇によって棄却されました
    </Text>
  </td>
</tr>

        </tbody>
      </Table>

      {/* 戻るボタン */}
      <Button
        variant="filled"
        radius="xs"
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
    </Container>
  );
}

const cellStyleHeader = {
  backgroundColor: 'var(--mantine-color-blue-filled)',
  color: 'white',
  fontWeight: 'bold',
  border: '2px solid black',
  textAlign: 'center',       // 横方向中央揃え
  verticalAlign: 'middle',   // 縦方向中央揃え
  padding: '10px',
  width: '150px',
} as const;

const cellStyleContent = {
  border: '1px solid #333',
  padding: '10px',
  backgroundColor: 'white',
};
