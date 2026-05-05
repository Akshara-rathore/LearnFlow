import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import ResultPage from "./pages/ResultPage";
import LevelSelection from "./pages/LevelSelection";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Roadmap from "./pages/Roadmap";

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #07041c 0%, #0d0630 50%, #08031a 100%)",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
      }}
    >
      Loading...
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/sign-in" replace />;
  
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/quiz/:language" 
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/result" 
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/roadmap" 
        element={
          <ProtectedRoute>
            <Roadmap />
          </ProtectedRoute>
        } 
      />
      <Route path="/level-selection" element={<LevelSelection />} />
    </Routes>
  );
}