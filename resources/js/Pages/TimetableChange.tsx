// TimetableChange.tsx
import { useState } from 'react';
import { Button } from '@mantine/core';
import { NativeSelect } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // ← 追加



function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatDate(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function TimetableChange() {

  const navigate = useNavigate(); // ← 追加
  const [clickedMessage] = useState('');
  const [currentMonday, setCurrentMonday] = useState(getStartOfWeek(new Date()));

  const changeWeek = (offset: number) => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(newMonday.getDate() + offset * 7);
    setCurrentMonday(newMonday);
  };


  const startOfWeek = currentMonday;
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 4);



  return (
    <>
      <div className="rectangle">
        <div className="date-selector">
          <button onClick={() => changeWeek(-1)}>←</button>
          <div>
            {formatDate(startOfWeek)} 〜 {formatDate(endOfWeek)}
          </div>
          <button onClick={() => changeWeek(1)}>→</button>
          <div className="top-right-box">情報教員　高専　哲郎</div>
        </div>
      </div>

      {clickedMessage && (
        <div style={{ marginBottom: 10, fontWeight: 'bold', color: 'blue' }}>
          {clickedMessage}
        </div>
      )}

      <div className="row-container">
        <div className="split-box">
          <div className="left-half">変更前</div>
          <div className="right-half">国語</div>
        </div>
        <div className="select-box">
          <div className="left-select">変更後</div>
          <NativeSelect size="xl" className="right-select" radius="0"
            data={[
              {
                group: '一般教科',
                items: [
                  { label: '国語', value: 'Japanese' },
                  { label: '英語', value: 'English' },
                  { label: '数学', value: 'math' },
                ],
              },
              {
                group: '専門教科',
                items: [
                  { label: 'プログラミング', value: 'express' },
                  { label: '論理回路', value: 'koa' },
                  { label: '実験', value: 'django' },
                ],
              },
            ]}
            style={{ width: 280 }}
          />
        </div>
      </div>


      <div className="row-container">
        <div className="split-box">
          <div className="left-half">置換者</div>
          <div className="right-half">管理人　太郎</div>
        </div>
        <div className="right-box">
          <div className="left-half">申請者</div>
          <div className="right-half">高専　哲郎</div>
        </div>
      </div>


      <div className="row-container">
        <div className="split-box">
          <div className="left-half">日付</div>
          <div className="right-half">○月○日</div>
        </div>
        <div className="select-box">
          <div className="left-select">場所</div>
          <NativeSelect size="xl" className="right-select" radius="0"
            data={[
              { label: '5-5', value: 'class-room' },
              { label: '実習室', value: 'Practice-room' },
              { label: '体育館', value: 'gym' }
            ]}
            style={{ width: 280 }}
            rightSection={null}
          />
        </div>
      </div>


      <div className="split-box" style={{ marginTop: '50px' }}>
        <div className="left-half">時間</div>
        <div className="right-half">〇時間目</div>
      </div>


      <div className="back-button-container">
        <Button variant="filled" size="xl" onClick={() => navigate(-1)} style={{ width: '150px' }}>戻る</Button>
      </div>

      <div className="send-button-container">
        <Button variant="filled" size="xl" onClick={() => navigate(-1)} style={{ width: '150px' }}>送信</Button>
      </div>


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
          height: 60px;  /* ← 高さは必要なら固定 */
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
      }

      .split-box {
        display: flex;
        width: 400px;
        height: 70px;
        border: 2px solid black;
        font-Size: 30px;
        margin-left: 300px;
      }

      .right-box {
        display: flex;
        width: 400px;
        height: 70px;
        border: 2px solid black;
        font-Size: 30px;
        bottom: 70px;
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
        border-LEFT: 2px solid black;
      }

      .back-button-container {
        position: absolute;
        left: 50px;
        bottom: 70px;
      }

      .send-button-container {
        position: absolute;
        right: 50px;
        bottom: 70px;
      }

      .select-box {
       display: flex;
       height: 70px;
      }

      .left-select {
        width: 120px;
        background-color: rgb(12, 106, 207);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-Size: 30px;
        border-top: 2px solid black;
        border-left: 2px solid black;
        border-bottom: 2px solid black;
      }

      .right-select select {
        border: 2px solid black;
        height: 70px !important;
        font-size: 28px !important;
        text-align: center; 
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 0;
         appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background: none;
      }
          
      `}</style>

    </>
  );
}
