// resources/js/Pages/Remove.tsx

import React from 'react';
import { useForm } from '@inertiajs/react';
import { Box, Button, Container, FileInput, Group, Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconCircleCheck } from '@tabler/icons-react';

export default function Remove() {
  // 1. 'user'と'common'の名前空間を指定
  const { t } = useTranslation(['user', 'common']);

  // 2. useFormでファイルと状態を管理
  const { data, setData, post, processing, errors, recentlySuccessful } = useForm<{ csvFile: File | null }>({
    csvFile: null,
  });

  // 3. Inertiaのpostメソッドでフォームを送信
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.csvFile) {
      post('/remove', { // POST先URLは適宜変更してください
        forceFormData: true, // ファイルを送信するために必要
      });
    } else {
      alert('ファイルが選択されていません');
    }
  };

  return (
    <Container className="reg-container">
      <Box className="reg-header">
        {/* 4. キーを修正 */}
        {t('remove.title', { ns: 'user' })}
      </Box>

      {/* フォーム全体をformタグで囲む */}
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Box style={{ marginTop: '20px', paddingLeft: '20px', fontSize: '20px' }}>
          {t('remove.selectCsvFile', { ns: 'user' })}
        </Box>

        {/* 送信成功時のメッセージ */}
        {recentlySuccessful && (
          <Alert icon={<IconCircleCheck size={16} />} title="Success" color="teal" my="md">
            ファイルのアップロードに成功しました。
          </Alert>
        )}

        <FileInput
          style={{ padding: '0 70px', marginTop: '20px' }}
          w="100%"
          maxW={440} // 最大幅を設定
          size="lg"
          placeholder={t('remove.csvFilePlaceholder', { ns: 'user' })}
          value={data.csvFile}
          onChange={(file) => setData('csvFile', file)}
          error={errors.csvFile} // バリデーションエラーを表示
          accept=".csv"
          styles={{
            input: {
              border: '3px solid black',
              textAlign: 'center',
              fontSize: 16,
            },
          }}
        />

        {/* ボタンのグループ */}
        <Group className="buttons-wrapper">
          <Button
            onClick={() => window.history.back()}
            variant="filled"
            radius="xs"
            className="back-button"
            type="button" // formの送信をトリガーしないように
          >
            {t('back', { ns: 'common' })}
          </Button>
          <Button
            type="submit" // formの送信ボタンとして設定
            variant="filled"
            radius="xs"
            className="submit-button"
            loading={processing} // 送信中はローディング表示
          >
            {t('send', { ns: 'common' })}
          </Button>
        </Group>
      </form>

      {/* --- CSSスタイル --- */}
      <style>{`
        .reg-container {
          position: fixed;
          padding: 0;
          margin: 0;
          display: flex; /* Flexboxを有効化 */
          flex-direction: column; /* 縦方向に配置 */
          align-items: center; /* 中央揃え */
          width: 100%;
        }
        .reg-header {
          background-color: var(--mantine-color-blue-filled);
          height: 100px;
          width: 100%;
          max-width: 500px;
          top: 0;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
        }
        .buttons-wrapper {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
        }
        .back-button {
          width: 100px;
          height: 50px;
        }
        .submit-button {
          width: 150px;
          height: 50px;
        }
        /* ... Mobile styles ... */
        @media (max-width: 768px) {
            .reg-container { position: static; padding: 20px; box-sizing: border-box; }
            .reg-header { position: static; font-size: 36px; height: auto; padding: 15px 20px; }
            .buttons-wrapper { position: static; flex-direction: column-reverse; gap: 15px; margin-top: 30px; }
            .back-button, .submit-button { width: 100%; }
        }
      `}</style>
    </Container>
  );
}