import { useState, useEffect, useCallback } from 'react';
import { Table } from '@mantine/core';
import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import axios from 'axios'; // Import axios for API calls
import { usePage } from '@inertiajs/react'; // To get user data from Inertia.js props
import { Link } from '@inertiajs/react';

interface UserProps {
  user?: {
    id?: string;
  };
  [key: string]: any; // Allow other properties
}

interface Subject {
  name: string;
}

interface Room {
  name: string;
}

interface TimetableUser {
  name: string;
}

interface TimetableEntry {
  subject: Subject;
  user: TimetableUser;
  room: Room;
}

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatDate(date: Date, t: (key: string) => string) {
  return `${date.getMonth() + 1}${t('Timetable.month')}${date.getDate()}${t('Timetable.day')}`;
}


export default function Timetable() {
  const { t, i18n } = useTranslation();
  const [timetableData, setTimetableData] = useState<TimetableEntry[][]>([]); // State to store fetched timetable data as a 2D array
  const [currentMonday, setCurrentMonday] = useState(getStartOfWeek(new Date()));
  const { props } = usePage<UserProps>(); // Get page props from Inertia.js

  const isEnglish = i18n.language === 'en';

  console.log(props);

  const fetchTimetable = useCallback(async () => {
    try {
      const formattedDate = currentMonday.toISOString().split('T')[0]; // YYYY-MM-DD format
      const userId = props.user?.id; // Assuming user ID is available in props.user.id

      if (!userId) {
        console.warn("User ID not found. Cannot fetch timetable.");
        return;
      }

      const response = await axios.get('/timetable', {
        params: {
          first_date: formattedDate,
          user: userId,
        },
      });

      // Assuming response.data.timetable is an array of objects like:
      // { day: string, period: number, subject: { name: string }, user: { name: string }, room: { name: string } }
      const fetchedTimetable = response.data.timetable; // This should be an array of timetable entries

      // Initialize a 2D array for the table (e.g., 4 periods x 5 days + 1 for period numbers)
      const newTimetableData: (TimetableEntry | string)[][] = Array(4).fill(null).map((_, periodIndex) => {
        const row: (TimetableEntry | string)[] = Array(6).fill('');
        row[0] = `${periodIndex + 1}`; // Period number
        return row;
      });

      // Populate the 2D array with fetched data
      fetchedTimetable.forEach((entry: TimetableEntry & { day: string, period: number }) => {
        const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].indexOf(entry.day.toLowerCase());
        if (dayIndex !== -1 && entry.period >= 1 && entry.period <= 4) {
          newTimetableData[entry.period - 1][dayIndex + 1] = entry;
        }
      });

      setTimetableData(newTimetableData as TimetableEntry[][]);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      // Handle error, e.g., display an error message to the user
    }
  }, [currentMonday, props.user?.id]);

  useEffect(() => {
    fetchTimetable();
  }, [currentMonday, props.user?.id, fetchTimetable]); // Refetch when week changes or user ID becomes available

  const changeWeek = (offset: number) => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(newMonday.getDate() + offset * 7);
    setCurrentMonday(newMonday);
  };


  const startOfWeek = currentMonday;
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 4);


  return (
    <>
      <div className="rectangle">
        <div className="date-selector">
          <button onClick={() => changeWeek(-1)}>←</button>
          <div>
            {formatDate(startOfWeek, t)} 〜 {formatDate(endOfWeek, t)}
          </div>
          <button onClick={() => changeWeek(1)}>→</button>
          <div className="top-right-box">5{t('Timetable.year')}5{t('Timetable.class')}　99{t('Timetable.number')}　{t('Timetable.studentName')}</div>
        </div>
      </div>

      <div className="back-button-container">
        <Button component={Link} href={'/'} variant="filled" size="xl" style={{ width: '150px' }}>{t('back')}</Button>
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

      <Table className="custom-table">
        <Table.Thead>
          <Table.Tr>
            {[t('Timetable.empty'), t('Timetable.monday'), t('Timetable.tuesday'), t('Timetable.wednesday'), t('Timetable.thursday'), t('Timetable.friday')].map((header, i) => (
              <Table.Th key={i} className={`${i === 0 ? 'header-black' : 'header-blue'} ${isEnglish ? 'english' : ''}`}>
                {header}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {timetableData.map((row, rowIndex) => (
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
                    className={`ag-cell ${isLeftColumn
                        ? ''
                        : isGreen
                          ? 'highlight-cell-odd'
                          : isYellow
                            ? 'highlight-cell-even'
                            : ''
                      }`}
                    col-id={isLeftColumn ? 'idColumn' : `col${colIndex}`}
                    style={{ cursor: 'default', whiteSpace: 'pre-wrap' }} // Allow text wrapping
                  >
                    {typeof cell === 'string' ? cell : 
                      cell ? `${cell.subject.name}\n${cell.user.name}先生\n${cell.room.name}` : ''}
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
