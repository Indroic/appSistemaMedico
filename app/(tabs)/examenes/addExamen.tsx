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

import { addExamen, getCategorias } from "../../../axios";

import type { Categoria } from "../../../types";

import { useFormik } from "formik";

import * as yup from "yup";

import { useAuth } from "../../context/AuthContext";

import { useRouter } from "expo-router";

import * as DocumentPicker from "expo-document-picker";

import * as FileSystem from "expo-file-system";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function addExamenF() {
  const [categoria, setCategoria] = React.useState<Categoria[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>();

  const [selectedCategoria, setSelectedCategoria] = React.useState<string>("");

  const [selectFileName, setSelectFileName] = React.useState<string>("");

  const [loading, setLoading] = React.useState<boolean>(true);

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const validator = yup.object().shape({
    titulo: yup.string().required("El nombre es requerido"),
    categoria: yup.string().required("La categoria es requerida"),
    descripcion: yup.string().required("La descripción es requerida"),
    archivo: yup.string().required("El archivo es requerido"),
  });

  const { authState } = useAuth();

  const selectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: "application/*",
      multiple: false,
    });

    if (!result.canceled) {
      let filename = result.assets[0].name;

      if (result.assets[0].size / (1024 * 1024) > 1.8) {
        formik.setErrors({
          archivo: "El archivo es demasiado grande",
        });

        return;
      }

      setSelectFileName(filename);

      formik.setFieldValue("archivo", result.assets[0].uri);

      return;
    }

    return;
  };

  const formik = useFormik({
    initialValues: {
      titulo: "",
      categoria: null,
      archivo: null,
      descripcion: "",
      agregado_por: authState.user.id
    },
    onSubmit: (values) => {
      const addExamenRequest = async () => {
        try {

          const result:{
            id: string;
            categoria: string;
            create_at: string;
            update_at: string;
            descripcion: string;
            agregado_por: string;
            archivo: string;
          } = await addExamen({titulo: values.titulo, categoria:values.categoria, descripcion: values.descripcion, agregado_por: values.agregado_por}, authState.token);


          await FileSystem.uploadAsync(
            "https://backend-medics.vercel.app/api/examenes/" + result.id + "/",
            values.archivo,
            {
              fieldName: "archivo",
              httpMethod: "PATCH",
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Token ${authState.token}`,
              },
            }
          )

          formik.resetForm();
          setSelectedCategoria("");
          router.replace("/(tabs)/examenes");
        } catch (error) {
          let errors = error.response.data;
          console.log(error)
          Object.keys(errors).forEach((key) => {
            formik.setFieldError(key, errors[key]);
          });
        }
      };

      addExamenRequest();
    },
    validationSchema: validator,
  });

  React.useEffect(() => {
    const fetchcategoria = async () => {
      const categorias = await getCategorias();
      setCategoria(categorias);
      setLoading(false); // Se establece en false cuando se obtienen los datos
    };

    fetchcategoria();
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
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
      level="2"
    >
      <Text category="h5">Agregar Examen</Text>
      <Layout level="2" style={styles.inputs}>
        <Input
          label={"Titulo"}
          placeholder="Titulo"
          onChange={(e) => formik.setFieldValue("titulo", e.nativeEvent.text)}
          value={formik.values.titulo}
          caption={formik.errors.titulo ? formik.errors.titulo : ""}
          status={formik.errors.titulo ? "danger" : "basic"}
        />

        <Select
          id="Categoria"
          onSelect={(index: IndexPath) => {
            setSelectedIndex(index);
            setSelectedCategoria(categoria[index.row].categoria);
            formik.setFieldValue("categoria", categoria[index.row].id);
          }}
          selectedIndex={selectedIndex}
          label="Categoria"
          placeholder={"Selecciona una categoria"}
          value={selectedCategoria}
          caption={
            formik.errors.categoria ? formik.errors.categoria.toString() : ""
          }
          status={formik.errors.categoria ? "danger" : "basic"}
        >
          {categoria.map((categoria) => (
            <SelectItem key={categoria.id} title={categoria.categoria} />
          ))}
        </Select>

        <Button
          style={styles.button}
          status={formik.errors.archivo ? "danger" : "basic"}
          appearance="outline"
          onPress={selectFile}
        >
          {formik.errors.archivo
            ? formik.errors.archivo.toString()
            : selectFileName
            ? selectFileName
            : "Seleccionar Archivo"}
        </Button>

        <Input
          label={"Descripción"}
          placeholder="Descripción"
          style={styles.multilineInput}
          multiline
          onChange={(e) =>
            formik.setFieldValue("descripcion", e.nativeEvent.text)
          }
          value={formik.values.descripcion}
          caption={formik.errors.descripcion ? formik.errors.descripcion : ""}
          status={formik.errors.descripcion ? "danger" : "basic"}
        />
      </Layout>
      <Button style={styles.button} onPress={() => formik.handleSubmit()}>
        Agregar Examen
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 20,
  },
  inputs: {
    width: "100%",
    gap: 10,
  },
  button: {
    width: "100%",
  },
  multilineInput: {
    minHeight: "30%",
  },
});
