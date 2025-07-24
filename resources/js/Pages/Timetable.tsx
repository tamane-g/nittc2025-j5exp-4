// resources/js/Pages/Timetable.tsx

import React, { useMemo } from 'react';
import { Table, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { usePage, router } from '@inertiajs/react';

// --- データ型の定義 (新しいpropsの構造に合わせる) ---
interface TimetableEntry {
  subject: { name: string; };
  teacher: { name: string; }; // userからteacherに変更
  room: { name: string; };
}

interface DailyLessons {
    [lessonKey: string]: TimetableEntry; //例: "lesson_1", "lesson_2"
}

interface TimetableObject {
    [dayKey: string]: DailyLessons; // 例: "Monday", "Tuesday"
}

interface PageProps {
  user?: { id?: string; name?: string; class?: string; number?: string; };
  timetable: TimetableObject; // Laravelから渡される時間割データ (オブジェクト型)
  monday: string;             // Laravelから渡される週の月曜日の日付
  [key: string]: any;
}

// --- メインコンポーネント ---
export default function Timetable() {
  const { t, i18n } = useTranslation(['timetable', 'common']);
  const { props } = usePage<PageProps>();
  const isEnglish = i18n.language === 'en';

  // propsのtimetableオブジェクトから表示用の2次元配列を生成
  const timetableData = useMemo(() => {
    const newTimetable: (TimetableEntry | null)[][] = Array(4).fill(null).map(() => Array(5).fill(null));
    const timetable = props.timetable || {}; // timetableがundefinedの場合も考慮

    const dayMapping: { [key: string]: number } = {
        'Monday': 0,
        'Tuesday': 1,
        'Wednesday': 2,
        'Thursday': 3,
        'Friday': 4,
    };

    // timetableオブジェクトのキー（曜日）をループ
    for (const dayName in timetable) {
        const dayIndex = dayMapping[dayName];
        if (dayIndex === undefined) continue; // 想定外の曜日キーはスキップ

        const lessons = timetable[dayName];
        // lessonsオブジェクトのキー（時限）をループ
        for (const lessonKey in lessons) {
            const periodMatch = lessonKey.match(/lesson_(\d+)/);
            if (periodMatch) {
                const period = parseInt(periodMatch[1], 10);
                if (period >= 1 && period <= 4) {
                    newTimetable[period - 1][dayIndex] = lessons[lessonKey];
                }
            }
        }
    }

    return newTimetable;
  }, [props.timetable]);

  // --- 週移動 ---
  const changeWeek = (offset: number) => {
    const currentDay = new Date(props.monday);
    currentDay.setDate(currentDay.getDate() + offset * 7);
    const newDate = currentDay.toISOString().split('T')[0];

    router.get(route('timetable.show'), { first_date: newDate }, { // ルート名は適宜調整
        preserveState: true,
        preserveScroll: true,
    });
  };

  // --- 表示用データ ---
  const startOfWeek = new Date(props.monday);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 4);

  const formatDate = (date: Date) => `${date.getUTCMonth() + 1}${t('month')}${date.getUTCDate()}${t('day')}`;
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
                  {cell ? `${cell.subject.name}\n${cell.teacher.name}${t('teacherSuffix', { ns: 'common' })}\n${cell.room.name}` : ''}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      
      <div className="back-button-container">
        <Button onClick={() => window.history.back()} variant="filled" size="xl" style={{ width: '150px' }}>
          {t('back', { ns: 'common' })}
        </Button>
      </div>

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
          min-width: 100px;
          height: 90px;
          text-align: center;
          vertical-align: middle;
          border: 1px solid white;
          user-select: none;
          white-space: pre-wrap; /* 改行を有効にする */
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
        .header-blue.english {
          font-size: 20px;
        }
        .ag-cell {
          text-align: center;
          user-select: none;
          font-size: 30px;
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
          height: 60px;
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
          .custom-table { margin-top: 20px; }
          .custom-table th, .custom-table td { height: 60px; font-size: 12px; }
          .header-blue { font-size: 18px; }
          .ag-cell { font-size: 14px; }
          .rectangle { height: auto; flex-direction: column; align-items: center; padding: 10px; }
          .date-selector { font-size: 16px; flex-direction: column; width: 90%; margin: 10px 0 0 0; padding: 10px 0; align-items: center; }
          .date-selector button { font-size: 18px; }
          .top-right-box { position: static; margin-top: 10px; font-size: 12px; width: 90%; text-align: center; }
          .back-button-container { position: static; margin: 20px auto; width: 100%; text-align: center; }
        }
      `}</style>
    </>
  );
}