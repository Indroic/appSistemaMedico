import React, { useMemo } from "react";
import {
  Layout,
  Text,
  Button,
  Icon,
  Spinner,
  List,
  Avatar,
} from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";

import { Pressable } from "react-native";

import type { Medico } from "../../../types";


const PlusIcon = (props) => <Icon name="plus-outline" {...props} />;

import { useMedicosStore } from "../../../stores";

export default function Medicos() {
  const inset = useSafeAreaInsets();

  const { medicos: medicosStore } = useMedicosStore();

  const [medicos, setMedicos] = React.useState<Medico[]>([]);

  useMemo(() =>{
    setMedicos(medicosStore)
  }, [medicosStore])

  const renderItem = ({ item, index }: { item: Medico; index: number }) => {
    
    return (
      <Link href={`/(tabs)/medicos/${item.id}`} asChild={true}>
        <Pressable>
        <Layout
          level="1"
          style={{
            padding: 10,
            flexDirection: "row",
            marginVertical: 5,
            marginHorizontal: 10,
            borderRadius: 10,
            gap: 10,
          }}
        >
          <Avatar
            source={
              item.foto
                ? { uri: item.foto }
                : {
                    uri: "https://rnkqnkvcketqhptlupct.supabase.co/storage/v1/object/public/storage-medics/avatars/avatar-placeholder.png",
                  }
            }
          />
          <Layout style={{ flex: 1, flexDirection: "column" }}>
            <Text>
              {item.nombre} {item.apellido}
            </Text>

            <Layout
              level="1"
              style={{
                flexDirection: "row",
                gap: 10,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text>{item.especialidad.especialidad}</Text>
              <Text>{item.telefono}</Text>
            </Layout>
          </Layout>
        </Layout>
        </Pressable>
      </Link>
    );
  };

  return (
    <Layout style={styles.container} level="2">
      <List
        data={medicos}
        style={{
          ...styles.container,
          paddingBottom: inset.bottom,
          paddingTop: inset.top,
        }}
        renderItem={renderItem}
      ></List>
      <Link href="/medicos/addMedico" asChild={true}>
        <Button style={styles.button} accessoryLeft={PlusIcon} size="large" />
      </Link>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 1000,
    width: 50,
    height: 50,
    zIndex: 20,
  },
});
