import { Tabs } from "expo-router";
import BottomTabBar from "../../components/tabNavigation.component";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "../../components/header.component";

export default function LayoutTabs() {
  const inset = useSafeAreaInsets();

  return (
    <Tabs safeAreaInsets={inset}
      screenOptions={{ header:(props) => (<Header {...props} />) }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen name="medicos/index" options={{ title: "Medicos" }} />
      <Tabs.Screen name="examenes/index" options={{ title: "Examenes" }} />
      <Tabs.Screen name="medicos/addMedico" options={{ title: "AddMedico" }} />
    </Tabs>
  );
}
