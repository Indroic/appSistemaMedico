import React from "react";
import {
  Layout,
  Text,
  Button,
  Icon,
  Spinner,
  List,
  Avatar
} from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";

import type { Examen } from "../../../types";
import { getExamenes, getMedicos } from "../../../axios";

import { useAuth } from "../../context/AuthContext";

import { ExamenesContext } from "../../ExamenesProvider";

const PlusIcon = (props) => <Icon name="plus-outline" {...props} />;



export default function Medicos() {
  const [loading, setLoading] = React.useState(false);
  const [examenes, setExamenes] = React.useState<Examen[]>([]);
  const { authState } = useAuth();

  const inset = useSafeAreaInsets();

  const { examenes: examenesC } = React.useContext(ExamenesContext)

  React.useEffect(() => {
    const fetchMedicos = async () => {
      try {
        let examenes: { examenes: Examen[] } = await getExamenes(
          authState.token
        );

        setExamenes(examenes.examenes);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMedicos();
  }, [examenesC]);

  const renderItem = ({ item, index }: { item: Examen; index: number }) => {
    return (
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
        <Layout style={{ flex: 1, flexDirection:"column" }}>
          <Text>
            {item.titulo}
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
            <Text>{item.categoria.categoria}</Text>
            <Text>{item.create_at.split("T")[0]}</Text>
          </Layout>
        </Layout>
      </Layout>
    );
  };

  if (loading) {
    return (
      <Layout
        style={{
          ...styles.container,
          paddingBottom: inset.bottom,
          paddingTop: inset.top,
          paddingHorizontal: 20,
        }}
        level="2"
      >
        <Spinner size="giant" />
        <Text>Cargando Lista de Médicos</Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container} level="2">
      <List
        data={examenes}
        style={{
          ...styles.container,
          paddingBottom: inset.bottom,
          paddingTop: inset.top,
        }}
        renderItem={renderItem}
      ></List>
      <Link href="/examenes/addExamen" asChild>
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
