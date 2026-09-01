import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as SecureStore from 'expo-secure-store';

import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY =
  'retrieveid_auth_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [isAuthReady, setIsAuthReady] =
    useState(false);

  const saveSession = async (
    authToken,
    userData
  ) => {
    const session = {
      token: authToken,
      user: userData,
    };

    await SecureStore.setItemAsync(
      AUTH_STORAGE_KEY,
      JSON.stringify(session)
    );
  };

  const clearSession = async () => {
    await SecureStore.deleteItemAsync(
      AUTH_STORAGE_KEY
    );
  };

  /*
    Restore the saved token when the app starts.

    We also ask the backend for /api/auth/me so that
    an old, invalid, or expired token does not keep the
    user logged in.
  */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedSession =
          await SecureStore.getItemAsync(
            AUTH_STORAGE_KEY
          );

        if (!storedSession) {
          return;
        }

        const parsedSession =
          JSON.parse(storedSession);

        const storedToken =
          parsedSession?.token;

        if (!storedToken) {
          await clearSession();
          return;
        }

        const data = await apiRequest(
          '/api/auth/me',
          {
            method: 'GET',
            headers: {
              Authorization:
                `Bearer ${storedToken}`,
            },
          }
        );

        setToken(storedToken);
        setUser(data.user);
        setIsAuthenticated(true);

        await saveSession(
          storedToken,
          data.user
        );
      } catch (error) {
        console.log(
          'Stored authentication session is no longer valid.'
        );

        setToken(null);
        setUser(null);
        setIsAuthenticated(false);

        try {
          await clearSession();
        } catch (storageError) {
          console.error(
            'Unable to clear authentication session:',
            storageError
          );
        }
      } finally {
        setIsAuthReady(true);
      }
    };

    restoreSession();
  }, []);

  /*
    Register the account in PostgreSQL.

    Our current registration API creates the user but
    does not return a JWT, so we immediately log in
    afterward to obtain the token.
  */
  const register = async ({
    fullName,
    studentId,
    email,
    phone,
    password,
  }) => {
    const normalizedEmail =
      email.trim().toLowerCase();

    await apiRequest(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({
          fullName: fullName.trim(),
          studentId: studentId.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          password,
        }),
      }
    );

    const loginData = await apiRequest(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      }
    );

    setToken(loginData.token);
    setUser(loginData.user);
    setIsAuthenticated(true);

    await saveSession(
      loginData.token,
      loginData.user
    );

    return loginData.user;
  };

  /*
    Login using the real Express/PostgreSQL backend.
  */
  const login = async ({
    email,
    password,
  }) => {
    const data = await apiRequest(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({
          email: email
            .trim()
            .toLowerCase(),
          password,
        }),
      }
    );

    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);

    await saveSession(
      data.token,
      data.user
    );

    return data.user;
  };

  /*
    Temporary profile update.

    We will connect this to PostgreSQL with a profile
    update API shortly.
  */
  const updateProfile = async ({
  fullName,
  email,
  phone,
}) => {
  if (!token) {
    throw new Error(
      'You are not authenticated.'
    );
  }

  const data = await apiRequest(
    '/api/auth/me',
    {
      method: 'PATCH',

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email
          .trim()
          .toLowerCase(),
        phone: phone.trim(),
      }),
    }
  );

  setUser(data.user);

  await saveSession(
    token,
    data.user
  );

  return data.user;
};

  const logout = async () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    try {
      await clearSession();
    } catch (error) {
      console.error(
        'Unable to clear authentication session:',
        error
      );
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isAuthReady,
      register,
      login,
      updateProfile,
      logout,
    }),
    [
      user,
      token,
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