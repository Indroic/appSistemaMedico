import React from "react";
import { Layout, Text, Button, Icon } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Link } from "expo-router";

const PlusIcon = (props) => <Icon name="plus-outline" {...props} />;

export default function Medicos() {


  return (
    <Layout
      style={{
        ...styles.container,
      }}
      level="2"
    >
      <Text>Este es el Area de Médicos</Text>

      <Link href="/medicos/addMedico" asChild>
        <Button style={styles.button} accessoryLeft={PlusIcon} size="large" />
      </Link>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 1000,
    width: 50,
    height: 50,
  },
});
