//ユーザ登録画面　パワポp9

import React, { useState } from 'react';
import {Box,Button, Container, FileInput} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function Remove() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (csvFile) {
      const formData = new FormData();
      formData.append('csvFile', csvFile);

      try {
        await axios.post('/remove', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert(t('Remove.success'));
        navigate(-1);
      } catch (error) {
        console.error("Error uploading CSV file:", error);
        alert(t('Remove.error'));
      }
    } else {
      alert(t('Remove.noFileSelected'));
    }
  };
 
  return (
    <>
      <Container className="remove-container">
        <Box className="remove-header">
          {t('Remove.title')}
        </Box>

        <Box style={{ marginTop: '20px', paddingLeft: '20px', fontSize: '20px' }}>
          {t('Remove.selectCsvFile')}
        </Box>
        <FileInput
          style={{ paddingLeft: '70px' }}
          w={300}
          size="lg"
          placeholder={t('Remove.csvFilePlaceholder')}
          value={csvFile}
          onChange={setCsvFile}
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
        onClick={handleSubmit}
      >
        {t('Remove.send')}
      </Button>

      <style>{`
        /* Default (PC) styles to match original */
        .remove-container {
          position: fixed;
          padding: 0;
          margin: 0;
        }
        .remove-header {
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
          .remove-container {
            position: static; /* Override fixed positioning */
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
          }
          .remove-header {
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
