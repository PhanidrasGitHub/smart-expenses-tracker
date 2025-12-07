import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Expenses  from "./pages/Expendces.jsx";
import EditExpense  from "./pages/EditExpense.jsx";
import NotFoundPage from './pages/NotFoundPage.jsx'
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses/>} />
        <Route path="/expenses/edit/:id" element={<EditExpense />} />
        <Route path ='*' element={<NotFoundPage/>}/>
      </Routes>
    </>
  );
}

export default App;
