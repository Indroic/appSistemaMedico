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
  Avatar,
} from "@ui-kitten/components";
import { StyleSheet } from "react-native";

import { addMedico, getEspecialidades } from "../../../axios";

import type { Especialidad, Medico } from "../../../types";

import { useFormik } from "formik";

import * as yup from "yup";

import { useRouter } from "expo-router";

import * as FileSystem from "expo-file-system";

import * as ImagePicker from "expo-image-picker";

import { Pressable } from "react-native";

import { useAuth } from "../../context/AuthContext";

import { MedicosContext } from "../../MedicosProvider";

export default function Medicos() {
  const [desactivar, setDesactivar] = React.useState<boolean>(false)

  const [especialidades, setEspecialidades] = React.useState<Especialidad[]>(
    []
  );
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>();

  const [selectedMedicImage, setSelectedMedicImage] = React.useState(null);

  const [selectedEspecialidad, setSelectedEspecialidad] =
    React.useState<string>("");

  const [loading, setLoading] = React.useState<boolean>(true);

  const router = useRouter();

  const { authState } = useAuth();

  const { agregarMedico } = React.useContext(MedicosContext)

  const cacheAvatar = async (uri: string) => {
    const cacheDirectory = FileSystem.cacheDirectory;
    const fileName = uri.split("/").pop();
    const filePath = `${cacheDirectory}${fileName}`;
    await FileSystem.copyAsync({ from: uri, to: filePath });
    return filePath;
  };

  const ImageViewer = ({ selectedImage }) => {
    const imageSource = selectedImage
      ? { uri: selectedImage }
      : {
          uri: "https://rnkqnkvcketqhptlupct.supabase.co/storage/v1/object/public/storage-medics/avatars/avatar-placeholder.png",
        };

    return (
      <Avatar
        source={imageSource}
        size="large"
        style={{ width: 90, height: 90 }}
      />
    );
  };

  const selectAavatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [3, 4],
    });

    if (!result.canceled) {
      const filePath = await cacheAvatar(result.assets[0].uri);
      setSelectedMedicImage(filePath);
    }
  };

  const validator = yup.object().shape({
    nombre: yup
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .required("El nombre es requerido"),
    apellido: yup
      .string()
      .min(3, "El apellido debe tener al menos 3 caracteres")
      .required("El apellido es requerido"),
    email: yup
      .string()
      .email("El correo electrónico debe ser válido")
      .required("El correo electrónico es requerido"),
    telefono: yup
      .string()
      .matches(/^0[1-9]{1,10}$/, "El Número de Teléfono es inválido")
      .min(11, "El teléfono debe tener al menos 11 caracteres")
      .max(11, "El teléfono debe tener máximo 11 caracteres")
      .required("El teléfono es requerido"),
    institucion: yup
      .string()
      .min(3, "La institución debe tener al menos 3 caracteres")
      .required("La institución es requerida"),
    especialidad: yup
      .number()
      .min(1, "La especialidad es requerida")
      .required("La especialidad es requerida"),
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      especialidad: null,
      telefono: "",
      email: "",
      institucion: "",
    },
    onSubmit: (values) => {
      const addmedicoRequest = async () => {
        try {
          let result: Medico = await addMedico(values, authState.token);
          if (selectedMedicImage) {
            result = JSON.parse(
              (await FileSystem.uploadAsync(
                `https://backend-medics.vercel.app/api/medicos/${result.id}/`,
                selectedMedicImage,
                {
                  fieldName: "foto",
                  httpMethod: "PATCH",
                  uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Token ${authState.token}`,
                  },
                }
              )).body
            )

          }

          agregarMedico(result)
          formik.resetForm();
          setSelectedEspecialidad("");
          setSelectedMedicImage(null)
          setSelectedIndex(null)
          setDesactivar(false)
          router.replace("/(tabs)/medicos");
        } catch (error) {
          let errors = error.response.data;

          Object.keys(errors).forEach((key) => {
            formik.setFieldError(key, errors[key]);
          });
          setDesactivar(false)
        }
      };

      addmedicoRequest();
    },
    validationSchema: validator,
  });

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
      <Pressable
        onPress={selectAavatar}
        style={{ width: "auto", height: "auto", alignItems: "center" }}
      >
        <ImageViewer selectedImage={selectedMedicImage} />
        <Text category="h6">Foto de Medico</Text>
      </Pressable>
      <Layout level="2" style={styles.inputs}>
        <Input
          id="nombre"
          label={"Nombre"}
          value={formik.values.nombre}
          onChange={(e) => formik.setFieldValue("nombre", e.nativeEvent.text)}
          status={formik.errors.nombre ? "danger" : "basic"}
          caption={formik.errors.nombre}
          disabled={desactivar}
        />
        <Input
          id="apellido"
          label={"Apellido"}
          value={formik.values.apellido}
          onChange={(e) => formik.setFieldValue("apellido", e.nativeEvent.text)}
          status={formik.errors.apellido ? "danger" : "basic"}
          caption={formik.errors.apellido}
          disabled={desactivar}
        />

        <Select
        disabled={desactivar}
          id="especialidad"
          onSelect={(index: IndexPath) => {
            setSelectedIndex(index);
            setSelectedEspecialidad(especialidades[index.row].especialidad);
            formik.setFieldValue("especialidad", especialidades[index.row].id);
          }}
          selectedIndex={selectedIndex}
          label="Especialidad"
          value={selectedEspecialidad}
          placeholder="Seleccione Especialidad"
          status={formik.errors.especialidad ? "danger" : "basic"}
          caption={formik.errors.especialidad?.toString()}
        >
          {especialidades.map((especialidad) => (
            <SelectItem
              key={especialidad.id}
              title={especialidad.especialidad}
            />
          ))}
        </Select>

        <Input
          id="telefono"
          label={"Telefono"}
          value={formik.values.telefono}
          onChange={(e) => formik.setFieldValue("telefono", e.nativeEvent.text)}
          status={formik.errors.telefono ? "danger" : "basic"}
          caption={formik.errors.telefono?.toString()}
          disabled={desactivar}
        />
        <Input
          id="email"
          label={"Email"}
          value={formik.values.email}
          onChange={(e) => formik.setFieldValue("email", e.nativeEvent.text)}
          status={formik.errors.email ? "danger" : "basic"}
          caption={formik.errors.email?.toString()}
          disabled={desactivar}
        />
        <Input
          id="institucion"
          label={"Institucion"}
          value={formik.values.institucion}
          onChange={(e) =>
            formik.setFieldValue("institucion", e.nativeEvent.text)
          }
          status={formik.errors.institucion ? "danger" : "basic"}
          caption={formik.errors.institucion?.toString()}
          disabled={desactivar}
        />
      </Layout>
      <Button disabled={desactivar} style={styles.button} onPress={() => {formik.handleSubmit(); setDesactivar(true)}}>
        Agregar Medico
      </Button>
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
