//変更申請　パワポp3

import React, { useState } from 'react';
import { Button, TextInput, Select, Grid, Container, Group,Box } from '@mantine/core';

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
    // データ送信処理
    console.log('送信データ:', formData);
  };

  return (
    <Container size="lg" py="xl" style={{ paddingTop: 25 }}>
      {/* タイトル */}
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
            変更申請
          </Box>
      <Group justify="space-between" mb="md">
        <Select
          placeholder="〇月〇日～〇月〇日"
          data={['4月1日～4月15日', '4月16日～4月30日']}
          value={formData.dateRange}
          onChange={handleSelect('dateRange')}
          size="lg" 
        />
        <Select
          placeholder="〇年〇組"
          data={['1年1組', '1年2組', '2年1組']}
          value={formData.yearClass}
          onChange={handleSelect('yearClass')}
          size="lg" 
        />
      </Group>
      <div style={{ marginTop: '50px' }} />
      <Grid>
        <Grid.Col span={6}>
          <TextInput label="変更前" value={formData.beforeChange} onChange={handleChange('beforeChange')} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="変更後" value={formData.afterChange} onChange={handleChange('afterChange')} />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput label="置換者" value={formData.replacer} onChange={handleChange('replacer')} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="申請者" value={formData.applicant} onChange={handleChange('applicant')} />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput label="日付" value={formData.date} onChange={handleChange('date')} />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="場所"
            placeholder="選択"
            data={["教室A", "教室B", "教室C"]}
            value={formData.place}
            onChange={handleSelect('place')}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput label="時間" placeholder="時間目" value={formData.time} onChange={handleChange('time')} />
        </Grid.Col>
      </Grid>

      <Group
        style={{
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: '20px',
          left: 0,
          right: 0,
          padding: '0 20px',
        }}
      >
        <Button
          variant="filled"
          radius="xs"
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            width: '150px',
            height: '50px',
          }}
        >
          戻る
        </Button>
        <Button
          onClick={handleSubmit}
          variant="filled"
          radius="xs"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '150px',
            height: '50px',
          }}
        >
          送信
        </Button>
      </Group>
    </Container>
  );
}
