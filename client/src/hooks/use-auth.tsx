import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

interface AuthContextType {
  user: any;
  hospital: any;
  supplier: any;
  isAuthenticated: boolean;
  login: (type: 'hospital' | 'supplier', userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('user');
    const storedHospital = localStorage.getItem('hospital');
    const storedSupplier = localStorage.getItem('supplier');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedHospital) {
      setHospital(JSON.parse(storedHospital));
    }
    if (storedSupplier) {
      setSupplier(JSON.parse(storedSupplier));
    }
  }, []);

  const login = (type: 'hospital' | 'supplier', userData: any) => {
    setUser(userData.user);
    
    if (type === 'hospital') {
      setHospital(userData.hospital);
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('hospital', JSON.stringify(userData.hospital));
      setLocation('/hospital/dashboard');
    } else {
      setSupplier(userData.supplier);
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('supplier', JSON.stringify(userData.supplier));
      setLocation('/supplier/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    setHospital(null);
    setSupplier(null);
    localStorage.removeItem('user');
    localStorage.removeItem('hospital');
    localStorage.removeItem('supplier');
    setLocation('/');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      hospital,
      supplier,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}