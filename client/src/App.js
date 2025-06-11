import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { Button } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SavingsGoals from './pages/SavingsGoals';
import Analytics from './pages/AnalyticsPage';
import Transaction from "./pages/Transaction";
import AnalyticsPage from "./pages/AnalyticsPage";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/savings-goals" 
            element={<ProtectedRoute><SavingsGoals /></ProtectedRoute>} 
          />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/add-transaction" element={<Transaction />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export function ProtectedRoute(props) {
  if (localStorage.getItem('ExpenseTracker')) {
    return props.children;
  } else {
    return <Navigate to='/login' />;
  }
}

export default App;
