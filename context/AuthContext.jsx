import {
  createContext,
  useContext,
  useState,
} from 'react';

const AuthContext = createContext(null);

const defaultUser = {
  fullName: 'Sonny Gyamerah',
  studentId: '11124499',
  email: 'sonnygyamerah69@gmail.com',
  phone: '0234567891',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const register = ({
    fullName,
    studentId,
    email,
    phone,
  }) => {
    const newUser = {
      fullName: fullName.trim(),
      studentId: studentId.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    };

    setUser(newUser);
    setIsAuthenticated(true);

    return newUser;
  };

  const login = () => {
    /*
      This is temporary frontend login behaviour.

      The backend will later verify the email and password.
    */

    setIsAuthenticated(true);
  };

  const updateProfile = (updatedDetails) => {
    setUser((currentUser) => ({
      ...currentUser,
      ...updatedDetails,
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        register,
        login,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}