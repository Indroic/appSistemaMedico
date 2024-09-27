import React from "react";
import { Layout, Text, Button, Icon } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

import { Link } from "expo-router";



const PlusIcon = (props) => <Icon name="plus-outline" {...props} />;

export default function Examenes() {
  return (
    <Layout style={styles.container} level="2">
      <Text>Este es el Area de Examenes</Text>
      <Link href="/examenes/addExamen" asChild>
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
