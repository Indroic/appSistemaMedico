import React from "react";
import {
  Layout,
  Text,
  Button,
  Input,
  Select,
  SelectItem,
  IndexPath,
  Spinner,
} from "@ui-kitten/components";
import { StyleSheet } from "react-native";

import { getEspecialidades } from "../../../../axios";

import type { Especialidad } from "../../../../types";

export default function Medicos() {
  const [especialidades, setEspecialidades] = React.useState<Especialidad[]>(
    []
  );
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>();

  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchEspecialidades = async () => {
      const especialidadess = await getEspecialidades();
      setEspecialidades(especialidadess);
      setLoading(false); // Se establece en false cuando se obtienen los datos
    };

    fetchEspecialidades();
  }, []);

  if (loading) {
    return (
      <Layout style={styles.container} level="2">
        <Spinner />
      </Layout>
    );
  }
  return (
    <Layout
      style={{
        ...styles.container,
      }}
      level="2"
    >
      <Text category="h5">Agregar Medico de Confianza</Text>
      <Layout level="2" style={styles.inputs}>
        <Input id="nombre" label={"Nombre"} />
        <Input id="apellido" label={"Apellido"} />

        <Select
          id="especialidad"
          onSelect={(index: IndexPath) => {
            setSelectedIndex(index);
            setSelectedValue(especialidades[index.row].especialidad);
          }}
          selectedIndex={selectedIndex}
          label="Especialidad"
          value={selectedValue}
          placeholder="Seleccione una Especialidad"
        >
          {especialidades.map((especialidad) => (
            <SelectItem
              key={especialidad.id}
              title={especialidad.especialidad}
            />
          ))}
        </Select>

        <Input id="teléfono" label={"Telefono"} />
        <Input id="email" label={"Email"} />
        <Input id="institucion" label={"Institucion"} />
      </Layout>
      <Button style={styles.button}>Agregar Medico</Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 15,
    height: "100%",
  },
  inputs: {
    width: "100%",
    gap: 10,
  },
  button: {
    width: "100%",
  },
});
