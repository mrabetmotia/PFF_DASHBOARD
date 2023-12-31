import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (email: string, password: string) => void;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, settoken] = useState<string | null>(null);

  // Check authentication state after page refresh to get the token inside the useAuthContext
  const checkAuthState = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      settoken(storedToken);
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:9000/login-user", {
        email,
        password,
      });
      const { token } = response.data;
      settoken(token);
      setIsLoggedIn(true);
      localStorage.setItem("token", token);
      handleRefresh();
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure, show error message, etc.
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const logout = () => {
    settoken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
