// resources/js/Pages/Application.tsx (ファイル名もApplication.tsxに変更をおすすめします)

import React, { useState } from 'react';
import { Button, TextInput, Select, Grid, Container, Group, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react'; // InertiaのLinkをインポート

// フォームデータの型定義
interface FormData {
  beforeChange: string;
  afterChange: string;
  replacer: string;
  applicant: string;
  date: string;
  time: string;
  place: string;
  yearClass: string;
  dateRange: string;
}

export default function ScheduleChangeForm() {
  // 1. 'timetable_change'と'common'の名前空間を指定
  const { t } = useTranslation(['timetable_change', 'common']);

  const [formData, setFormData] = useState<FormData>({
    beforeChange: '',
    afterChange: '',
    replacer: '',
    applicant: '',
    date: '',
    time: '',
    place: '',
    yearClass: '',
    dateRange: '',
  });

  const handleChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSelect = (field: keyof FormData) => (value: string | null) => {
    setFormData({ ...formData, [field]: value ?? '' });
  };

  const handleSubmit = () => {
    console.log('送信データ:', formData);
    // ここでInertiaを使ってデータをPOSTする
    // e.g., post('/application/store', formData);
  };

  return (
    <Container size="lg" py="xl" style={{ paddingTop: '120px' }}>
      <Box
        h={100}
        bg="var(--mantine-color-blue-filled)"
        style={{
          color: 'white',
          fontSize: '50px',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        {/* 2. home.jsonのキーを使用 (TeacherHomeのキーを借りています) */}
        {t('changeRequest', { ns: 'home' })}
      </Box>

      {/* フォーム部分 */}
      <Grid>
        <Grid.Col span={12} md={6}>
          {/* 3. ラベルとプレースホルダーをt関数で置き換え */}
          <TextInput label={t('beforeChange')} value={formData.beforeChange} onChange={handleChange('beforeChange')} />
        </Grid.Col>
        <Grid.Col span={12} md={6}>
          <TextInput label={t('afterChange')} value={formData.afterChange} onChange={handleChange('afterChange')} />
        </Grid.Col>

        <Grid.Col span={12} md={6}>
          <TextInput label={t('replacer')} value={formData.replacer} onChange={handleChange('replacer')} />
        </Grid.Col>
        <Grid.Col span={12} md={6}>
          <TextInput label={t('applicant')} value={formData.applicant} onChange={handleChange('applicant')} />
        </Grid.Col>

        <Grid.Col span={12} md={6}>
          <TextInput label={t('date')} placeholder={t('datePlaceholder')} value={formData.date} onChange={handleChange('date')} />
        </Grid.Col>
        <Grid.Col span={12} md={6}>
          <Select
            label={t('location')}
            placeholder={t('location', 'Select location')}
            data={[t('practiceRoom'), t('gym')]} // データも翻訳キーで
            value={formData.place}
            onChange={handleSelect('place')}
          />
        </Grid.Col>

        <Grid.Col span={12} md={6}>
          <TextInput label={t('time')} placeholder={t('timePlaceholder')} value={formData.time} onChange={handleChange('time')} />
        </Grid.Col>
      </Grid>

      <Group
        style={{
          justifyContent: 'space-between',
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          padding: '0 20px',
        }}
      >
        {/* 4. 戻るボタンをInertiaのLinkに変更 */}
        <Link href="/teacher/home">
            <Button
              variant="filled"
              radius="xs"
              style={{ width: '150px', height: '50px' }}
            >
              {t('back', { ns: 'common' })}
            </Button>
        </Link>

        <Button
          onClick={handleSubmit}
          variant="filled"
          radius="xs"
          style={{ width: '150px', height: '50px' }}
        >
          {t('send', { ns: 'common' })}
        </Button>
      </Group>
    </Container>
  );
}