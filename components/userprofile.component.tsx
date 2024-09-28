import React from "react";

import {
  Layout,
  Avatar,
  Text,
  OverflowMenu,
  MenuItem,
} from "@ui-kitten/components";
import { StyleSheet } from "react-native";

import { Pressable } from "react-native";

import { useAuth } from "../app/context/AuthContext";

import { useRouter } from "expo-router";

export default function UserProfile() {
  const { authState, onLogout } = useAuth();
  const [visible, setVisible] = React.useState(false);
  const router = useRouter();

  const renderToggleButton = (): React.ReactElement => (
    <Pressable onPress={() => setVisible(!visible)}>
      <Layout style={styles.container}>
        <Text category="h6">{authState.user?.username}</Text>
        <Avatar
          source={{
            uri: authState.user?.avatar
              ? authState.user?.avatar
              : "https://rnkqnkvcketqhptlupct.supabase.co/storage/v1/object/public/storage-medics/avatars/avatar-placeholder.png",
          }}
        />
      </Layout>
    </Pressable>
  );

  return (
    <Pressable onPress={() => setVisible(!visible)}>
      <Layout>
        <OverflowMenu anchor={renderToggleButton} visible={visible}>
          <MenuItem
            title={"Cerrar Sesión"}
            onPress={() => {
              onLogout();
              router.navigate("/");
              setVisible(false);
            }}
          />
        </OverflowMenu>
      </Layout>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#00FF0000",
  },
});
