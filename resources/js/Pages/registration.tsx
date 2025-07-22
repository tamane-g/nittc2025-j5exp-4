//ユーザ登録画面　パワポp9

import React from 'react';
import {Box,Button, Container, FileInput} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Registration() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Container className="reg-container">
        <Box className="reg-header">
          {t('Registration.title')}
        </Box>

        <Box style={{ marginTop: '20px', paddingLeft: '20px', fontSize: '20px' }}>
          {t('Registration.selectCsvFile')}
        </Box>
        <FileInput
          style={{ paddingLeft: '70px' }}
          w={300}
          size="lg"
          placeholder={t('Registration.csvFilePlaceholder')}
          styles={{
            input: {
              border: '3px solid black',
              textAlign: 'center',
              marginTop: '20px',
              padding: '10px',
              fontSize: '16px',
            },
          }}
        />
      </Container>

      <Button
        variant="filled"
        radius="xs"
        onClick={() => navigate(-1)}
        className="back-button"
      >
        {t('back')}
      </Button>
      <Button
        variant="filled"
        radius="xs"
        className="submit-button"
      >
        {t('Registration.send')}
      </Button>

      <style>{`
        /* Default (PC) styles to match original */
        .reg-container {
          position: fixed;
          padding: 0;
          margin: 0;
        }
        .reg-header {
          background-color: var(--mantine-color-blue-filled);
          height: 100px;
          width: 500px;
          top: 0;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
        }
        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 100px;
          height: 50px;
        }
        .submit-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 150px;
          height: 50px;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .reg-container {
            position: static; /* Override fixed positioning */
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
          }
          .reg-header {
            position: static;
            width: 100%;
            max-width: 500px;
            height: auto;
            font-size: 36px;
            padding: 15px 20px;
          }
          .back-button, .submit-button {
            position: static; /* Override fixed positioning */
            width: 100%;
            margin-top: 10px;
          }
          /* We need a wrapper for buttons in mobile view */
          body > .back-button + .submit-button {
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  );
}
