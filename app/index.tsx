import { Redirect } from "expo-router";

import { useAuth } from "./context/AuthContext";

export default function Index() {
  const { authState } = useAuth();
  if (authState.isAuthenticated) {
    return <Redirect href="/(tabs)/medicos" />;
  }

  return <Redirect href="/auth/login" />;
}