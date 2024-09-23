import './App.css';
import Login from "./components/Login";
import Registration from "./components/Registration";
import { Route, Routes } from 'react-router-dom';
import Users from "./components/Users";


function App() {
  return (
      <>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/registration" element={<Registration/>} />
              <Route path="/users" element={<Users />} />
          </Routes>
      </>

  );
}

export default App;
