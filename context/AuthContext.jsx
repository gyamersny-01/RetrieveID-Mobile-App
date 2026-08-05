import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = '@retrieveid_auth_session';

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

  const [isAuthReady, setIsAuthReady] =
    useState(false);

  /*
    Restore the previously saved user and login status
    when the application starts.
  */
  useEffect(() => {
    const loadStoredAuthSession = async () => {
      try {
        const storedSession =
          await AsyncStorage.getItem(
            AUTH_STORAGE_KEY
          );

        if (storedSession !== null) {
          const parsedSession =
            JSON.parse(storedSession);

          if (
            parsedSession?.user &&
            typeof parsedSession.user === 'object'
          ) {
            setUser(parsedSession.user);
          }

          setIsAuthenticated(
            parsedSession?.isAuthenticated === true
          );
        }
      } catch (error) {
        console.error(
          'Unable to load authentication session:',
          error
        );
      } finally {
        setIsAuthReady(true);
      }
    };

    loadStoredAuthSession();
  }, []);

  /*
    Save changes to the user profile and login status.
    The readiness check prevents the initial values from
    replacing saved data before loading finishes.
  */
  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    const saveAuthSession = async () => {
      try {
        const session = {
          user,
          isAuthenticated,
        };

        await AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(session)
        );
      } catch (error) {
        console.error(
          'Unable to save authentication session:',
          error
        );
      }
    };

    saveAuthSession();
  }, [user, isAuthenticated, isAuthReady]);

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
      phone: phone?.trim() || '',
    };

    setUser(newUser);
    setIsAuthenticated(true);

    return newUser;
  };

  const login = () => {
    /*
      Temporary frontend login behaviour.

      The backend will later verify the user's
      email and password before allowing access.
    */

    setIsAuthenticated(true);
  };

  const updateProfile = (updatedDetails) => {
    setUser((currentUser) => ({
      ...currentUser,
      ...updatedDetails,
      fullName:
        updatedDetails.fullName !== undefined
          ? updatedDetails.fullName.trim()
          : currentUser.fullName,
      studentId:
        updatedDetails.studentId !== undefined
          ? updatedDetails.studentId.trim()
          : currentUser.studentId,
      email:
        updatedDetails.email !== undefined
          ? updatedDetails.email
              .trim()
              .toLowerCase()
          : currentUser.email,
      phone:
        updatedDetails.phone !== undefined
          ? updatedDetails.phone.trim()
          : currentUser.phone,
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAuthReady,
      register,
      login,
      updateProfile,
      logout,
    }),
    [
      user,
      isAuthenticated,
      isAuthReady,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
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