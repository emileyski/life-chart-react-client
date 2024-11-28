import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
// import Dashboard from './';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <div>Dashboard</div>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
};
