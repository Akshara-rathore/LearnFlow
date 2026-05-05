import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("guestMode", "false");
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const loginAsGuest = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("quizResult");
    localStorage.removeItem("roadmap");
    localStorage.removeItem("resources");
    localStorage.removeItem("notes");
    localStorage.removeItem("leetcode");
    localStorage.setItem("guestMode", "true");
    setUser({ name: "Guest User", isGuest: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginAsGuest, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
