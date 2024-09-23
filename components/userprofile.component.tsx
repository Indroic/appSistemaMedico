import React from "react";

import { Layout, Avatar, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

import { useAuth } from "../app/context/AuthContext";

import { Image } from "react-native";

export default function UserProfile() {
  const { authState } = useAuth();

  return (
    <Layout style={styles.container}>
      <Text category="h6">{authState.user?.username}</Text>
      <Avatar source={{ uri: authState.user?.avatar ? authState.user?.avatar : "https://avatar.iran.liara.run/public" }} />
    </Layout>
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
