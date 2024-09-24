import React from "react";

import * as SecureStore from "expo-secure-store";

import type { AuthProps, User, LoginProps, AuthStateProps } from "../../types";

import { registerRequest, loginRequest, axiosInstance } from "../../axios";

import * as FileSystem from "expo-file-system";

const AuthContext = React.createContext<AuthProps>({});

const TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = React.useState<AuthStateProps>({
    token: null,
    isAuthenticated: false,
    user: null,
  });

  React.useEffect(() => {
    const fetchToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userData = await SecureStore.getItemAsync(USER_DATA_KEY);
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Token ${token}`;
        setAuthState({
          token: token,
          isAuthenticated: true,
          user: JSON.parse(userData),
        });
      }
    };

    fetchToken();
  }, []);

  const register = async (data: User) => {
    try {
      const newData = {
        username: data.username,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        ci: data.ci,
      }

      const user: User = await registerRequest(newData);
      
      const loginResult = await login(data.username, data.password);

      if(!loginResult.error) {
        if (data.avatar) {
          const result = await FileSystem.uploadAsync(
            `https://backend-medics.vercel.app/api/profile/${user.id}/`,
            data.avatar,
            {
              fieldName: "avatar",
              httpMethod: "PATCH",
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Token ${authState.token}`,
              }
              
            }
          );

          await login(data.username, data.password);
        }
      }

      return user;
    } catch (error) {
      return { error: true, message: error.response.data };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await loginRequest(username, password);
      let data: LoginProps = result.data;

      if (data.user.avatar) {
        let avatar = await FileSystem.downloadAsync(data.user.avatar, FileSystem.cacheDirectory + "avatar.jpg");

        data.user.avatar = avatar.uri;
      }

      setAuthState({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
      });

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Token ${data.token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, data.token);

      return data;
    } catch (error: any) {
      return { error: true, message: error.response.data.error };
    }
  };

  const logout = async () => {
    setAuthState({ token: null, isAuthenticated: false, user: null });
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axiosInstance.defaults.headers.common["Authorization"] = "";

    return;
  };

  const value: AuthProps = {
    authState: authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
