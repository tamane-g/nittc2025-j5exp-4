// TimetableChange.tsx
import { useState, useEffect } from 'react';
import { Button } from '@mantine/core';
import { NativeSelect } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';


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

export default function TimetableChange() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [clickedMessage] = useState('');
  const [currentMonday, setCurrentMonday] = useState(getStartOfWeek(new Date()));
  const [beforeTimetable, setBeforeTimetable] = useState({ subject: { name: '' }, room: { name: '' }, user: { name: '' } });
  const [afterTimetable, setAfterTimetable] = useState({ subject: { name: '' }, room: { name: '' }, user: { name: '' } });

  const { data, setData, post } = useForm({
    subjectAfterChange: '',
    locationAfterChange: '',
    id: location.state?.id || '', // Initialize with ID from location state
    approval: false, // Default approval status
    description: '', // Default description
  });

  useEffect(() => {
    const fetchChangeRequest = async () => {
      const changeRequestId = location.state?.id; // Assuming ID is passed via state
      if (changeRequestId) {
        try {
          const response = await axios.get(`/change`, { params: { id: changeRequestId } });
          const { before_timetable, after_timetable } = response.data;
          setBeforeTimetable(before_timetable);
          setAfterTimetable(after_timetable);
          setData(prevData => ({
            ...prevData,
            subjectAfterChange: after_timetable.subject.name,
            locationAfterChange: after_timetable.room.name,
          }));
        } catch (error) {
          console.error("Error fetching change request:", error);
        }
      }
    };
    fetchChangeRequest();
  }, [location.state?.id, setData]);

  const changeWeek = (offset: number) => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(newMonday.getDate() + offset * 7);
    setCurrentMonday(newMonday);
  };

  const handleSubmit = () => {
    // APIへの送信処理
    post('/change');
    console.log('Form data submitted:', data);
    navigate(-1);
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
          <div className="top-right-box">{t('TimetableChange.teacherName')}</div>
        </div>
      </div>

      {clickedMessage && (
        <div style={{ marginBottom: 10, fontWeight: 'bold', color: 'blue' }}>
          {clickedMessage}
        </div>
      )}

      <div className="row-container">
        <div className="split-box">
          <div className="left-half">{t('TimetableChange.beforeChange')}</div>
          <div className="right-half">{beforeTimetable.subject.name} ({beforeTimetable.user.name}先生) - {beforeTimetable.room.name}</div>
        </div>
        <div className="select-box">
          <div className="left-select">{t('TimetableChange.afterChange')}</div>
          <NativeSelect size="xl" className="right-select" radius="0"
            data={[
              {
                group: t('TimetableChange.generalSubjects'),
                items: [
                  { label: t('TimetableChange.japanese'), value: 'Japanese' },
                  { label: t('TimetableChange.english'), value: 'English' },
                  { label: t('TimetableChange.math'), value: 'math' },
                ],
              },
              {
                group: t('TimetableChange.specializedSubjects'),
                items: [
                  { label: t('TimetableChange.programming'), value: 'express' },
                  { label: t('TimetableChange.logicCircuit'), value: 'koa' },
                  { label: t('TimetableChange.experiment'), value: 'django' },
                ],
              },
            ]}
            value={data.subjectAfterChange}
            onChange={(event) => setData('subjectAfterChange', event.currentTarget.value)}
          />
        </div>
      </div>


      <div className="row-container">
        <div className="split-box">
          <div className="left-half">{t('TimetableChange.replacer')}</div>
          <div className="right-half">{beforeTimetable.user.name}</div>
        </div>
        <div className="right-box">
          <div className="left-half">{t('TimetableChange.applicant')}</div>
          <div className="right-half">{afterTimetable.user.name}</div>
        </div>
      </div>


      <div className="row-container">
        <div className="split-box">
          <div className="left-half">{t('TimetableChange.date')}</div>
          <div className="right-half">{t('TimetableChange.datePlaceholder')}</div>
        </div>
        <div className="select-box">
          <div className="left-select">{t('TimetableChange.location')}</div>
          <NativeSelect size="xl" className="right-select" radius="0"
            data={[
              { label: '5-5', value: 'class-room' },
              { label: t('TimetableChange.practiceRoom'), value: 'Practice-room' },
              { label: t('TimetableChange.gym'), value: 'gym' }
            ]}
            rightSection={null}
            value={data.locationAfterChange}
            onChange={(event) => setData('locationAfterChange', event.currentTarget.value)}
          />
        </div>
      </div>


      <div className="split-box time-box" style={{ marginTop: '50px' }}>
        <div className="left-half">{t('TimetableChange.time')}</div>
        <div className="right-half">{t('TimetableChange.timePlaceholder')}</div>
      </div>


      <div className="back-button-container">
        <Button variant="filled" size="xl" onClick={() => navigate(-1)} style={{ width: '150px' }}>{t('back')}</Button>
      </div>

      <div className="send-button-container">
        <Button variant="filled" size="xl" onClick={handleSubmit} style={{ width: '150px' }}>{t('TimetableChange.send')}</Button>
      </div>


      <style>{`
        
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

      .row-container {
        display: flex;
        gap: 80px; 
        margin-top: 50px;
      }

      .split-box {
        display: flex;
        width: 400px;
        height: 70px;
        border: 2px solid black;
        font-Size: 30px;
        margin-left: 300px;
      }

      .right-box {
        display: flex;
        width: 400px;
        height: 70px;
        border: 2px solid black;
        font-Size: 30px;
        bottom: 70px;
      }

      .left-half {
        width: 30%;
        background-color: rgb(12, 106, 207);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }

      .right-half {
        width: 70%;
        background-color: white;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        border-LEFT: 2px solid black;
      }

      .back-button-container {
        position: absolute;
        left: 50px;
        bottom: 70px;
      }

      .send-button-container {
        position: absolute;
        right: 50px;
        bottom: 70px;
      }

      .select-box {
       display: flex;
       height: 70px;
       width: 400px; /* Added for consistent width */
      }

      .left-select {
        width: 120px;
        background-color: rgb(12, 106, 207);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-Size: 30px;
        border-top: 2px solid black;
        border-left: 2px solid black;
        border-bottom: 2px solid black;
      }

      .right-select { /* Added for consistent width */
        width: 280px;
      }

      .right-select select {
        border: 2px solid black;
        height: 70px !important;
        font-size: 28px !important;
        text-align: center; 
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 0;
         appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background: none;
      }

      @media (max-width: 768px) {
        .rectangle {
          height: auto;
          padding: 10px;
          flex-direction: column;
          align-items: center;
        }
        .date-selector {
          font-size: 18px;
          flex-direction: column;
          width: 100%;
          margin: 10px 0 0 0;
          padding: 10px 0;
          align-items: center;
        }
        .top-right-box {
          position: static;
          margin-top: 10px;
          width: 90%;
          font-size: 16px;
          text-align: center;
        }
        .row-container {
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
          align-items: center;
        }
        .split-box, .right-box, .select-box {
          width: 90%;
          max-width: 600px;
          font-size: 18px; /* Adjusted font size for labels */
          height: 60px;
          margin-left: 0; /* Remove fixed margin */
        }
        /* Ensure input elements within these boxes are also styled */
        .split-box .right-half, .right-box .right-half {
          font-size: 16px; /* Adjusted font size for text in right half of split/right boxes */
        }
        .select-box .right-select select {
          font-size: 16px !important; /* Adjusted font size for select input */
          height: 60px !important;
        }
        .time-box {
          margin-top: 20px; /* Adjust margin for time box */
          width: 90%; /* Ensure it takes full width */
        }
        .back-button-container, .send-button-container {
          position: static;
          width: 100%;
          margin-top: 20px;
          text-align: center;
        }
        .back-button-container button, .send-button-container button {
          width: 80%;
        }
      }
          
      `}</style>

    </>
  );
}
