import './App.css';
import SignUp from "./components/SignUp";
import Registration from "./components/Registration";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Users from "./components/Users";


function App() {
  return (
      <>
          <Routes>
              <Route path="/" element={<SignUp />} />
              <Route path="/registration" element={<Registration/>} />
              <Route path="/users" element={<Users />} />
          </Routes>
      </>

  );
}

export default App;
