import { Tabs } from "expo-router";
import BottomTabBar from "../../components/tabNavigation.component";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "../../components/header.component";
import { useMedicosStore } from "../../stores";

import { Layout, Text, Spinner } from "@ui-kitten/components";
import React from "react";
import { getEspecialidades, getMedicos } from "../../axios";
import { useAuth } from "../context/AuthContext";

export default function LayoutTabs() {
  const inset = useSafeAreaInsets();
  const { loading, setMedicos, setEspecialidades, setLoading, medicos } = useMedicosStore();
  const { authState } = useAuth();

  React.useEffect(() => {
    const fetchMedicos = async () => {
      let medicosResponse = await getMedicos(authState.token);
      if (medicosResponse) {
        setMedicos(medicosResponse.medicos);
      }
    }

    const fetchEspecialidades = async () => {
      let especialidadesResponse = await getEspecialidades();
      if (especialidadesResponse) {
        setEspecialidades(especialidadesResponse);
      }
    }

    fetchMedicos();
    fetchEspecialidades();
    setLoading(false);

  }, []);

  if (loading) {
    return (
      <Layout
        style={{
          flex: 1,
          position: "relative",
          paddingBottom: inset.bottom,
          paddingTop: inset.top,
          paddingHorizontal: 20,
        }}
        level="2"
      >
        <Spinner />
        <Text>Cargando...</Text>
      </Layout>
    );
  }

  return (
    <Tabs
      safeAreaInsets={inset}
      screenOptions={{ header: (props) => <Header {...props} /> }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen name="medicos/index" options={{ title: "Medicos" }} />
      <Tabs.Screen name="examenes/index" options={{ title: "Examenes" }} />
      <Tabs.Screen name="medicos/addMedico" options={{ title: "AddMedico" }} />
      <Tabs.Screen name="examenes/addExamen" options={{ title: "AddExamen" }} />
    </Tabs>
  );
}
