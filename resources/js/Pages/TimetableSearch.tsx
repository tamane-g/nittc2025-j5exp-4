
import { useState } from 'react';
import { Button, Select, List, ThemeIcon, Box } from '@mantine/core';
import { IconCircleDashed } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';

// 詳細な時間割のダミーデータ
export default function TimetableSearch() {
  const { t } = useTranslation();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // 詳細な時間割のダミーデータ
  const timetableData = [
    { id: 1, day: t('TimetableSearch.monday'), period: 1, subject: t('TimetableSearch.japanese'), teacher: t('TimetableSearch.teacherSuzuki'), class: t('TimetableSearch.class5_5') },
    { id: 2, day: t('TimetableSearch.monday'), period: 2, subject: t('TimetableSearch.math'), teacher: t('TimetableSearch.teacherSato'), class: t('TimetableSearch.class5_5') },
    { id: 3, day: t('TimetableSearch.tuesday'), period: 1, subject: t('TimetableSearch.science'), teacher: t('TimetableSearch.teacherTanaka'), class: t('TimetableSearch.class5_4') },
    { id: 4, day: t('TimetableSearch.tuesday'), period: 2, subject: t('TimetableSearch.socialStudies'), teacher: t('TimetableSearch.teacherTakahashi'), class: t('TimetableSearch.class5_5') },
    { id: 5, day: t('TimetableSearch.wednesday'), period: 3, subject: t('TimetableSearch.english'), teacher: t('TimetableSearch.teacherWatanabe'), class: t('TimetableSearch.class5_4') },
    { id: 6, day: t('TimetableSearch.thursday'), period: 4, subject: t('TimetableSearch.physicalEducation'), teacher: t('TimetableSearch.teacherIto'), class: t('TimetableSearch.class5_5') },
    { id: 7, day: t('TimetableSearch.friday'), period: 1, subject: t('TimetableSearch.music'), teacher: t('TimetableSearch.teacherYamamoto'), class: t('TimetableSearch.class5_4') },
  ];

  // 利用可能なクラスと曜日のリスト
  const classes = [t('TimetableSearch.class5_5'), t('TimetableSearch.class5_4')];
  const days = [t('TimetableSearch.monday'), t('TimetableSearch.tuesday'), t('TimetableSearch.wednesday'), t('TimetableSearch.thursday'), t('TimetableSearch.friday')];

  // フィルタリングロジック
  const filteredData = timetableData.filter((item) => {
    const classMatch = !selectedClass || item.class === selectedClass;
    const dayMatch = !selectedDay || item.day === selectedDay;
    return classMatch && dayMatch;
  });

  return (
    <div style={{ padding: '20px' }}>
      <Box
        h={100}
        w="100%"
        bg="var(--mantine-color-blue-filled)"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          fontSize: '36px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {t('TimetableSearch.title')}
      </Box>

      <div style={{ marginTop: '120px' }}>
        {/* フィルターUI */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Select
            label={t('TimetableSearch.class')}
            placeholder={t('TimetableSearch.selectClass')}
            data={classes}
            value={selectedClass}
            onChange={setSelectedClass}
            clearable
          />
          <Select
            label={t('TimetableSearch.dayOfWeek')}
            placeholder={t('TimetableSearch.selectDayOfWeek')}
            data={days}
            value={selectedDay}
            onChange={setSelectedDay}
            clearable
          />
        </div>

        {/* 絞り込み結果のリスト表示 */}
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconCircleDashed style={{ width: 16, height: 16 }} />
            </ThemeIcon>
          }
        >
          {filteredData.map((item) => (
            <Link
              key={item.id}
              href={'/timetable-change'} // Linkコンポーネントで遷移
              style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #eee', wordWrap: 'break-word', display: 'block', color: 'inherit', textDecoration: 'none' }}
            >
              <List.Item>
                {`${item.day}${t('TimetableSearch.period')} ${item.period}限 : ${item.subject} (${item.teacher}先生) - ${item.class}`}
              </List.Item>
            </Link>
          ))}
        </List>
        {filteredData.length === 0 && <p>{t('TimetableSearch.noClassesFound')}</p>}
      </div>

      <Button
        component={Link}
        href={'/'} // ホームに戻る
        variant="filled"
        size="md"
        style={{ position: 'fixed', bottom: '20px', left: '20px' }}
      >
        {t('back')}
      </Button>
    </div>
  );
}
