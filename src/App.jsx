import { Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import CourseRegistrationPage from './pages/CourseRegistrationPage';
import FreshmanGuidePage from './pages/FreshmanGuidePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="course-registration" element={<CourseRegistrationPage />} />
      <Route path="freshman-guide" element={<FreshmanGuidePage />} />
    </Routes>
  )
}

export default App
