// resources/js/Pages/TimetableChange.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Button, NativeSelect, Box, Container } from '@mantine/core';
import { usePage, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// --- データ型定義 ---
interface PageProps {
  change_request_id: number;
}
interface TimetableInfo {
  subject: { id: number; name: string; };
  user: { id: number; name: string; };
  room: { id: number; name: string; };
}

// --- ヘルパー関数 ---
function getStartOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
}

function formatDate(date: Date, t: any, ns: string) {
    return `${date.getMonth() + 1}${t('month', { ns })}${date.getDate()}${t('day', { ns })}`;
}

// --- メインコンポーネント ---
export default function TimetableChange() {
  const { t, i18n } = useTranslation(['timetable_change', 'common', 'admin', 'timetable']);
  const { props } = usePage<PageProps>();

  const [currentMonday, setCurrentMonday] = useState(getStartOfWeek(new Date()));
  const [beforeTimetable, setBeforeTimetable] = useState<TimetableInfo | null>(null);
  const [afterUser, setAfterUser] = useState<TimetableInfo['user'] | null>(null);

  const { data, setData, post, processing } = useForm({
    subject_id: '',
    room_id: '',
  });

  useEffect(() => {
    // APIやモックデータから情報を取得
    const mockResponse = {
        before_timetable: { subject: { id: 1, name: '国語' }, user: { id: 10, name: '鈴木' }, room: { id: 100, name: '3-1' } },
        after_user: { id: 11, name: '佐藤' },
    };
    setBeforeTimetable(mockResponse.before_timetable);
    setAfterUser(mockResponse.after_user);
  }, [props.change_request_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/teacher/change-requests/${props.change_request_id}`);
  };

  const changeWeek = (offset: number) => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(newMonday.getDate() + offset * 7);
    setCurrentMonday(newMonday);
  };

  const startOfWeek = currentMonday;
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 4);

  // 選択肢のデータ
  const subjectOptions = useMemo(() => [
      { group: t('generalSubjects'), items: [
          { label: t('japanese', { ns: 'common' }), value: '1' },
          { label: t('english', { ns: 'common' }), value: '2' },
      ]},
      { group: t('specializedSubjects'), items: [
          { label: t('programming', { ns: 'common' }), value: '4' },
          { label: t('experiment', { ns: 'common' }), value: '6' },
      ]},
  ], [i18n.language, t]);

  const roomOptions = useMemo(() => [
      { label: t('room5_5', { ns: 'admin' }), value: '1' },
      { label: t('practiceRoom'), value: '2' },
      { label: t('gym'), value: '3' },
  ], [i18n.language, t]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* ▼▼▼ ご提示いただいた見本コードのヘッダーを完全に再現 ▼▼▼ */}
        <div className="rectangle">
          <div className="date-selector">
            <button type="button" onClick={() => changeWeek(-1)}>←</button>
            <div>
              {formatDate(startOfWeek, t, 'timetable')} 〜 {formatDate(endOfWeek, t, 'timetable')}
            </div>
            <button type="button" onClick={() => changeWeek(1)}>→</button>
            <div className="top-right-box">{t('teacherName')}</div>
          </div>
        </div>

        {/* フォーム本体 */}
        <div className="row-container">
            <div className="split-box">
                <div className="left-half">{t('beforeChange')}</div>
                <div className="right-half">
                    {beforeTimetable ? `${beforeTimetable.subject.name} (${beforeTimetable.user.name}${t('teacherSuffix', { ns: 'common' })}) - ${beforeTimetable.room.name}` : ''}
                </div>
            </div>
            <div className="select-box">
                <div className="left-select">{t('afterChange')}</div>
                <NativeSelect size="xl" className="right-select" radius="0"
                    data={subjectOptions}
                    value={data.subject_id}
                    onChange={(event) => setData('subject_id', event.currentTarget.value)}
                />
            </div>
        </div>

        <div className="row-container">
            <div className="split-box">
                <div className="left-half">{t('replacer')}</div>
                <div className="right-half">{beforeTimetable?.user.name}</div>
            </div>
            <div className="right-box">
                <div className="left-half">{t('applicant')}</div>
                <div className="right-half">{afterUser?.name}</div>
            </div>
        </div>

        <div className="row-container">
            <div className="split-box">
                <div className="left-half">{t('date')}</div>
                <div className="right-half">{t('datePlaceholder')}</div>
            </div>
            <div className="select-box">
                <div className="left-select">{t('location')}</div>
                <NativeSelect size="xl" className="right-select" radius="0"
                    data={roomOptions}
                    value={data.room_id}
                    onChange={(event) => setData('room_id', event.currentTarget.value)}
                />
            </div>
        </div>
        
        <div className="split-box time-box" style={{ marginTop: '50px' }}>
            <div className="left-half">{t('time')}</div>
            <div className="right-half">{t('timePlaceholder')}</div>
        </div>

        <div className="back-button-container">
            <Button variant="filled" size="xl" onClick={() => window.history.back()} style={{ width: '150px' }}>
                {t('back', { ns: 'common' })}
            </Button>
        </div>

        <div className="send-button-container">
            <Button type="submit" variant="filled" size="xl" style={{ width: '150px' }} loading={processing}>
                {t('send')}
            </Button>
        </div>
      </form>
      
      {/* ▼▼▼ ご提示いただいた見本コードのCSSを完全に再現 ▼▼▼ */}
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
        .row-container {
          display: flex;
          gap: 80px;
          margin-top: 50px;
          justify-content: center; /* 中央揃えを追加 */
        }
        .split-box, .right-box {
          display: flex;
          width: 400px;
          height: 70px;
          border: 2px solid black;
          font-size: 24px; /* フォントサイズを調整 */
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
          border-left: 2px solid black;
          padding: 0 5px; /* パディングを追加 */
          overflow: hidden; /* はみ出しを隠す */
          white-space: nowrap; /* 折り返さない */
          text-overflow: ellipsis; /* ...で省略 */
        }
        .back-button-container, .send-button-container {
          position: absolute;
          bottom: 70px;
        }
        .back-button-container { left: 50px; }
        .send-button-container { right: 50px; }
        .select-box {
          display: flex;
          height: 70px;
          width: 400px;
        }
        .left-select {
          width: 120px;
          background-color: rgb(12, 106, 207);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 24px;
          border-top: 2px solid black;
          border-left: 2px solid black;
          border-bottom: 2px solid black;
        }
        .right-select {
          width: 280px;
        }
        .right-select select {
          border: 2px solid black;
          border-left: none; /* 左のボーダーを削除 */
          height: 100% !important;
          font-size: 24px !important;
          text-align: center;
          padding-left: 0;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background: none;
        }
        .time-box {
            margin-left: auto;
            margin-right: auto;
        }
        @media (max-width: 900px) { /* レスポンシブ対応 */
          .row-container { flex-direction: column; align-items: center; gap: 20px; margin-top: 20px; }
          .split-box, .right-box, .select-box { width: 90%; max-width: 450px; }
          .back-button-container, .send-button-container { position: static; width: 100%; text-align: center; margin-top: 20px; }
        }
      `}</style>
    </>
  );
}