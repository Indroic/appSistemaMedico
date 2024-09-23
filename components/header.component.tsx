import { StyleSheet } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserProfile from "./userprofile.component";

export default function Header(props : BottomTabHeaderProps) {

  const inset = useSafeAreaInsets();

  return (
    <Layout {...props} style={{ ...styles.container, paddingTop: inset.top }}>
      <Text category="h6">Sistema Médico</Text>  
      <UserProfile />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

});


