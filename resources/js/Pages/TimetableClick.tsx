// resources/js/Pages/TimetableClick.tsx

import React, { useMemo } from 'react';
import { Table, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { usePage, router, Link } from '@inertiajs/react';

// --- データ型の定義 (propsの構造に合わせる) ---
interface TimetableEntry {
  id: number; // クリック時に渡すID
  subject: { name: string; };
  teacher: { name: string; }; // userからteacherに変更
  room: { name: string; };
}

interface DailyLessons {
    [lessonKey: string]: TimetableEntry; //例: "lesson_1"
}

interface TimetableObject {
    [dayKey: string]: DailyLessons; // 例: "Monday"
}

interface PageProps {
  user?: { id?: string; name?: string; class?: string; number?: string; };
  timetable: TimetableObject; // Laravelから渡される時間割データ (オブジェクト型)
  monday: string;             // Laravelから渡される週の月曜日の日付
  [key: string]: any;
}

// --- メインコンポーネント ---
export default function TimetableClick() {
  const { t, i18n } = useTranslation(['timetable', 'common']);
  const { props } = usePage<PageProps>();
  const isEnglish = i18n.language === 'en';

  // propsのtimetableオブジェクトから表示用の2次元配列を生成
  const timetableData = useMemo(() => {
    const newTimetable: (TimetableEntry | null)[][] = Array(4).fill(null).map(() => Array(5).fill(null));
    const timetable = props.timetable || {};

    const dayMapping: { [key: string]: number } = {
        'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4,
    };

    for (const dayName in timetable) {
        const dayIndex = dayMapping[dayName];
        if (dayIndex === undefined) continue;

        const lessons = timetable[dayName];
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

    // GETパラメータを付けてページを再訪問
    router.get(route('teacher.timetablechange.view'), { first_date: newDate }, { // ルート名は適宜調整
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
                  {cell ? (
                    <Link
                      href={route('teacher.timetablechange.show', { change: cell.id })} // ルート名とパラメータを正しく指定
                      as="button"
                      className="timetable-cell-link"
                    >
                      {`${cell.subject.name}\n${cell.teacher.name}${t('teacherSuffix', { ns: 'common' })}\n${cell.room.name}`}
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
        <Button component={Link} href={route('timetable.search')} variant="filled" size="lg"> {/* ルート名は適宜調整 */}
          {t('searchAndChange')}
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
          white-space: pre-wrap;
        }
        .header-black {
          background-color: black !important;
          border: 1px solid white;
          color: white;
        }
        .header-blue {
          background-color: rgb(12, 106, 207) !important;
          color: white !important;
          border: 1px solid white;
          font-size: 50px;
        }
        .header-blue.english {
          font-size: 20px;
        }
        .ag-cell {
          font-size: 24px; /* 少し小さく調整 */
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
          padding: 10px;
          display: flex;
          gap: 10px;
          font-weight: bold;
          font-size: 30px;
          margin-top: 20px;
          margin-left: 20px;
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
        }
        .timetable-cell-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 5px;
          margin: 0;
          background: transparent;
          border: none;
          color: inherit;
          font-size: inherit;
          white-space: pre-wrap;
          cursor: pointer;
          line-height: 1.2;
        }
        .bottom-buttons-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          bottom: 50px;
          left: 50px;
          right: 50px;
          z-index: 10;
        }
        @media (max-width: 768px) {
          /* ... responsive styles ... */
        }
      `}</style>
    </>
  );
}