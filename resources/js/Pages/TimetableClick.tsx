// resources/js/Pages/TimetableClick.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { usePage, Link } from '@inertiajs/react';

// --- データ型の定義 ---
interface UserProps {
  user?: { id?: string; name?: string; class?: string; number?: string; };
  [key: string]: any;
}

interface TimetableEntry {
  id: number; // クリック時に渡すためのID
  subject: { name: string; };
  user: { name: string; };
  room: { name: string; };
}

// --- ヘルパー関数 ---
function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

// --- メインコンポーネント ---
export default function TimetableClick() {
  // 1. 名前空間を指定
  const { t, i18n } = useTranslation(['timetable', 'common']);
  const [timetableData, setTimetableData] = useState<(TimetableEntry | null)[][]>([]);
  const [currentMonday, setCurrentMonday] = useState(getStartOfWeek(new Date()));
  const { props } = usePage<UserProps>();
  const isEnglish = i18n.language === 'en';

  // --- APIから時間割データを取得 ---
  const fetchTimetable = useCallback(async () => {
    // モックデータ（APIが未実装の場合）
    const mockTimetable: (TimetableEntry & { day: string, period: number })[] = [
        { id: 101, day: 'monday', period: 1, subject: { name: '国語' }, user: { name: '鈴木' }, room: { name: '3-1' } },
        { id: 102, day: 'tuesday', period: 2, subject: { name: '数学' }, user: { name: '佐藤' }, room: { name: '3-2' } },
        { id: 103, day: 'friday', period: 4, subject: { name: '体育' }, user: { name: '田中' }, room: { name: '体育館' } },
    ];

    try {
        // APIを叩く場合はこちらを有効化
        /*
        const formattedDate = currentMonday.toISOString().split('T')[0];
        const userId = props.user?.id;
        if (!userId) return;
        const response = await axios.get('/api/timetable', { params: { first_date: formattedDate, user_id: userId } });
        const fetchedData = response.data.timetable;
        */
        const fetchedData = mockTimetable;

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
  }, [fetchTimetable, i18n.language]);

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
                  {cell ? (
                    // 2. セルをLinkコンポーネントでラップし、IDを渡す
                    <Link
                      href="/timetable-change"
                      data={{ change_request_id: cell.id }}
                      as="button"
                      className="timetable-cell-link"
                    >
                      {`${cell.subject.name}\n${cell.user.name}${t('teacherSuffix', { ns: 'common' })}\n${cell.room.name}`}
                    </Link>
                  ) : ''}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <div className="bottom-buttons-container">
        <Button onClick={() => window.history.back()} variant="filled" size="xl" style={{ width: '150px' }}>
          {t('back', { ns: 'common' })}
        </Button>
        <Button component={Link} href={'/timetable-search'} variant="filled" size="lg">
          {t('searchAndChange')}
        </Button>
      </div>

      {/* --- CSSスタイル --- */}
      <style>{`
        /* ... 省略 ... */
        .timetable-cell-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          background: transparent;
          border: none;
          color: inherit;
          font-size: inherit;
          white-space: pre-wrap;
          cursor: pointer;
        }
        .bottom-buttons-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          bottom: 50px;
          left: 50px;
          right: 50px;
        }
      `}</style>
    </>
  );
}