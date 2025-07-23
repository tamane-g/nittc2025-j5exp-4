// resources/js/Pages/TimetableChange.tsx

import React, { useState, useMemo } from 'react';
import { Button, NativeSelect } from '@mantine/core';
import { usePage, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';


// --- データ型定義 ---
interface PageProps {
  change_request_id: number; // Laravelから渡されるプロパティの例
  // 他の必要なプロパティ
}

interface TimetableInfo {
  subject: { name: string };
  user: { name: string };
  room: { name: string };
}

// --- メインコンポーネント ---
export default function TimetableChange() {
  const { t, i18n } = useTranslation(['timetable_change', 'common', 'admin']);
  const { props } = usePage<PageProps>();
  console.log('props:', props);

  const { data, setData, post, errors } = useForm({
    subject_id: '',
    room_id: '',
  });

  // --- フォーム送信 ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', data);
    post(`/change-requests/${props.change_request_id}`);
  };

  // --- 選択肢のデータ（翻訳対応） ---
  const subjectOptions = useMemo(
    () => [
      {
        group: t('generalSubjects'),
        items: [
          { label: t('japanese'), value: '1' },
          { label: t('english'), value: '2' },
          { label: t('math'), value: '3' },
        ],
      },
      {
        group: t('specializedSubjects'),
        items: [
          { label: t('programming'), value: '4' },
          { label: t('logicCircuit'), value: '5' },
          { label: t('experiment'), value: '6' },
        ],
      },
    ],
    [i18n.language, t]
  );

  const roomOptions = useMemo(
    () => [
      { label: t('room5_5', { ns: 'admin' }), value: '1' },
      { label: t('practiceRoom'), value: '2' },
      { label: t('gym'), value: '3' },
    ],
    [i18n.language, t]
  );



  return (
    <form onSubmit={handleSubmit}>
      <div className="rectangle">
        {/* ... ヘッダー部分は省略 ... */}
        <div className="top-right-box">
          {t('teacherSuffix', { ns: 'common' })}
        </div>
      </div>

      <div className="row-container">
        <div className="select-box">
          <div className="left-select">{t('afterChange')}</div>
          <NativeSelect
            size="xl"
            className="right-select"
            radius="0"
            data={subjectOptions}
            value={data.subject_id}
            onChange={(event) => setData('subject_id', event.currentTarget.value)}
          />
        </div>
      </div>

      <div className="row-container">
        <div className="split-box">
          <div className="left-half">{t('applicant')}</div>
          <div className="right-half">
            {t('teacherSuffix', { ns: 'common' })}
          </div>
        </div>
        <div className="select-box">
          <div className="left-select">{t('location')}</div>
          <NativeSelect
            size="xl"
            className="right-select"
            radius="0"
            data={roomOptions}
            value={data.room_id}
            onChange={(event) => setData('room_id', event.currentTarget.value)}
          />
        </div>
      </div>

      {/* ... 日付や時間の表示部分は省略 ... */}

      <div className="back-button-container">
        <Button
          onClick={() => window.history.back()}
          variant="filled"
          size="xl"
          style={{ width: '150px' }}
        >
          {t('back', { ns: 'common' })}
        </Button>
      </div>

      <div className="send-button-container">
        <Button type="submit" variant="filled" size="xl" style={{ width: '150px' }}>
          {t('send')}
        </Button>
      </div>

      {/* --- CSSスタイルは省略 --- */}
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
    </form>
  );
}
