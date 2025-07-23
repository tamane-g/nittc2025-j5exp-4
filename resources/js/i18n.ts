import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // デバッグモードを有効にする（開発中に便利です）
    debug: true,

    // デフォルトの言語
    fallbackLng: 'ja',

    interpolation: {
      escapeValue: false, // ReactがXSS対策をすでに行っているため
    },
    
    // ▼▼▼ ここを更新しました ▼▼▼

    // public/locales/ 以下のファイル名（名前空間）をすべて列挙します
    ns: [
      'common',
      'login',
      'home',
      'timetable',
      'timetable_change',
      'notification',
      'user',
      'admin'
    ], 
    
    // デフォルトで使われる名前空間
    defaultNS: 'common',

    // 翻訳ファイルをどこから読み込むかの設定
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // ReactのSuspenseを使わない場合はfalseを設定
    react: {
      useSuspense: false,
    },
  });

export default i18n;