// resources/js/Pages/TimetableSearch.tsx

import React, { useState, useMemo } from 'react';
import { Button, Select, List, ThemeIcon, Box } from '@mantine/core';
import { IconCircleDashed } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';

// --- データ型定義 (言語非依存) ---
interface TimetableItem {
  id: number;
  dayKey: string;
  period: number;
  subjectKey: string;
  teacherKey: string;
  classKey: string;
}

// --- メインコンポーネント ---
export default function TimetableSearch() {
  // 1. 名前空間を指定
  const { t, i18n } = useTranslation(['timetable_search', 'common']);
  const [selectedClassKey, setSelectedClassKey] = useState<string | null>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  // --- ダミーデータ (言語非依存のキーで管理) ---
  const timetableData: TimetableItem[] = useMemo(() => [
    { id: 1, dayKey: 'monday', period: 1, subjectKey: 'japanese', teacherKey: 'teacherSuzuki', classKey: 'class5_5' },
    { id: 2, dayKey: 'monday', period: 2, subjectKey: 'math', teacherKey: 'teacherSato', classKey: 'class5_5' },
    { id: 3, dayKey: 'tuesday', period: 1, subjectKey: 'science', teacherKey: 'teacherTanaka', classKey: 'class5_4' },
    { id: 4, dayKey: 'tuesday', period: 2, subjectKey: 'socialStudies', teacherKey: 'teacherTakahashi', classKey: 'class5_5' },
    { id: 5, dayKey: 'wednesday', period: 3, subjectKey: 'english', teacherKey: 'teacherWatanabe', classKey: 'class5_4' },
    { id: 6, dayKey: 'thursday', period: 4, subjectKey: 'physicalEducation', teacherKey: 'teacherIto', classKey: 'class5_5' },
    { id: 7, dayKey: 'friday', period: 1, subjectKey: 'music', teacherKey: 'teacherYamamoto', classKey: 'class5_4' },
  ], []);


  // --- 選択肢を動的に生成 ---
  const classOptions = useMemo(() =>
    [...new Set(timetableData.map(item => item.classKey))].map(key => ({
      value: key,
      label: t(key),
    })), [timetableData, i18n.language, t]
  );

  const dayOptions = useMemo(() =>
    [...new Set(timetableData.map(item => item.dayKey))].map(key => ({
      value: key,
      label: t(key),
    })), [timetableData, i18n.language, t]
  );


  // 2. フィルタリングロジックをキー基準に修正
  const filteredData = timetableData.filter(item => {
    const classMatch = !selectedClassKey || item.classKey === selectedClassKey;
    const dayMatch = !selectedDayKey || item.dayKey === selectedDayKey;
    return classMatch && dayMatch;
  });

  return (
    <div style={{ padding: '20px' }}>
      <Box h={100} w="100%" bg="var(--mantine-color-blue-filled)" style={{
        position: 'fixed', top: 0, left: 0, fontSize: '36px', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
      }}>
        {t('title')}
      </Box>

      <div style={{ marginTop: '120px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Select
            label={t('class')}
            placeholder={t('selectClass')}
            data={classOptions}
            value={selectedClassKey}
            onChange={setSelectedClassKey}
            clearable
          />
          <Select
            label={t('dayOfWeek')}
            placeholder={t('selectDayOfWeek')}
            data={dayOptions}
            value={selectedDayKey}
            onChange={setSelectedDayKey}
            clearable
          />
        </div>

        <List spacing="xs" size="sm" center icon={
          <ThemeIcon color="teal" size={24} radius="xl">
            <IconCircleDashed style={{ width: 16, height: 16 }} />
          </ThemeIcon>
        }>
          {filteredData.map((item) => (
            <Link
              key={item.id}
              href={'/timetable-change'} // 遷移先は適宜修正
              data={{ change_request_id: item.id }}
              style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
            >
              <List.Item style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                {/* 3. 表示時にキーを翻訳 */}
                {`${t(item.dayKey)} ${item.period}${t('period')} : ${t(item.subjectKey)} (${t(item.teacherKey)}${t('teacherSuffix', { ns: 'common' })}) - ${t(item.classKey)}`}
              </List.Item>
            </Link>
          ))}
        </List>
        {filteredData.length === 0 && <p>{t('noClassesFound')}</p>}
      </div>

      <Button
        onClick={() => window.history.back()}
        variant="filled"
        size="md"
        style={{ position: 'fixed', bottom: '20px', left: '20px' }}
      >
        {t('back', { ns: 'common' })}
      </Button>
    </div>
  );
}