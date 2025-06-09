// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import TeacherHome from './TeacherHome';
import StudentHome from './StudentHome';
import AdminHome from './AdminHome';
import Timetable from './Timetable';
import TimetableChange from './TimetableChange';
import Notification from './notification';
import Language from './language';
import Registration from './registration';
import Remove from './remove';
import ManagementScreen from './admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/TeacherHome" element={<TeacherHome />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/timetable-change" element={<TimetableChange />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/language" element={<Language />} />
        <Route path="/StudentHome" element={<StudentHome />} />
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/remove" element={<Remove />} />
        <Route path="/admin" element={<ManagementScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
