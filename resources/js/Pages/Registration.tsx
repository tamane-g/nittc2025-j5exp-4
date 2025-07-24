// resources/js/Pages/Registration.tsx

import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Box, Button, Container, FileInput, Group, Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconCircleCheck } from '@tabler/icons-react';

export default function Registration() {
  const { t } = useTranslation(['user', 'common']);
  const { flash, errors: inertiaErrors } = usePage().props;
  console.log(flash);
  console.log(inertiaErrors);

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm<{ csvFile: File | null }>({
    csvFile: null,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.csvFile) {
      post(route('admin.regist.import'), {
        forceFormData: true,
      });
    } else {
      alert('ファイルが選択されていません');
    }
  };

  return (
    <Container className="reg-container">
      <Box className="reg-header">
        {t('registration.title', { ns: 'user' })}
      </Box>

      <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '120px' }}>
        <Box style={{ marginTop: '20px', paddingLeft: '20px', fontSize: '20px' }}>
          {t('registration.selectCsvFile', { ns: 'user' })}
        </Box>

        {recentlySuccessful && (
          <Alert icon={<IconCircleCheck size={16} />} title="Success" color="teal" my="md">
            ファイルのアップロードに成功しました。
          </Alert>
        )}

        <FileInput
          style={{ padding: '0 70px', marginTop: '20px' }}
          w="60%"
          size="lg"
          placeholder={t('registration.csvFilePlaceholder', { ns: 'user' })}
          value={data.csvFile}
          onChange={(file) => setData('csvFile', file)}
          error={errors.csvFile}
          accept=".csv"
          styles={{
            input: {
              border: '3px solid black',
              textAlign: 'center',
              fontSize: 16,
            },
          }}
        />

        <Group className="buttons-wrapper">
          <Button
            onClick={() => window.history.back()}
            variant="filled"
            radius="xs"
            className="back-button"
            type="button"
          >
            {t('back', { ns: 'common' })}
          </Button>
          <Button
            type="submit"
            variant="filled"
            radius="xs"
            className="submit-button"
            loading={processing}
          >
            {t('send', { ns: 'common' })}
          </Button>
        </Group>

      </form>

      <style>{`
        .reg-container {
          position: relative;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .reg-header {
          background-color: var(--mantine-color-blue-filled);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          height: 100px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
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

        @media (max-width: 768px) {
          .reg-container {
            position: static;
            padding: 20px;
            box-sizing: border-box;
          }

          .reg-header {
            position: static;
            font-size: 36px;
            height: auto;
            padding: 15px 20px;
          }

          form {
            margin-top: 0;
          }

          .buttons-wrapper {
            position: static;
            flex-direction: column-reverse;
            gap: 15px;
            margin-top: 30px;
          }

          .back-button,
          .submit-button {
            width: 100%;
          }
        }
      `}</style>
    </Container>
  );
}
