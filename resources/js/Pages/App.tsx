// App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import TeacherHome from './TeacherHome';
import StudentHome from './StudentHome';
import AdminHome from './AdminHome';
import Timetable from './Timetable';
import TimetableChange from './TimetableChange';
import TimetableClick from './TimetableClick';
import Notification from './notification';
import Language from './language';
import Registration from './registration';
import Remove from './remove';
import ManagementScreen from './admin';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacherhome" element={<TeacherHome />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/timetableClick" element={<TimetableClick />} />
        <Route path="/timetable-change" element={<TimetableChange />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/language" element={<Language />} />
        <Route path="/studenthome" element={<StudentHome />} />
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/remove" element={<Remove />} />
        <Route path="/admin" element={<ManagementScreen />} />
      </Routes>
    </HashRouter>
  );
}
