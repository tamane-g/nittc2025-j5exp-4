// resources/js/Pages/TimetableChange.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Button, NativeSelect } from '@mantine/core';
import { usePage, useForm, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// --- データ型定義 ---
interface PageProps {
  change_request_id: number; // Laravelから渡されるプロパティの例
  // 他の必要なプロパティ
}

interface TimetableInfo {
  subject: { name: string; };
  user: { name: string; };
  room: { name: string; };
}

// --- メインコンポーネント ---
export default function TimetableChange() {
  // 1. 名前空間を指定
  const { t, i18n } = useTranslation(['timetable_change', 'common']);
  const { props } = usePage<PageProps>();

  const [beforeTimetable, setBeforeTimetable] = useState<TimetableInfo | null>(null);
  const [afterTimetable, setAfterTimetable] = useState<TimetableInfo | null>(null);

  const { data, setData, post, errors } = useForm({
    subject_id: '',
    room_id: '',
    // 他にサーバーに送るデータ
  });

  // --- データ取得ロジック ---
  useEffect(() => {
    const changeRequestId = props.change_request_id;
    if (changeRequestId) {
      const fetchChangeRequest = async () => {
        try {
          // APIからデータを取得
          // const response = await axios.get(`/api/change-requests/${changeRequestId}`);
          // const { before_timetable, after_timetable } = response.data;
          
          // モックデータ（API実装まで）
          const mockResponse = {
              before_timetable: { subject: { name: '国語' }, user: { name: '鈴木' }, room: { name: '3-1' } },
              after_timetable: { subject: { name: '' }, user: { name: '佐藤' }, room: { name: '' } },
          };
          const { before_timetable, after_timetable } = mockResponse;

          setBeforeTimetable(before_timetable);
          setAfterTimetable(after_timetable);
          setData({ // フォームの初期値を設定
              subject_id: '', // after_timetable.subject.id など
              room_id: '', // after_timetable.room.id など
          });

        } catch (error) {
          console.error("Error fetching change request:", error);
        }
      };
      fetchChangeRequest();
    }
  }, [props.change_request_id]);


  // --- フォーム送信 ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/change-requests/${props.change_request_id}`);
  };


  // --- 選択肢のデータ（翻訳対応） ---
  const subjectOptions = useMemo(() => [
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
  ], [i18n.language, t]);

  const roomOptions = useMemo(() => [
    { label: t('room5_5', { ns: 'admin' }), value: '1' },
    { label: t('practiceRoom'), value: '2' },
    { label: t('gym'), value: '3' },
  ], [i18n.language, t]);


  if (!beforeTimetable || !afterTimetable) {
    return <div>Loading...</div>; // データ取得中の表示
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rectangle">
        {/* ... ヘッダー部分は省略 ... */}
        <div className="top-right-box">{beforeTimetable.user.name}{t('teacherSuffix', { ns: 'common' })}</div>
      </div>

      <div className="row-container">
        <div className="split-box">
          <div className="left-half">{t('beforeChange')}</div>
          <div className="right-half">{beforeTimetable.subject.name} ({beforeTimetable.user.name}{t('teacherSuffix', { ns: 'common' })}) - {beforeTimetable.room.name}</div>
        </div>
        <div className="select-box">
          <div className="left-select">{t('afterChange')}</div>
          {/* 2. 翻訳に対応した選択肢を使用 */}
          <NativeSelect size="xl" className="right-select" radius="0"
            data={subjectOptions}
            value={data.subject_id}
            onChange={(event) => setData('subject_id', event.currentTarget.value)}
          />
        </div>
      </div>

      <div className="row-container">
          <div className="split-box">
              <div className="left-half">{t('applicant')}</div>
              <div className="right-half">{afterTimetable.user.name}{t('teacherSuffix', { ns: 'common' })}</div>
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
      
      {/* ... 日付や時間の表示部分は省略 ... */}

      <div className="back-button-container">
        {/* 3. 戻るボタンを修正 */}
        <Button onClick={() => window.history.back()} variant="filled" size="xl" style={{ width: '150px' }}>
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
        /* ... */
      `}</style>
    </form>
  );
}