import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateGroup from "./pages/CreateGroup";
import AddExpense from "./pages/AddExpense";
import AllExpenses from "./pages/AllExpenses";

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Routes>
      <Route
        path="/login"
        element={!isLoggedIn ? <Login /> : <Navigate to="/" replace/>}
      />

      <Route
        path="/"
        element={isLoggedIn ? <Home /> : <Navigate to="/login" replace/>}
      />

      <Route
        path="/create-group"
        element={isLoggedIn ? <CreateGroup /> : <Navigate to="/login" />}
      />

      <Route
        path="/add-expense/:id"
        element={isLoggedIn ? <AddExpense /> : <Navigate to="/login" />}
      />

      <Route
        path="/edit-expense/:id/:expenseId"
        element={isLoggedIn ? <AddExpense /> : <Navigate to="/login" />}
      />

      <Route
        path="/all-expenses/:id"
        element={isLoggedIn ? <AllExpenses /> : <Navigate to="/login" />}
      />

      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/" : "/login"} />}
      />
    </Routes>
  );
}

export default App;