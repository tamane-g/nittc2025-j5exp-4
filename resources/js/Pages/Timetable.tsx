// resources/js/Pages/Timetable.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { usePage, Link } from '@inertiajs/react';

// --- データ型の定義 ---
interface UserProps {
  user?: { id?: string; name?: string; class?: string; number?: string; }; // ユーザー情報を拡充
  [key: string]: any;
}

interface TimetableEntry {
  subject: { name: string; };
  user: { name: string; };
  room: { name: string; };
}

// --- ヘルパー関数 ---
function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 日曜日を週の始まりとしない
  d.setDate(d.getDate() + diff);
  return d;
}

// --- メインコンポーネント ---
export default function Timetable() {
  // 1. 名前空間を指定
  const { t, i18n } = useTranslation(['timetable', 'common']);
  const [timetableData, setTimetableData] = useState<(TimetableEntry | null)[][]>([]);
  const [currentMonday, setCurrentMonday] = useState(getStartOfWeek(new Date()));
  const { props } = usePage<UserProps>();
  const isEnglish = i18n.language === 'en';

  console.log(props);

  // --- APIから時間割データを取得 ---
  const fetchTimetable = useCallback(async () => {
    // モックデータ（APIが未実装の場合）
    const mockTimetable: (TimetableEntry & { day: string, period: number })[] = [
        { day: 'monday', period: 1, subject: { name: '国語' }, user: { name: '鈴木' }, room: { name: '3-1' } },
        { day: 'tuesday', period: 2, subject: { name: '数学' }, user: { name: '佐藤' }, room: { name: '3-2' } },
    ];

    try {
        // APIを叩く場合はこちらを有効化
        /*
        const formattedDate = currentMonday.toISOString().split('T')[0];
        const userId = props.user?.id;
        if (!userId) return;

        const response = await axios.get('/api/timetable', {
            params: { first_date: formattedDate, user_id: userId },
        });
        const fetchedData = response.data.timetable;
        */

        const fetchedData = mockTimetable; // API実装まではモックを使用

        const newTimetable: (TimetableEntry | null)[][] = Array(4).fill(null).map(() => Array(5).fill(null));

        fetchedData.forEach(entry => {
            const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].indexOf(entry.day.toLowerCase());
            if (dayIndex !== -1 && entry.period >= 1 && entry.period <= 4) {
                newTimetable[entry.period - 1][dayIndex] = entry;
            }
        });
        setTimetableData(newTimetable);

    } catch (error) {
        console.error("Error fetching timetable:", error);
    }
  }, [currentMonday, props.user?.id]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable, i18n.language]); // 言語変更時にも再取得

  // --- 週移動 ---
  const changeWeek = (offset: number) => {
    setCurrentMonday(prev => {
      const newMonday = new Date(prev);
      newMonday.setDate(newMonday.getDate() + offset * 7);
      return newMonday;
    });
  };

  // --- 表示用データ ---
  const startOfWeek = currentMonday;
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 4);
  const formatDate = (date: Date) => `${date.getMonth() + 1}${t('month')}${date.getDate()}${t('day')}`;

  const weekHeaders = [t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday')];

  return (
    <>
      <div className="rectangle">
        <div className="date-selector">
          <button onClick={() => changeWeek(-1)}>←</button>
          <div>{formatDate(startOfWeek)} 〜 {formatDate(endOfWeek)}</div>
          <button onClick={() => changeWeek(1)}>→</button>
        </div>
        <div className="top-right-box">
          {/* 2. 翻訳キーを修正 */}
          {props.user?.class}{t('class')} {props.user?.number}{t('number')} {props.user?.name}{t('studentName')}
        </div>
      </div>

      <Table className="custom-table">
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="header-black">{t('empty')}</Table.Th>
            {weekHeaders.map((header, i) => (
              <Table.Th key={i} className={`header-blue ${isEnglish ? 'english' : ''}`}>{header}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {timetableData.map((row, rowIndex) => (
            <Table.Tr key={rowIndex}>
              <Table.Td className="ag-cell" style={{ backgroundColor: 'rgb(190, 190, 190)' }}>{rowIndex + 1}</Table.Td>
              {row.map((cell, colIndex) => (
                <Table.Td key={colIndex} className={`ag-cell ${(rowIndex % 2 === 0) ? 'highlight-cell-odd' : 'highlight-cell-even'}`}>
                  {cell ? `${cell.subject.name}\n${cell.user.name}${t('teacherSuffix', { ns: 'common' })}\n${cell.room.name}` : ''}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      
      <div className="back-button-container">
        {/* 3. 戻るボタンを修正 */}
        <Button onClick={() => window.history.back()} variant="filled" size="xl" style={{ width: '150px' }}>
          {t('back', { ns: 'common' })}
        </Button>
      </div>

      {/* --- CSSスタイルは省略 --- */}
      <style>{`
        .custom-table {
          table-layout: fixed !important;
          width: 100% !important; 
          max-width: 840px;
          border-collapse: collapse;
          margin: 0 auto;
          margin-top: 50px; 
        }
        .custom-table th, .custom-table td {
          min-width: 100px; /* width を min-width に変更 */
          height: 90px;
          text-align: center;
          vertical-align: middle;
          border: 1px solid white;
          user-select: none;
          white-space: nowrap; /* nowrap に戻す */
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
          font-size: 50px; /* 元の 50px に戻す */
        }
        .header-blue.english {
          font-size: 20px; /* 英語の場合のフォントサイズ */
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
        
        @media (max-width: 768px) {
          .custom-table {
            margin-top: 20px;
          }
          .custom-table th, .custom-table td {
            width: auto;
            height: 60px;
            font-size: 12px;
          }
          .header-blue {
            font-size: 18px;
          }
          .ag-cell {
            font-size: 14px;
          }
          .rectangle {
            height: auto;
            flex-direction: column;
            align-items: center;
            padding: 10px;
          }
          .date-selector {
            font-size: 16px;
            flex-direction: column;
            width: 100%;
            margin: 10px 0 0 0;
            padding: 10px 0;
            align-items: center;
          }
          .date-selector button {
            font-size: 18px;
          }
          .top-right-box {
            position: static;
            margin-top: 10px;
            font-size: 12px;
            width: 90%;
            text-align: center;
          }
          .back-button-container {
            position: static;
            margin: 20px auto;
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}