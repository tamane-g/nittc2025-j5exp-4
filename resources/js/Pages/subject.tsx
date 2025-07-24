//件名表示　パワポp13

import { Box, Button, Container, Table, Text } from '@mantine/core';

export default function MessageDetailScreen() {
  return (
    <Container className="message-container">
      {/* ヘッダー */}
      <Box
        className="message-header"
      >
        件名表示
      </Box>

      {/* テーブル風表示 */}
      <Table withTableBorder className="message-table">
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="cell-header">差出人</Table.Td>
            <Table.Td className="cell-content">
              <Text>山田太郎</Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="cell-header">日付</Table.Td>
            <Table.Td className="cell-content">
              <Text>2025/05/24</Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={2} className="cell-header message-header-cell">
              メッセージ
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={2} className="cell-content message-content-cell">
              <Text className="message-text">
                〇〇によって棄却されました
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      {/* 戻るボタン */}
      <Button
        variant="filled"
        radius="xs"
        className="back-button"
      >
        戻る
      </Button>
      <style>{`
        .message-container {
          padding-top: 120px;
        }
        .message-header {
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
          height: 100px;
        }
        .message-table {
          width: 100%;
          margin-top: 20px;
        }
        .cell-header {
          background-color: var(--mantine-color-blue-filled);
          color: white;
          font-weight: bold;
          border: 2px solid black;
          text-align: center;
          vertical-align: middle;
          padding: 10px;
          width: 150px;
        }
        .cell-content {
          border: 1px solid #333;
          padding: 10px;
          background-color: white;
        }
        .message-header-cell {
          text-align: center;
        }
        .message-content-cell {
          height: 200px;
          vertical-align: top;
        }
        .message-text {
          text-align: left;
          white-space: pre-wrap;
        }
        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 150px;
          height: 50px;
        }

        @media (max-width: 768px) {
          .message-header {
            font-size: 36px;
            height: 80px;
          }
          .cell-header {
            width: 100px;
            font-size: 14px;
          }
          .back-button {
            width: calc(100% - 40px);
            left: 20px;
            bottom: 20px;
          }
        }
      `}</style>
    </Container>
  );
}
