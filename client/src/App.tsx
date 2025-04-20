import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/Login/RequireAuth";
import Layout from "./components/Layout/Layout";
import HomePage from "./components/HomePage/HomePage";
import Calendar from "./components/Calendar/Calendar";
import Notes from "./components/Notes/Notes";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import NotFound from "./components/NotFound/NotFound";
import Welcome from "./components/Welcome/Welcome";
// @ts-ignore
import Pomodoro from "./components/Pomodoro/Pomodoro";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Protected routes */}
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/notes" element={<Notes />} />
          </Route>

          {/* Protected route WITHOUT layout */}
          <Route
            path="/*"
            element={
              <RequireAuth>
                <NotFound />
              </RequireAuth>
            }
          />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
