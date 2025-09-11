import { createContext, useContext, useEffect, useState } from "react";

const AuthContext  = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext )
}

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [ userToken, setUserToken ] = useState(null)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setUserToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = ({ token, user }) => {
    setUserToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUserToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return(
    <AuthContext.Provider value = {{ userToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
