import { useState } from 'react';
import { Table } from '@mantine/core';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // ← 追加


const tableData = [
  [1, '', '', '', '', ''],
  [2, '', '', '', '', ''],
  [3, '', '', '', '', ''],
  [4, '', '', '', '', ''],
];


function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatDate(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}


export default function TimetableClick() {

  const navigate = useNavigate(); // ← 追加
  const [data] = useState(tableData);
  const [clickedMessage] = useState('');
  const [currentMonday, setCurrentMonday] = useState(getStartOfWeek(new Date()));

  const changeWeek = (offset: number) => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(newMonday.getDate() + offset * 7);
    setCurrentMonday(newMonday);
  };


  const startOfWeek = currentMonday;
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 4);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (colIndex === 0) return;
    navigate('/timetable-change');
  };

  return (
    <>
      <div className="rectangle">
        <div className="date-selector">
          <button onClick={() => changeWeek(-1)}>←</button>
          <div>
            {formatDate(startOfWeek)} 〜 {formatDate(endOfWeek)}
          </div>
          <button onClick={() => changeWeek(1)}>→</button>
          <div className="top-right-box">5年5組　99番　高専　太郎</div>
        </div>
      </div>

      {clickedMessage && (
        <div style={{ marginBottom: 10, fontWeight: 'bold', color: 'blue' }}>
          {clickedMessage}
        </div>
      )}
      <div className="back-button-container">
        <Button variant="filled" size="xl" onClick={() => navigate(-1)} style={{ width: '150px' }}>戻る</Button>
      </div>

      <style>{`
        .custom-table {
          table-layout: fixed !important;
          width: 840px !important; 
          border-collapse: collapse;
          margin: 0 auto;
          margin-top: 50px; 
        }
        .custom-table th, .custom-table td {
          width: 140px; 
          height: 90px;
          text-align: center;
          vertical-align: middle;
          border: 1px solid white;
          user-select: none;
        }
        .header-black {
          background-color: black !important;
          border: 1px solid white;
        }
        .header-blue {
          background-color: rgb(12, 106, 207) !important;
          color: white !important;
          border: 1px solid white;
          text-align: center;
          vertical-align: middle;
          font-size: 50px;
        }
        .ag-cell {
          text-align: center;
          user-select: none;
          font-size: 30px;
        }       
        .ag-cell[col-id="idColumn"] {
          background-color: rgb(190, 190, 190) !important;
        }        
        .highlight-cell-odd {
          background-color: rgb(190, 209, 255) !important;
        }      
        .highlight-cell-even {
          background-color: rgb(219, 223, 255) !important;
        }

        .rectangle {
          position: relative;
          width: 100%;
          height: 120px;
          background-color: rgb(12, 106, 207) !important;
          margin-bottom: 10px;
          display: flex;               
          align-items: flex-start;    
        }

        .date-selector {
          background-color: white;
          padding: 10px 10px;
          display: flex;
          gap: 10px;
          font-weight: bold;
          font-size: 30px;
          margin-bottom: 10px;
          width: fit-content;
          margin-top: 20px;
          margin-Left: 20px;
          border: 2px solid black;
          
        }
        .date-selector button {
          font-size: 30px;
          cursor: pointer;
          background: transparent;
          border: none;
          padding: 0 20px;
        }
        .top-right-box {
          position: absolute;
          top: 25px;
          right: 30px;
          height: 60px;  /* ← 高さは必要なら固定 */
          background-color: white;
          border: 2px solid black;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          padding: 0 20px;  
          box-sizing: border-box; 
        }

        .back-button-container {
          position: absolute;
          left: 50px;
          bottom: 70px;
        }
          
      `}</style>

      <Table className="custom-table">
        <Table.Thead>
          <Table.Tr>
            {['', '月', '火', '水', '木', '金'].map((header, i) => (
              <Table.Th key={i} className={i === 0 ? 'header-black' : 'header-blue'}>
                {header}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {data.map((row, rowIndex) => (
            <Table.Tr
              key={rowIndex}
              className="ag-row"
              data-row-index={rowIndex}
            >
              {row.map((cell, colIndex) => {
                const isLeftColumn = colIndex === 0;
                const isGreen =
                  (rowIndex === 0 || rowIndex === 2) && colIndex >= 1 && colIndex <= 5;
                const isYellow =
                  (rowIndex === 1 || rowIndex === 3) && colIndex >= 1 && colIndex <= 5;

                return (
                  <Table.Td
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`ag-cell ${isLeftColumn
                        ? ''
                        : isGreen
                          ? 'highlight-cell-odd'
                          : isYellow
                            ? 'highlight-cell-even'
                            : ''
                      }`}
                    col-id={isLeftColumn ? 'idColumn' : `col${colIndex}`}
                    style={{ cursor: isLeftColumn ? 'default' : 'pointer' }}
                  >
                    {cell}
                  </Table.Td>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}